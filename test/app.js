import React, {Component} from "react";
import Router from "./router";
import {View,Text} from "react-native";


class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
		console.log("init home");
	}

	componentDidMount() {
		console.log("home did mount");
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text onPress={event=> {
					this.props.navigator.$push("register", {
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>ADD</Text>
						}
					});
				}}>go register</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: false
					});
				}}>show navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: true
					});
				}}>hide navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						title: "New Title"
					});
				}}>set title</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						title: "New Home"
					});
				}}>refresh</Text>
				<Text onPress={event=> {
					this.props.navigator.$replace("register");
				}}>replace</Text>
				<Text>go account</Text>
				<Text onPress={event=> {
					this.setState({count: this.state.count + 1});
				}}>{this.state.count}</Text>
			</View>
		);
	}
}

class RegisterStep1 extends Component {

	constructor(props) {
		super(props);
		console.log("init register step1");
	}

	componentDidMount() {
		this.props.navigator.$refreshNavBar({
			title: "abc"
		});
		// setTimeout(()=>{
		// 	this.props.navigator.$refreshNavBar({
		// 		title: "abc"
		// 	});
		// },1000);
		console.log("did mount");
	}

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>

				<Text onPress={event=> {
					this.props.navigator.$push("register/step2", {
						message: "我是来自注册第一步的参数"
					});
				}}>go to register step2</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: true
					});
				}}>hide navigation bar</Text>
			</View>
		);
	}
}

class RegisterStep2 extends Component {

	render() {
		return (
			<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
				<Text onPress={event=> {
					this.props.navigator.$pop();
				}}>back</Text>
				<Text>{this.props.route.message}</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: false
					});
				}}>show navigation bar</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>REGISTER</Text>
						}
					});
				}}>show right button</Text>
				<Text onPress={event=> {
					this.props.navigator.$refreshNavBar({
						renderRightButton: null
					});
				}}>hide right button</Text>
			</View>
		);
	}
}

export default class APP extends Component {
	render() {
		return (
			<Router ref="router" renderTitle={(route)=> {
				return <Text style={{color: "white"}}>{route.title}</Text>;
			}}
					renderLeftButton={(route, navigator, index)=> {
						if (index > 0) {
							return <Text style={{color: "white"}} onPress={event=> {
								navigator.$pop();
							}}>back</Text>
						}
						return null;
					}}
					navigationBarStyle={{backgroundColor: "black"}}
					routes={[{
						path: "home",
						title: "Home",
						component: <Home></Home>
					}, {
						path: "register",
						title: "Register-Step1",
						component: <RegisterStep1></RegisterStep1>,
						routes: [{
							path: "step2",
							title: "Register-Step2",
							hideNavigationBar: true,
							component: <RegisterStep2/>
						}]
					}]}></Router>
		);
	}
}