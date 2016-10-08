import React, {Component, PropTypes} from "react";
import {Navigator} from "react-native";
let {NavigationBar}=Navigator;

class NavigationBarEx extends NavigationBar {
	get currentRoute() {
		let routes = this.props.navState.routeStack;
		if (routes.length && routes.length > 0) {
			return Object.assign({}, routes[routes.length - 1]);
		}
		return null;
	}

	render() {
		if (this.currentRoute && this.currentRoute.hideNavigationBar) {
			return null;
		}
		return super.render();
	}

	refresh(ops = {}) {
		let routes = this.props.navState.routeStack;
		let route = routes[routes.length - 1];
		routes[routes.length - 1] = Object.assign({}, route, ops);
		this.forceUpdate();
	}
}

class NavigatorEx extends Navigator {
	get currentRoute() {
		let routes = this.state.routeStack;
		if (routes.length && routes.length > 0) {
			return Object.assign({}, routes[routes.length - 1]);
		}
		return null;
	}

	_findRouteByPath(path) {
		let routes = this.props.routes;
		let pathNames = path.split("/");
		let route;
		while (pathNames.length > 0) {
			let pathName = pathNames.shift();
			if (route) {
				if (route.routes) {
					route = route.routes.find(r=>r.path === pathName);
				}
				else {
					throw new Error(`${route.path} not defined routes`);
				}
			}
			else {
				route = this.props.routes.find(r=>r.path === pathName);
			}
		}
		if (!route) {
			throw new Error(`route not found , path = ${path}`);
		}
		return route;
	}


	$push(path, ops = {}) {
		let route = {
			...this._findRouteByPath(path),
			...ops
		};
		if (route.onEnter && typeof route.onEnter === "function") {
			let redirectPath = route.onEnter(route);
			if (redirectPath) {
				route = {
					...this._findRouteByPath(redirectPath),
					...ops,
					$previousPath: path,
					$previousRoute: route
				}
			}
		}
		this.push(route);
	}

	$pop() {
		this.pop();
	}

	$replace(path, ops = {}) {
		let route = {
			...this._findRouteByPath(path),
			...ops
		};
		this.replace(route);
	}

	$refreshNavBar(ops = {}) {
		setTimeout(()=> {
			this._navBar.refresh(ops);
		}, 128);
	}

}

export default class Router extends Component {
	constructor(props) {
		super(props);
		this.initialRoute = props.routes[0];
		this.currentRoute = this.initialRoute;
		this.navigationBarEx = <NavigationBarEx ref="navigationBar" {...this._buildNavigationBar()}/>;
	}

	static propTypes = {
		renderLeftButton: PropTypes.func.isRequired,
		renderTitle: PropTypes.func,
		routes: PropTypes.array.isRequired,
		navigationBarStyle: PropTypes.object,
		configureScene: PropTypes.func
	}

	static defaultProps = {
		navigationBarStyle: {},
		configureScene: ()=> {
			return Navigator.SceneConfigs.PushFromRight;
		}
	};

	_buildNavigationBar() {
		let defaultRenderLeftButton = this.props.renderLeftButton;
		let defaultRenderTitle = this.props.renderTitle;
		let defaultNavigationBarStyle = this.props.navigationBarStyle;
		let navigationBarProps = {
			routeMapper: {
				LeftButton: (route, navigator, index, navState) => {
					if (index > 0) {
						if (route.renderLeftButton) {
							return route.renderLeftButton(route, navigator, index, navState);
						}
						if (defaultRenderLeftButton) {
							return defaultRenderLeftButton(route, navigator, index, navState);
						}
						console.warn("Router.renderLeftButton is missed.");
					}
					return null;
				},
				RightButton: (route, navigator, index, navState) => {
					if (route.renderRightButton) {
						return route.renderRightButton(route, navigator, index, navState);
					}
					return null;
				},
				Title: (route, navigator, index, navState) => {
					if (route.renderTitle) {
						return route.renderTitle(route, navigator, index, navState);
					}
					if (defaultRenderTitle) {
						return defaultRenderTitle(route, navigator, index, navState);
					}
					return <Text style={{color: "white"}}>{route.title}</Text>;
				}
			},
			style: defaultNavigationBarStyle
		};
		return navigationBarProps;
	}

	render() {
		return (
			<NavigatorEx initialRoute={this.initialRoute}
						 routes={this.props.routes}
						 ref="navigator"
						 navigationBar={this.navigationBarEx}
						 configureScene={(route, routeStack)=> {
							 return this.props.configureScene(route, routeStack);
						 }}
						 renderScene={(route, navigator)=> {
							 this.currentRoute = route;
							 /*
							  if (route.onEnter) {
							  let needRenderComponent = route.onEnter(route);
							  if (!needRenderComponent) {
							  throw  new Error(`${route.path} must return a available component when fire onEnter`);
							  }
							  return React.cloneElement(needRenderComponent, {
							  route: route,
							  navigator: navigator
							  });
							  }
							  */
							 return React.cloneElement(route.component, {
								 route: route,
								 navigator: navigator
							 });
						 }}></NavigatorEx>
		);
	}
}