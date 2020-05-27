import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';

import SearchHome from '../views/SearchHome';
import InputDetails from '../views/input_details';

import config from '../config/stack';
import {
    Button,
    Image,
    TouchableHighlight,
    View,
    Text,
    TouchableWithoutFeedback,
    Platform,
    Linking,
    StyleSheet
} from "react-native";
import ProductDetail from "../views/ProductDetail";

const InputTabView = ({navigation}) => <SearchHome navigation={navigation}/>;

const InputDetailTabView = ({navigation}) => (
    <InputDetails
        banner={`${navigation.state.params.name}s Profile`}
        navigation={navigation}
    />
);

const SearchTab = createStackNavigator({
    Input: {
        screen: InputTabView,
        path: '/',
        navigationOptions: ({navigation}) => ({
            header: null,
            title: navigation.getParam('status') ? '汉服(测试)' : '汉服(测试)',
            headerLeft: (
                <TouchableHighlight onPress={() => {
                    navigation.toggleDrawer();
                }}>
                    <Image style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        marginLeft: 16,
                        borderColor: 'green',
                        borderRadius: 13,
                    }}
                           source={{uri: navigation.getParam('avatar') ? navigation.getParam('avatar') : 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/common_icon/icon_unlogin.png'}}
                           onPress={() => navigation.toggleDrawer()}>
                    </Image>
                </TouchableHighlight>

            ),
            headerRight: (<TouchableWithoutFeedback onPress={() => {
                navigation.navigate("ProductDetail", {
                    shopName: "1111"
                });
                // navigation.navigate("ProductDetailRoute", {
                //     shopName: "1111"
                // });
                // showLoginModal();
            }}>
                <Text
                    style={{marginHorizontal: 10}}>{navigation.getParam('name') ? navigation.getParam('name') : '未登录'}</Text>
            </TouchableWithoutFeedback>)
        }),
    },
    ProductDetail: {
        screen: ProductDetail,
        path: '/product_detail',
        navigationOptions: {
            title: '登录',
        },
    },
}, config);

function showLoginModal() {
    // if (Platform.OS === 'web') {
    //     try {
    //         let ua = window.navigator.userAgent.toLowerCase();
    //         if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //             Linking.openURL("https://app.zxyqwe.com/hanbj/mobile/rpcauth?callback=https%3a%2f%2fdp.hanfubj.com&register=https%3a%2f%2factive.qunliaoweishi.com%2fdetect%2fbackground%2fapi%2fregister4web.php");
    //             return;
    //         }
    //     } catch (e) {
    //         alert("登录失败，请重试");
    //     }
    //     alert("暂不支持在浏览器中登录，请在微信中打开");
    // }
    // this.state.dialog.show();

}

function hideLoginModal() {
    this.state.dialog.dismiss();
}



export default SearchTab;