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
import SettingsScreen from "../screens/SettingsScreen";
import SignHome from "../views/SignHome";
import Constants from "expo-constants";
import PublishSign from "../views/PublishSign";

const SignTab = createStackNavigator({
    Sign: {
        screen: SignHome,
        path: '/',
        navigationOptions: ({navigation}) => ({
            header: null
        })
    },
    Publish: {
        screen: PublishSign,
        path: '/',
        navigationOptions: ({navigation}) => ({
            header: null
        })
    }

}, config);


export default SignTab;