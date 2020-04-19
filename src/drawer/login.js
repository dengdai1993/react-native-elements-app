import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {Icon} from 'react-native-elements';

import Login from '../views/login';

import config from '../config/stack';

const LoginDrawerItem = createStackNavigator({
    Playground: {
        screen: Login,
        navigationOptions: ({navigation}) => ({
            title: navigation.getParam('status') ? '个人信息' : '登录',
            headerLeft: (
                <Icon
                    name="menu"
                    size={30}
                    type="entypo"
                    iconStyle={{paddingLeft: 10}}
                    onPress={navigation.toggleDrawer}
                />
            ),
        }),
    },
}, config);

LoginDrawerItem.navigationOptions = {
  drawerLabel: '登录',
  drawerIcon: ({ tintColor }) => (
    <Icon
      name="email"
      size={30}
      iconStyle={{
        width: 30,
        height: 30,
      }}
      type="material"
      color={tintColor}
    />
  ),
};

export default LoginDrawerItem;
