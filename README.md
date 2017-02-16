# react-native-router 

<!-- badge -->
[![travis status](https://img.shields.io/travis/MonkeyKingPlus/react-native-router.svg)](https://travis-ci.org/MonkeyKingPlus/react-native-router)
[![npm version](https://img.shields.io/npm/v/mkp-react-native-router.svg)](https://www.npmjs.com/package/mkp-react-native-router)
[![npm license](https://img.shields.io/npm/l/mkp-react-native-router.svg)](https://www.npmjs.com/package/mkp-react-native-router)
[![npm download](https://img.shields.io/npm/dm/mkp-react-native-router.svg)](https://www.npmjs.com/package/mkp-react-native-router)
[![npm download](https://img.shields.io/npm/dt/mkp-react-native-router.svg)](https://www.npmjs.com/package/mkp-react-native-router)
<!-- endbadge -->

此组件是对React Native Navigator的一个封装,让React Native开发的页面以配置的方式配置路由.<br/>
<img src="https://raw.githubusercontent.com/MonkeyKingPlus/react-native-router/master/test/demo/react-native-router-demo.gif"/>

# Install
```bash
npm install mkp-react-native-router --save
```
# Support

IOS/Android

# Quick Start
```javascript
<Router ref="router" 
        renderTitle={(route)=> {
            return <Text style={{color: "white"}}>{route.title}</Text>;
        }}  
        renderLeftButton={(route, navigator, index)=> {
            if (index > 0) {
                return <Text style={{color: "white"}} onPress={event=> {
                    navigator.pop();
                }}>back</Text>
            }
            return null;
        }}
        navigationBarStyle={{backgroundColor: "black"}}
        routes={[{
            path: "home",
            title: "Home",
            component: Home
        }, {
            path: "register",
            title: "Register-Step1",
            component: RegisterStep1,
            routes: [{
                path: "step2",
                title: "Register-Step2",
                hideNavigationBar: true,
                component: RegisterStep2
            }]
        }]}>
</Router>
```

# Router Props

## renderTitle(route:route,navigator:NavigatorEx,index:number,navState:route[])

此方法用于设置如何render Navigation Title.<br/>
默认将按照如下方式进行输出
```javascript
<Text>{route.title}</Text>
```

## renderLeftButton(route:route,navigator:NavigatorEx,index:number,navState:route[])

此方法用于设置如何render left buttons.默认情况下什么也不输出.

## navigationBarStyle

设置导航栏的样式

## routes

路由配置

### type route

* path:string<br/>
route path that is required.
* title:string<br/>
navigation title
* renderLeftButton(route:route,navigator:NavigatorEx,index:number,navState:route[]):function<br/>
set left button for navigation. if it is provided , the Router.renderLeftButton will be ignore.
* renderRightButton(route:route,navigator:NavigatorEx,index:number,navState:route[]):function<br/>
set right button for navigation.
* renderTitle(route:route,navigator:NavigatorEx,index:number,navState:route[]):function<br/>
if it is provided , the Router.renderTitle will be ignored.
* hideNavigationBar:boolean [hideNavigationBar=false]<br/>
whether hide navigation.
* routes:route[]<br/>
this is required.
* component:Component
* onEnter(route:route):function<br/>
invoke when navigator.$push,you can return a available path to redirect or nothing.<br/>
NOTE1:if you return a available path in here , you can access route.$previousRoute and route.prevPath in new path.<br/>
NOTE2:don't be invoked when start app from initial route.

## configureScene()

配置页面的跳转动画,具体值可以参考[React Native Navigator](https://facebook.github.io/react-native/docs/navigator.html#configurescene)<br/>
默认值是Navigator.SceneConfigs.HorizontalSwipeJump.

# navigator methods

## push2(path:string[,route:route])
```javascript
//go to 'register'
this.props.navigator.push2("register")
//go to 'register/register-step2' 
this.props.navigator.push2("register/register-step2");
//override route which find by path with the second parameter
this.props.navigator.push2("register",{
	title:"Register"
});
```
## replace2(path:string[,route:route])
## refresh([route:route])
```javascript
this.props.navigator.refresh({
    title:"test",
    renderLeftButton:()=>{},
    renderRightButton:()=>{}
})
```

# Router event

## sceneDidFocus(route)

参考[Navigator.onDidFocus](https://facebook.github.io/react-native/docs/navigator.html#ondidfocus)
```javascript
class TestComponent extends Component{
	sceneDidFocus(){
		//do something
	}
}
```
## sceneWillFocus(route)

参考[Navigator.onWillFocus](https://facebook.github.io/react-native/docs/navigator.html#onwillfocus)
```javascript
class TestComponent extends Component{
	sceneWillFocus(){
		//do something
	}
}
```

# Authentication
## Example
```javascript
const routes = [{
	path: "home",
	title: "Home",
	component: Home
}, {
	path: "register",
	title: "Register-Step1",
	component: RegisterStep1,
	routes: [{
		path: "step2",
		title: "Register-Step2",
		hideNavigationBar: true,
		component: RegisterStep2
	}]
},{
	path: "login",
	title: "Login",
	component: Login
}, {
	path: "mine",
	title: "Mine",
	component: Mine,
	onEnter: ()=> {
		if (!isLogin) {
			return "login";
		}
	}
}];
```
登录成功后
```javascript
this.props.navigator.replace2(this.props.route.prevPath);
```
或者
```javascript
this.props.navigator.pop();
```

# How to use Router with Redux
```javascript
import Router from "mkp-react-native-router";
import {connect, Provider} from "react-redux";

const RouterWithRedux = connect()(Router);

<Provider store={store}>
        <RouterWithRedux
            navigationBarStyle={navigationStyles.navigationBar}
            renderTitle={(route)=> {
                return (
                    <View style={[navigationStyles.base]}>
                        <Text style={[navigationStyles.title]}>{route.title}</Text>
                    </View>
                );
            }}
            renderLeftButton={(route, navigator, index)=> {
                if (index > 0) {
                    return (
                        <TouchableHighlight
                            style={[navigationStyles.base, navigationStyles.leftButton]}
                            onPress={event=> {
                                navigator.$pop();
                            }}>
                            <Image source={require("./themes/assets/icons/back-icon.png")}/>
                        </TouchableHighlight >
                    );
                }
                return null;
            }}
            routes={routes}></RouterWithRedux>
</Provider>
```
监听action
```javascript
import {ActionTypes} from "mkp-react-native-router";
export function testReducer(state,action){
    switch(action.type){
        case ActionTypes.SCENE_WILL_FOCUS:
            //you can access the route from action.route
            //do something
            break;
        case ActionTypes.SCENE_DID_FOCUS:
            //you can access the route from action.route
            //do something
            break;
        default:
            return state;
    }
}
```

# How to deal with hardware back event on android 
```javascript
class Test extends Component{
    constructor(props){
        super(props);
        BackAndroid.addEventListener("hardwareBackPress",()=>{
            // if router with redux
            //let cur=this.refs.router.renderedElement._owner._renderedComponent._instance.currentRoute;
            //let navigator=this.refs.router.renderedElement._owner._renderedComponent._instance.navigator;
            //else
            //let cur=this.refs.router.currentRoute;
            //let navigator=this.refs.router.navigator;
            let cur=this.refs.router.renderedElement._owner._renderedComponent._instance.currentRoute;
            let navigator=this.refs.router.renderedElement._owner._renderedComponent._instance.navigator;
            if(cur.path==="login" || cur.path==="home"){
                //exit
                confirm("确定要关闭应用吗?",ok=>{
                    if(ok){
                        BackAndroid.exitApp();
                    }
                })
            }
            else{
                navigator.pop();
            }
            return true;
        });
    }
    render(){
        return (
            <Router ref="router"></Router>
        )
    }
}
```

# How to place navigation title in the middle on android?
```javascript
<Router
    renderTitle={(route)=>{
    	return (
    		<View style={{flex:1,justifyContent:"center",alignItems:"center",...Platform.select({
    			android:{
    				width:Dimensions.get("window").width-72*2
    			}
    		})}}>
    		    <Text>{route.title}</Text>
    		</View>
    	);
    }}
    />
```


