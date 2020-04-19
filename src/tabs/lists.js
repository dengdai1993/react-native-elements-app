import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';
import { Icon } from 'react-native-elements';

import ListsHome from '../views/lists_home';

import config from '../config/stack';

const ListsTabView = ({ navigation }) => (
  <ListsHome banner="Lists" navigation={navigation} />
);

const ListsTab = createStackNavigator(
  {
    Home: {
      screen: ListsTabView,
      path: '/',
      navigationOptions: ({ navigation }) => ({
        title: '后台管理',
        headerLeft: (
          <Icon
            name="menu"
            size={30}
            type="entypo"
            containerStyle={{ marginLeft: 10 }}
            onPress={navigation.toggleDrawer}
          />
        ),
      }),
    },
  },
  config
);

export default ListsTab;
