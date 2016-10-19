# react-native-router
react-native-router 是对navigator的一个封装，以配置的方式管理所有的页面及其他功能。

# Install
```bash
npm install https://github.com/MonkeyKingPlus/react-native-router.git --save
```

# Example
```javascript
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
```

## Router Property

### renderTitle(optional)
type:function
parameter:(route,navigator,index,navState)
default:
```javascript
<Text>{route.title}</Text>
```
设置NavigationBar中title的样式，必须返回一个component。

### renderLeftButton(required)
type:function
parameter:(route,navigator,index,navState)
设置back键，默认返回null（即隐藏back键）

### navigationBarStyle(optional)
type:object
NavigationBar的样式

### routes(required)
type:array
路由配置

### configureScene(optional)
type:function
default:Navigator.SceneConfigs.HorizontalSwipeJump
配置页面切换动画，具体参见[React Native Navigator](https://facebook.github.io/react-native/docs/navigator.html#configurescene)

### onChange(optional)
当router变化时($push,$pop,$replace,$refreshNavBar)会执行onChange

#### routes.item 数据结构如下

* path(required)
type:string
路由名称
* title(required)
type:string
NavigationBar的标题
* renderLeftButton(optional)
type:function
parameter:(route,navigator,index,navState)
设置back键，如果提供了此方法将重写Router.renderLeftButton
* renderRightButton(optional)
type:function
parameter:(route,navigator,index,navState)
设置导航右边的按钮
* renderTitle(optional)
type:function
parameter:(route,navigator,index,navState)
设置NavigationBar中的title，如果提供了此方法将重写Router.renderTitle
* hideNavigationBar(optional)
type:boolean
default:false
是否隐藏NavigationBar
* routes(optional)
type:array
配置子路由，array中item的类型和routes.item一样
* component(required)
type:component
path对应的页面
* onEnter(optional) type:function parameter(route) 在route push时调用。如果要拦截当前的path，可以返回一个新的path，
也可以什么都不返回，对于认证非常有用。

PS：如果在onEnter中返回了一个新的有效的path，在route中将可以访问之前的route和path，分别对应$previousRoute,$previousPath

## navigator methods
### $push(path[,route])
跳转到下一个route，如：
```javascript
this.props.navigator.$push("register")
```
如果是嵌套的route，path的结构类似url，如：
```javascript
this.props.navigator.$push("register/register-step2");
```
在Router.routes中已经对每个route进行了配置，如果在$push之前想重写已经配置的route属性，可以通过第二个参数进行修改，如：
```javascript
this.props.navigator.$push("register",{
	title:"Register"
});
```
页面间传递参数这个方法同样适用。
### $pop()
返回上一个route
### $replace(path[,route])
替换当前的route，第二个参数的作用和$push一样。
### $refreshNavBar([route])
PS:此方法不能在Component的生命周期中进行调用,如:componentDidMount,应该在sceneDidFocus中进行调用

更新navigationBar的样式.包括title,renderLeftButton,renderRightButton,hideNavigationBar,目前仅支持这4个参数。
如:
```javascript
this.props.navigator.$refreshNavBar({
    title:"test",
    renderLeftButton:()=>{},
    renderRightButton:()=>{}
})
```

## Router event
### sceneDidFocus(route)
[参见Navigator.onDidFocus](https://facebook.github.io/react-native/docs/navigator.html#ondidfocus)

## Authentication
路由配置
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


