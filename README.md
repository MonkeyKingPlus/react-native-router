# react-native-router
react-native-router 是对navigator的一个封装，以配置的方式管理所有的页面及其他功能。

# Example
`javascript
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
`

## Router Property

### renderTitle(optional)
type:function
parameter:(route,navigator,index,navState)
default:
```javascript
<Text>{route.title}</Text>
```
绘制NavigationBar中title的样式，必须返回一个component。

### renderLeftButton(required)
type:function
parameter:(route,navigator,index,navState)
绘制返回按钮的样式，默认返回null，及没有返回按钮

### navigationBarStyle(optional)
type:object
NavigationBar的样式

### routes(required)
type:array
路由配置

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
绘制返回按钮，如果提供了对应的方法将重写Router.renderLeftButton
* renderRightButton(optional)
type:function
parameter:(route,navigator,index,navState)
绘制导航右边的按钮
* renderTitle(optional)
type:function
parameter:(route,navigator,index,navState)
绘制NavigationBar中的title，如果提供了此方法将重写Router.renderTitle
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