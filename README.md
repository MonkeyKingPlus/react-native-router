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

## Router
### renderTitle
### renderLeftButton
### navigationBarStyle
### routes