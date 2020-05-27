'use strict';
import React, {Component, useState} from 'react';
import {
    Animated,
    Easing,
    View,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    // Slider,
    Image, ViewPagerAndroid, Linking, ToastAndroidStatic as ToastAndroid, StatusBar, TouchableOpacity, NavigatorIOS
} from 'react-native';
import {
    Input,
    SearchBar,
    Icon,
    Button,
    ThemeProvider, ListItem,
} from 'react-native-elements';
import constants from '../config/constants'
import {scaleSize, SCREEN_WIDTH, sp} from "../utils/DimensionUtil";
import TouchableScale from "react-native-touchable-scale";
import {LinearGradient} from "../components/LinearGradient";
import LoginDrawerItem from "../drawer/login";
import CountTag from "../components/CountTag";
import BaiduMap from "../components/map/BaiduMap";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Asset} from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from "expo-constants";
// import {Camera} from "expo";
import {Camera} from "expo-camera";
import {BottomTabBar} from "react-navigation-tabs";
import TabNavigator from "react-native-tab-navigator";
import Capture from "../components/Capture";

// const [type, setType] = useState(Camera.Constants.Type.back);

export default class MapHome extends Component {

    Bucket = 'hanbei-1256982553';
    Region = 'ap-chengdu';

    static defaultProps = {
        ts: 0
    }

    constructor(props) {
        super(props);
    };

    state = {
        type: Camera.Constants.Type.back,
        selectedTab: "2"
    };

    async getPermissionAsync(that) {
        const {status} = Platform.OS === 'ios' ?
            await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL, Permissions.AUDIO_RECORDING)
            : await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING);
        if (status !== 'granted') {
            alert('请先允许权限!');
            // that.props.navigation.goBack();
        }
        // const types = await Camera.getAvailableCameraTypesAsync();
        // alert(JSON.stringify(types))
        // that.pickImage(that);
    };

    async pickImage(that) {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            // this.setState({ image: result.uri });
            console.log(result)
            // that.uploadImg(that, result.uri)
            const image = Asset.fromModule(result.uri);
            console.log("base64:uri->" + result.uri)
            ImageManipulator.manipulateAsync(
                image.localUri || image.uri,
                [],
                {compress: 0.5, format: ImageManipulator.SaveFormat.PNG}
            ).then(result => {
                console.log("base64:" + result.base64)
            });
            // image.downloadAsync().then(result => {
            //
            // }, reason => {
            //     console.log("base64:error->" + reason)
            // });
        }
    };

    componentWillMount() {
        console.log("componentWillMount")
        let that = this
        this.getPermissionAsync(that)
        this._navListener = this.props.navigation.addListener('didFocus', (obj) => {
            console.log("didFocus" + JSON.stringify(obj))
            if (that.capture) {
                that.capture.startReview()
                that.capture.refreshAlbum()
            }
        });
        this._navListener = this.props.navigation.addListener('willBlur', (obj) => {
            console.log("willBlur" + JSON.stringify(obj))
            if (that.capture) {
                that.capture.stopReview();
            }
        });
    }

    componentWillUnmount() {
        if (this.capture) {
            this.capture.clearAlbum()
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(JSON.stringify(nextProps))
    }

    _renderTabItem(view, selectedView, tag, childView) {
        let that = this
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tag}
                renderIcon={() => view}
                renderSelectedIcon={() => selectedView}
                onPress={() => {
                    this.setState({selectedTab: tag})
                    if (tag === '2') {
                        if (that.capture) {
                            that.capture.startReview()
                        }
                    } else {
                        if (that.capture) {
                            that.capture.stopReview()
                        }
                    }
                }}>
                {childView}
            </TabNavigator.Item>
        );
    }


    _createChildView(tag) {
        return (
            <View style={{flex: 1, backgroundColor: '#00baff', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: 22}}>{tag}</Text>
            </View>
        )
    }

    _createCaptureView() {
        let that = this
        return (
            <View style={{flex: 1, backgroundColor: '#000000'}}>
                <Capture ref={ref => that.capture = ref} backPress={this.backPress.bind(this)} publishAlbum={files => {
                    console.log(JSON.stringify(files))
                    that.props.navigation.navigate("Publish", {
                        files: files
                    });
                }}/>
            </View>
        )
    }

    backPress() {
        this.props.navigation.navigate("MapTab", {})
    }

    render() {
        let that = this
        return (
            <View style={{flex: 1}}>
                <View style={{width: "100%", height: Constants.statusBarHeight}}/>
                <TabNavigator hidesTabTouch={true} tabBarStyle={[styles.tab, {backgroundColor: "black"}]}>
                    {this._renderTabItem(<View><Text style={styles.tag}>写微博</Text></View>,
                        <View><Text style={styles.selectTag}>写微博</Text></View>, "1", this._createChildView("1"))}
                    {this._renderTabItem(<View><Text style={styles.tag}>打卡</Text></View>,
                        <View><Text style={styles.selectTag}>打卡</Text></View>, "2", this._createCaptureView())}
                    {this._renderTabItem(<View><Text style={styles.tag}>活动发布</Text></View>,
                        <View><Text style={styles.selectTag}>活动发布</Text></View>, "3", this._createChildView("3"))}
                    {this._renderTabItem(<View><Text style={styles.tag}>社团/商家登记</Text></View>,
                        <View><Text style={styles.selectTag}>社团/商家登记</Text></View>, "4", this._createChildView("4"))}
                </TabNavigator>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    normalView: {},
    hiddenView: {
        height: 0
    },
    container: {
        backgroundColor: 'white',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    heading: {
        color: 'black',
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
    },
    contentView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    triangleLeft: {
        position: 'absolute',
        left: -20,
        bottom: 0,
        width: 0,
        height: 0,
        borderRightWidth: 20,
        borderRightColor: 'white',
        borderBottomWidth: 25,
        borderBottomColor: 'transparent',
        borderTopWidth: 25,
        borderTopColor: 'transparent',
    },
    triangleRight: {
        position: 'absolute',
        right: -20,
        top: 0,
        width: 0,
        height: 0,
        borderLeftWidth: 20,
        borderLeftColor: 'white',
        borderBottomWidth: 25,
        borderBottomColor: 'transparent',
        borderTopWidth: 25,
        borderTopColor: 'transparent',
    },
    inputContainerStyle: {
        marginTop: 16,
        width: '90%',
    },
    keyboardAvoidingView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'red'
    },
    searchIcon: {
        alignSelf: 'center',
        marginLeft: 7,
        marginRight: 7,
        width: 80,
        height: 80,
    },
    productImg: {
        marginLeft: 7,
        marginRight: 7,
        marginTop: 15,
        width: SCREEN_WIDTH * 0.3,
        height: SCREEN_WIDTH * 0.3 * 0.75,
    },
    productRef: {
        marginLeft: 7,
        marginRight: 7,
        marginTop: 2,
        width: SCREEN_WIDTH * 0.75,
        height: SCREEN_WIDTH * 0.75 * 9 / 16,
    },
    badImg: {
        marginLeft: 7,
        marginRight: 7,
        width: scaleSize(40),
        height: scaleSize(40),
    },
    goodImg: {
        marginLeft: 7,
        marginRight: 7,
        width: scaleSize(40),
        height: scaleSize(40),
    },
    pageStyle: {
        alignItems: 'center',
        padding: 20,
    },
    contentContainer: {
        paddingVertical: 2,
        paddingLeft: 2
    },
    tag: {
        color: "#333333"
    },
    selectTag: {
        color: "#ffffffff"
    }
});
