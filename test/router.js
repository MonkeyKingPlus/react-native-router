import React, {Component, PropTypes} from "react";
import {Navigator} from "react-native";

let {NavigationBar}=Navigator;

export const SCENE_DID_FOCUS="SCENE_DID_FOCUS";
export const SCENE_WILL_FOCUS="SCENE_WILL_FOCUS";

/**
 * NavigationBar extension
 * @class
 * @classdesc 增加了refresh方法,可以对navigation bar 进行更细粒度的操作
 * */
class NavigationBarEx extends NavigationBar {
	/**
	 * current route is readonly
	 * */
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

	/**
	 * force refresh navigation bar with ops
	 * @param {object} [ops={}] - the navigation bar ops
	 * @param {string} [ops.title] - title
	 * @param {function} [ops.renderLeftButton] - render left button or back button
	 * @param {function} [ops.renderRightButton] - render right button
	 * @param {function} [ops.renderTitle] - render title
	 * @param {boolean} [ops.hideNavigationBar=false] - it is show navigation bar by ops.hideNavigationBar
	 * */
	refresh(ops = {}) {
		let routes = this.props.navState.routeStack;
		let route = routes[routes.length - 1];
		routes[routes.length - 1] = Object.assign(route, ops);
		this.forceUpdate();
	}
}

/**
 * Navigator extension
 * @class
 * */
class NavigatorEx extends Navigator {
	/**
	 * current route , readonly
	 * */
	get currentRoute() {
		let routes = this.state.routeStack;
		if (routes.length && routes.length > 0) {
			return Object.assign({}, routes[routes.length - 1]);
		}
		return null;
	}



	/**
	 * find target route by path
	 * @param {string} path - path like path1/path2
	 * @returns {object} route
	 * */
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

	/**
	 * push route to router stack
	 * @param {string} path - path
	 * @param {object} ops - ops apply the route which find by path
	 * @param {string} [ops.title] - title
	 * @param {function} [ops.renderLeftButton] - render left button or back button
	 * @param {function} [ops.renderRightButton] - render right button
	 * @param {function} [ops.renderTitle] - render title
	 * @param {boolean} [ops.hideNavigationBar=false] - it is show navigation bar by ops.hideNavigationBar
	 * @param {function} [ops.onEnter]
	 * */
	push2(path, ops = {}) {
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
					prevPath: path,
					prevRoute: route
				}
			}
		}
		super.push(route);
	}


	/**
	 * replace current route with the path
	 * @param {string} path - path
	 * @param {object} ops - ops apply the route which find by path
	 * @param {string} [ops.title] - title
	 * @param {function} [ops.renderLeftButton] - render left button or back button
	 * @param {function} [ops.renderRightButton] - render right button
	 * @param {function} [ops.renderTitle] - render title
	 * @param {boolean} [ops.hideNavigationBar=false] - it is show navigation bar by ops.hideNavigationBar
	 * @param {function} [ops.onEnter]
	 * */
	replace2(path, ops = {}) {
		let route = {
			...this._findRouteByPath(path),
			...ops
		};
		super.replace(route);
	}

	/**
	 * refresh navigation bar with ops
	 * @param {object} [ops={}] - the navigation bar ops
	 * @param {string} [ops.title] - title
	 * @param {function} [ops.renderLeftButton] - render left button or back button
	 * @param {function} [ops.renderRightButton] - render right button
	 * @param {function} [ops.renderTitle] - render title
	 * @param {boolean} [ops.hideNavigationBar=false] - it is show navigation bar by ops.hideNavigationBar
	 * */
	refresh(ops = {}) {
		setTimeout(()=> {
			this._navBar.refresh(ops);
		}, 128);
	}

}

/**
 * Router
 * @class
 * */
export default class Router extends Component {
	constructor(props) {
		super(props);
		this.initialRoute = props.routes[0];
		this.navigationBarEx = <NavigationBarEx ref="navigationBar" {...this._buildNavigationBar()}/>;
	}

	static propTypes = {
		renderLeftButton: PropTypes.func.isRequired,
		renderTitle: PropTypes.func,
		routes: PropTypes.array.isRequired,
		navigationBarStyle: PropTypes.any,
		configureScene: PropTypes.func,
	}

	static defaultProps = {
		navigationBarStyle: {},
		configureScene: ()=> {
			return Navigator.SceneConfigs.HorizontalSwipeJump;
		},

	};

	_buildNavigationBar() {
		let defaultRenderLeftButton = this.props.renderLeftButton;
		let defaultRenderTitle = this.props.renderTitle;
		let defaultNavigationBarStyle = this.props.navigationBarStyle;
		let navigationBarProps = {
			routeMapper: {
				LeftButton: (route, navigator, index, navState) => {
					if (route.renderLeftButton) {
						return route.renderLeftButton(route, navigator, index, navState);
					}
					if (defaultRenderLeftButton) {
						return defaultRenderLeftButton(route, navigator, index, navState);
					}
					console.warn("Router.renderLeftButton is missed.");
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

	_findEvenFromRoute(name, route) {
		if (route.$ref) {
			if (route.$ref[name]) {
				return route.$ref[name].bind(route.$ref);
			}
			if (route.$ref.renderedElement
				&& route.$ref.renderedElement._owner
				&& route.$ref.renderedElement._owner._renderedComponent
				&& route.$ref.renderedElement._owner._renderedComponent._instance
				&& route.$ref.renderedElement._owner._renderedComponent._instance[name]) {
				return route.$ref.renderedElement._owner._renderedComponent._instance[name].bind(route.$ref.renderedElement._owner._renderedComponent._instance);
			}
		}
		return null;
	}

	get navigator(){
		return this.refs.navigator;
	}

	get currentRoute(){
		let len=this.refs.navigator.state.routeStack.length;
		if(len>0){
			return this.refs.navigator.state.routeStack[len-1];
		}
		return null;
	}

	render() {
		return (
			<NavigatorEx
				ref="navigator"
				initialRoute={this.initialRoute}
				onDidFocus={route=> {
					if(this.props.dispatch){
						this.props.dispatch({
							type:SCENE_DID_FOCUS,
							route
						})
					}
					let callback=this._findEvenFromRoute("sceneDidFocus",route);
					if(callback){
						callback(route);
					}
				}}
				onWillFocus={route=> {
					if(this.props.dispatch){
						this.props.dispatch({
							type:SCENE_WILL_FOCUS,
							route
						})
					}
					let callback=this._findEvenFromRoute("sceneWillFocus",route);
					if(callback){
						callback(route);
					}
				}}
				routes={this.props.routes}
				navigationBar={this.navigationBarEx}
				configureScene={(route, routeStack)=> {
					return this.props.configureScene(route, routeStack);
				}}
				renderScene={(route, navigator)=> {
					console.log(route)
					let newProps=Object.assign({},route||{});
					delete newProps.component;
					delete newProps.renderLeftButton;
					delete newProps.renderRightButton;
					delete newProps.hideNavigationBar;
					delete newProps.routes;
					delete newProps.onEnter;
					return <route.component
						ref={ref=> {
							route.ref = ref;
						}}
						navigator={navigator}
						{...newProps}/>
				}}></NavigatorEx>
		);
	}
}