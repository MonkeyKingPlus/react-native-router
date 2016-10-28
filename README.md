# react-native-router
This module is Navigator extension.you can manage all of route with configuration.<br/>
<img src="https://raw.githubusercontent.com/MonkeyKingPlus/react-native-router/master/test/demo/react-native-router-demo.gif"/>

# Install
```bash
npm install mkp-react-native-router --save
```

# Quick Start
```javascript
<Router ref="router" 
        renderTitle={(route)=> {
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
Set title for navigation.<br/>
the default value will return a text node:
```javascript
<Text>{route.title}</Text>
```

## renderLeftButton(route:route,navigator:NavigatorEx,index:number,navState:route[])
Set back button or left button for navigation, null as default value.

## navigationBarStyle
Set navigation style

## routes
The first route as initial route
### type route

* path:string - route path that is required.
* title:string - navigation title
* renderLeftButton(route:route,navigator:NavigatorEx,index:number,navState:route[]):function - set left button for navigation. if it is provided , the Router.renderLeftButton will be ignore.
* renderRightButton(route:route,navigator:NavigatorEx,index:number,navState:route[]):function - set right button for navigation.
* renderTitle(route:route,navigator:NavigatorEx,index:number,navState:route[]):function - if it is provided , the Router.renderTitle will be ignored.
* hideNavigationBar:boolean [hideNavigationBar=false] - whether hide navigation.
* routes:route[] - this is required.
* component:Component
* onEnter(route:route):function - invoke when navigator.$push,you can return a available path to redirect or nothing.

PS:if you return a available path in here , you can access route.$previousRoute and route.$previousPath in new path.

PS:don't be invoked when bootstrap app from initial route.

## configureScene()
configure page transition, you can refer to [React Native Navigator](https://facebook.github.io/react-native/docs/navigator.html#configurescene)<br/>
the default value is Navigator.SceneConfigs.HorizontalSwipeJump.

## onChange(type:string,route:object,path:string)
Invoke when navigator $push,$pop,$replace,$refreshNavBar

# navigator methods
## $push(path:string[,route:route])
router will push to target path.the parameter route will override route which find by path.
```javascript
//go to 'register'
this.props.navigator.$push("register")
//go to 'register/register-step2' 
this.props.navigator.$push("register/register-step2");
//override route which find by path with the second parameter
this.props.navigator.$push("register",{
	title:"Register"
});
```
in addition you can pass props through the second parameter.
```javascript
this.props.navigator.$push("register",{
	tel:"13100000000"
})
```
## $pop()
back to previous route.
## $replace(path[,route])
replace current route with path. the second parameter is the same as $push
## $refreshNavBar([route])
PS:此方法不能在Component的生命周期中进行调用,如:componentDidMount,应该在sceneDidFocus中进行调用

更新navigationBar的样式.包括title,renderLeftButton,renderRightButton,hideNavigationBar,renderTitle,目前仅支持这5个参数。
如:
```javascript
this.props.navigator.$refreshNavBar({
    title:"test",
    renderLeftButton:()=>{},
    renderRightButton:()=>{}
})
```

# Router event
## sceneDidFocus(route)
[参见Navigator.onDidFocus](https://facebook.github.io/react-native/docs/navigator.html#ondidfocus)
```javascript
class TestComponent extends Component{
	sceneDidFocus(){
		//do something
	}
}
```
## sceneWillFocus(route)
[参见Navigator.onWillFocus](https://facebook.github.io/react-native/docs/navigator.html#onwillfocus)
```javascript
class TestComponent extends Component{
	sceneWillFocus(){
		//do something
	}
}
```

# Authentication
路由认证
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
```
登录成功后
```javascript
this.props.navigator.$replace(this.props.route.$previousPath);
```
或者
```javascript
this.props.navigator.$pop();
```
## 启动页实现认证
在启动页中实现sceneDidFocus
```javascript
class Index extends Component{
	sceneDidFocus(){
		this.props.navigator.$replace("login");
	}
}
```
登录成功后
```javascript
this.props.navigator.$replace("index");
```

# How to use Router with Redux
```javascript
import Router from "react-native-router";
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


