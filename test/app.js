import React, {Component} from "react";
import Router from "./router";
import {View, Text, StyleSheet} from "react-native";

const styles = StyleSheet.create({
	container: {
		marginTop: 60
	},
	button: {
		backgroundColor: "black",
		color: "white",
		paddingTop: 10,
		paddingBottom: 10,
		fontSize: 12,
		marginTop: 5,
		marginBottom: 5,
		textAlign: "center"
	},
	link: {
		color: "blue",
		textAlign: "center",
		marginTop: 5,
		marginBottom: 5
	}
});

let isLogin = false;
export function login() {
	isLogin = true;
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		};
	}
	sceneDidFocus(route){
		console.log("home did focus:",route)
	}
	render() {
		return (
			<View
				style={styles.container}>
				<Text style={styles.button} onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: false
					});
				}}>show navigation bar</Text>
				<Text style={styles.button} onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: true
					});
				}}>hide navigation bar</Text>
				<Text style={styles.button} onPress={event=> {
					/*
					this.props.navigator.$refreshNavBar({
						title: "New Title"
					});
					*/
					this.props.navigator.$refreshNavBar({
						title:"New Title",
						renderTitle:(route)=>{
							return <Text style={{color:"red"}}>{route.title}</Text>
						}
					});
				}}>set title</Text>
				<Text style={styles.button} onPress={event=> {
					this.props.navigator.$refreshNavBar();
				}}>refresh</Text>
				<Text style={styles.button} onPress={event=> {
					this.props.navigator.$replace("register");
				}}>replace</Text>
				<Text style={styles.button} onPress={event=> {
					this.setState({count: this.state.count + 1});
				}}>{this.state.count}</Text>
				<Text style={styles.link} onPress={event=> {
					this.props.navigator.$push("register", {
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>ADD</Text>
						}
					});
				}}>go register</Text>
				<Text style={styles.link} onPress={event=> {
					this.props.navigator.$push("mine");
				}}>go account</Text>
			</View>
		);
	}
}

class RegisterStep1 extends Component {

	constructor(props) {
		super(props);
		console.log("init register step1");
	}

	render() {
		return (
			<View style={styles.container}>
				<Text
					style={styles.link}
					onPress={event=> {
					this.props.navigator.$push("register/step2", {
						message: "我是来自注册第一步的参数"
					});
				}}>go to register step2</Text>
				<Text
					style={styles.button}
					onPress={event=> {
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
			<View style={styles.container}>
				<Text>{this.props.route.message}</Text>
				<Text
					style={styles.button}
					onPress={event=> {
					this.props.navigator.$refreshNavBar({
						hideNavigationBar: false
					});
				}}>show navigation bar</Text>
				<Text
					style={styles.button}
					onPress={event=> {
					this.props.navigator.$refreshNavBar({
						renderRightButton: ()=> {
							return <Text style={{color: "white"}}>REGISTER</Text>
						}
					});
				}}>show right button</Text>
				<Text
					style={styles.button}
					onPress={event=> {
					this.props.navigator.$refreshNavBar({
						renderRightButton: null
					});
				}}>hide right button</Text>
			</View>
		);
	}
}

class Mine extends Component {
	render() {
		return <View style={styles.container}>
			<Text>login success</Text>
		</View>
	}
}

class Login extends Component {
	render() {
		return <View style={styles.container}>
			<Text
				style={styles.button}
				onPress={event=> {
				isLogin = true;
				this.props.navigator.$replace(this.props.route.$previousPath);
			}}>login</Text>
		</View>
	}
}

const routes = [{
	path: "home",
	title: "Home",
	component: Home,
	onEnter:()=>{
		console.log("enter home");
	}
}, {
	path: "register",
	title: "Register-Step1",
	component: RegisterStep1,
	routes: [{
		path: "step2",
		title: "Register-Step2",
		component: RegisterStep2
	}],
	onEnter:()=>{
		console.log("enter register");
	}
}, {
	path: "login",
	title: "登录",
	component: Login
}, {
	path: "mine",
	title: "我的",
	component: Mine,
	onEnter: ()=> {
		if (!isLogin) {
			return "login";
		}
	}
}];

export default class APP extends Component {
	render() {
		return (
			<Router ref="router" renderTitle={(route)=> {
				return <Text style={{color: "white"}}>{route.title}</Text>;
			}}
					onChange={(type)=> {
						console.log(type);
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
					routes={routes}></Router>
		);
	}
}