import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';

import SearchHome from '../views/SearchHome';
import MapHome from '../views/MapHome';
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
import {TouchableOpacity} from "react-native-gesture-handler";
import {SCREEN_HEIGHT} from "../utils/DimensionUtil";
import Dialog from "../components/Dialog";
import ProductDetail from "../views/ProductDetail";
import Constants from 'expo-constants';

const MapTab = createStackNavigator({
    Input: {
        screen: MapHome,
        path: '/',
        navigationOptions: ({navigation}) => ({
            header: null,
            headerStyle: {
                marginTop: Constants.statusBarHeight
            },
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


export default MapTab;