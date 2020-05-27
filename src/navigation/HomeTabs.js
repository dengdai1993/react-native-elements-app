import React from 'react';
import {createBottomTabNavigator, BottomTabBar} from 'react-navigation-tabs';
import {Icon} from 'react-native-elements';

import InputTab from '../tabs/input';
import SearchTab from '../tabs/SearchTab';
import MapTab from "../tabs/MapTab";
import SignTab from "../tabs/SignTab";
import Constants from "expo-constants";
import {Image, Text, TouchableOpacity} from "react-native";

const TabBarComponent = props => <BottomTabBar {...props} />;

const HomeBtn = () => {
    return <TouchableOpacity
        style={{
            backgroundColor: 'blue',
            width: 100,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center'
        }}
        onPress={() => {
            console.log('点击了主页')
        }}
    >
        <Text style={{color: 'white', fontSize: 20}}>主页</Text>

    </TouchableOpacity>
}

const HomeTabs = createBottomTabNavigator(
    {
        MapTab: {
            screen: MapTab,
            path: '/map',
            navigationOptions: {
                header: null,
                tabBarLabel: '汉服地图',
                showLabel: false,
                tabBarIcon: ({tintColor, focused}) => (
                    <Icon
                        name={focused ? 'emoticon-cool' : 'emoticon-neutral'}
                        size={24}
                        type="material-community"
                        color={tintColor}
                    />
                ),
                // tabBarOnPress:  (navigation) => {
                //     console.log(JSON.stringify(navigation))
                //     // if (obj.scene.route.params && obj.scene.route.params.queryList) {
                //     //     obj.scene.route.params.queryList();//查询数据
                //     // }
                //     navigation.jumpToIndex(navigation.navigation.state.index);//跳转B页面
                // },

                // async tabBarOnPress({ navigation, defaultHandler }) {
                //     // await navigation.state.params.queryList();
                //     console.log(JSON.stringify(navigation))
                //     defaultHandler();
                // },

                // tabBarOnPress: (navigation) => { // 使用tabBarOnPress点击事件
                //     // if (!navigation.isFocused()) {
                //         // 路由方法, 动态跳转到对应界面
                //         navigation.navigate(navigation.state.routeName, {
                //             title: navigation.state.routeName
                //         })
                //     // }
                // }
            },

        },
        SearchTab: {
            screen: SearchTab,
            path: '/search',
            navigationOptions: {
                header: null,
                tabBarLabel: '云鉴定',
                showLabel: false,
                tabBarIcon: ({tintColor, focused}) => (
                    <Icon
                        name={focused ? 'emoticon-cool' : 'emoticon-neutral'}
                        size={24}
                        type="material-community"
                        color={tintColor}
                    />
                ),
            },
        },
        SignTab: {
            screen: SignTab,
            path: '/',
            navigationOptions: {
                header: null,
                tabBarLabel: '汉服地图',
                tabBarVisible: false,
                tabBarIcon: ({tintColor, focused}) => (
                    <Image source={require("../images/icon_tabbar_3.png")}
                           style={{width: 70, height: 70, marginBottom: 10}}></Image>
                ),
                showLabel: false,
                tabBarOnPress: (navigation) => { // 使用tabBarOnPress点击事件
                    // 路由方法, 动态跳转到对应界面
                    // alert(JSON.stringify(navigation))
                    navigation.navigation.navigate(navigation.navigation.state.routeName, {
                        title: navigation.navigation.state.routeName,
                        backPress: () => {
                            alert("xxx")
                            // navigation.navigation.navigate(navigation.navigation.state.routeName, {});
                        }
                    })
                }

            },

        },
        InputTab: {
            screen: InputTab,
            path: '/input',
            navigationOptions: {
                header: null,
                tabBarLabel: '汉服史料',
                showLabel: false,
                tabBarIcon: ({tintColor, focused}) => (
                    <Icon
                        name="wpforms"
                        size={24}
                        type="font-awesome"
                        color={tintColor}
                    />
                ),
            },
        },
        ShopTab: {
            screen: SearchTab,
            path: '/search',
            navigationOptions: {
                header: null,
                tabBarLabel: '好物推荐',
                showLabel: false,
                tabBarIcon: ({tintColor, focused}) => (
                    <Icon
                        name={focused ? 'emoticon-cool' : 'emoticon-neutral'}
                        size={24}
                        type="material-community"
                        color={tintColor}
                    />
                ),
            },
        },
        // ListsTab: {
        //     screen: ListsTab,
        //     path: '/lists',
        //     navigationOptions: {
        //         tabBarLabel: 'Lists',
        //         tabBarIcon: ({tintColor, focused}) => (
        //             <Icon name="list" size={24} type="entypo" color={tintColor}/>
        //         ),
        //     },
        // },
        //
        // ProfileTab: {
        //     screen: Profile,
        //     path: '/profile',
        //     navigationOptions: {
        //         tabBarLabel: '好物推荐',
        //         tabBarIcon: ({tintColor, focused}) => (
        //             <Icon name="person" size={24} type="material" color={tintColor}/>
        //         ),
        //     },
        // },
        // SettingsTab: {
        //     screen: Settings,
        //     path: '/settings',
        //     navigationOptions: {
        //         tabBarLabel: 'Settings',
        //         tabBarIcon: ({tintColor, focused}) => (
        //             <Icon name="cog" size={24} type="font-awesome" color={tintColor}/>
        //         ),
        //     },
        // },

    },
    {
        initialRouteName: 'MapTab',
        order: ["MapTab", "SearchTab", "SignTab", "InputTab", "ShopTab"],
        animationEnabled: true,
        swipeEnabled: true,
        // Android's default option displays tabBars on top, but iOS is bottom
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: '#e91e63',
            // Android's default showing of icons is false whereas iOS is true
            showIcon: true,
            showLabel: false,
        },
        tabBarComponent: props => {
            const currentIndex = props.navigation.state.index;
            return (
                <TabBarComponent
                    {...props}
                    // style={
                    //     currentIndex === 3 && {
                    //         backgroundColor: 'rgba(47,44,60,1)',
                    //         borderTopWidth: 0,
                    //     }
                    // }
                    navigation={{
                        ...props.navigation,
                        state: {
                            ...props.navigation.state,
                            routes: props.navigation.state.routes,
                        },
                    }}
                />
            );
        },
        navigationOptions: {
            headerStyle: {
                // marginTop: Constants.statusBarHeight
            }
        }
    }
);

export default HomeTabs;


// // Workaround to avoid crashing when you come back on Components screen
// // and you were not on the Buttons tab
// export default createStackNavigator(
//   {
//     ComponentsTabs: { screen: Components },
//   },
//   {
//     headerMode: 'none',
//     navigationOptions: {
//       drawerLabel: 'Components',
//       drawerIcon: ({ tintColor }) => (
//         <Icon
//           name="settings"
//           size={30}
//           iconStyle={{
//             width: 30,
//             height: 30,
//           }}
//           type="material"
//           color={tintColor}
//         />
//       ),
//     },
//   }
// );
