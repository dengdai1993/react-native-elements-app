import React from 'react';

import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';

import SearchHome from '../views/SearchHome';
import InputDetails from '../views/input_details';

import config from '../config/stack';
import {Button, Image, TouchableHighlight} from "react-native";
import {TouchableOpacity} from "react-native-gesture-handler";
import Text from "react-native-web/dist/exports/Text";

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
            title: '汉服点评(测试)',
            headerLeft: (
                <TouchableHighlight onPress={() => navigation.toggleDrawer()}>
                    <Image style={{width: 40, height: 40, marginLeft:10}}
                           source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg'}}
                           onPress={() => navigation.toggleDrawer()}>
                    </Image>
                </TouchableHighlight>


            ),
        }),
    },
    Input_Detail: {
        screen: InputDetailTabView,
        path: '/input_detail',
        navigationOptions: {
            title: 'Input Detail',
        },
    },
}, config);

export default SearchTab;
{/*<Icon*/
}
{/*    name="menu"*/
}
{/*    size={30}*/
}
{/*    type="entypo"*/
}
{/*    containerStyle={{ marginLeft: 10 }}*/
}
{/*    onPress={navigation.toggleDrawer}*/
}
{/*/>*/
}