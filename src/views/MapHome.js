'use strict';
import React, {Component} from 'react';
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
    Image, ViewPagerAndroid, Linking, ToastAndroidStatic as ToastAndroid, StatusBar
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
import {Slider} from 'react-native-elements';
import LoginDrawerItem from "../drawer/login";
import CountTag from "../components/CountTag";
import BaiduMap from "../components/map/BaiduMap";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Asset} from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from "expo-constants";
import JShareModule from "jshare-react-native";
import * as DateUtils from "../utils/DateUtils";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as Gps from "../utils/Gps";
import {LocationData} from "expo-location/src/Location";

let COS = require('../utils/cos-react-native-sdk-v5.js');
// let COS = require('../utils/cos-js-sdk-v5.js');
// let COS = require('../utils/node/cos.js');

const dummySearchBarProps = {
    showLoading: false,
    serachKey: "",
    onFocus: () => console.log('focus'),
    onBlur: () => console.log('blur'),
    onCancel: () => console.log('cancel'),
    onClear: () => console.log('cleared'),
    onChangeText: text => {
        dummySearchBarProps.serachKey = text;
        console.log('text1:', dummySearchBarProps.serachKey)
    },
};

export default class MapHome extends Component {

    Bucket = 'hanbei-1256982553';
    Region = 'ap-chengdu';
    HasLoc = false;

    static defaultProps = {
        ts: 0
    }

    constructor(props) {
        super(props);
    };

    state = {
        search: "",
        fadeInOpacity: new Animated.Value(1),  // 透明度初始值设为0
        logoHeight: new Animated.Value(200),  // 透明度初始值设为0
        data: null,
    };

    componentWillMount() {
        console.log("componentWillMount")
        BaiduMap.init();

        this.initCos();


        if (Platform.OS === 'ios' && false) {
            JShareModule.setup();
            JShareModule.isWeChatInstalled(result => {
                console.log("isWeChatInstalled:", result)
            })
            let param = {
                platform: "wechat"
            };
            JShareModule.authorize(param, (map) => {
                console.log("Authorize succeed " + JSON.stringify(map));
            }, (errorCode) => {
                console.log("Authorize failed, errorCode : " + JSON.stringify(errorCode));
            });
        }
    }

    initLoaction() {
        console.log("location:initLoaction");
        Location.requestPermissionsAsync().then(status => {
            console.log("location:status");
            Location.getLastKnownPositionAsync().then(locationData => {
                console.log("location:getLastKnownPositionAsync" , locationData.coords.latitude, locationData.coords.longitude)
                if (this.baiduMap) {
                    this.baiduMap.rePosition(locationData.coords.longitude, locationData.coords.latitude)
                }
            })
            Location.getCurrentPositionAsync({}).then(locationData => {
                console.log("location:getCurrentPositionAsync" , locationData.coords.latitude, locationData.coords.longitude)
                if (this.baiduMap) {
                    this.baiduMap.rePosition(locationData.coords.longitude, locationData.coords.latitude)
                }
                // location = Gps.transLation(locationData.latitude, locationData.longitude)
                // console.log(location.latitude, location.longitude)
            });

        });

        // Location.getCurrentPositionAsync({}).then(locationData => {
        //     console.log(locationData.latitude, locationData.longitude)
        //     alert(locationData.latitude + "," +  locationData.longitude)
        //     // location = Gps.transLation(locationData.latitude, locationData.longitude)
        //     // console.log(location.latitude, location.longitude)
        // });
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        console.log("location:", status)
        // let location = await Location.getCurrentPositionAsync({ accuracy: 1, timeout: 30000 });
        // console.log("location:", location)
        Gps.getCurrentPosition(result => {
            // alert(JSON.stringify(result))
            if (this.baiduMap) {
                this.baiduMap.rePosition(result.longitude, result.latitude)
            }
        })
            // .then((data) => {
            //     // alert(JSON.stringify(data))
            //     console.log("location:", data.latitude, data.longitude)
            //     this.baiduMap.rePosition(data.longitude, data.latitude)
            // });;
    };


    initCos() {
        console.log("initCos~1")
        this.cos = new COS({
            getAuthorization: function (options, callback) {
                console.log("initCos~2")
                let body = "Method=" + options.Method + "&Key=" + options.Key
                fetch(constants.host + constants.workspace + 'api/txcos/sts.php', {
                    method: 'GET',
                    // mode: "cors",
                    // headers: {
                    //     'Accept': '*/*',
                    //     'Access-Control-Allow-Origin':'*',
                    //     'Content-Type': 'application/json',
                    // },
                }).then((response) => response.json()).then(
                    (responseJson) => {
                        // alert(JSON.stringify(responseJson))
                        let data = responseJson.data
                        callback({
                            TmpSecretId: data.credentials && data.credentials.tmpSecretId,
                            TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
                            XCosSecurityToken: data.credentials && data.credentials.sessionToken,
                            ExpiredTime: data.expiredTime,
                        });
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        });
    }

    componentDidMount() {
        console.log("componentDidMount")
        var that = this
        if (Platform.OS === 'web') {
            try {
                let ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger' || true) {
                    Linking.getInitialURL().then(url => {
                        let token = this.getQueryString(url, "token");
                        if (typeof token !== 'undefined') {
                            constants.token = decodeURI(token);
                            this.refreshAvatar();
                        }

                    })
                }
            } catch (e) {
            }
        }
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            if (that.baiduMap) {
                that.baiduMap.reloadView()
            }
        });
        // this.initLoaction();
        this._getLocationAsync();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log(JSON.stringify(nextProps))
    }

    getQueryString(url, name) {
        var params = [], h;
        var hash = url.slice(url.indexOf("?") + 1).split('&');
        console.log(hash);
        for (var i = 0; i < hash.length; i++) {
            h = hash[i].split("="); //
            params[h[0]] = h[1];
        }
        return params[name];
    }


    updateSearch = search => {
        console.log(this.state.search)
        this.setState({search: search}, () => {
            console.log(this.state.search)
        });
    };

    _onSearch = () => {
        // WebBrowser.openBrowserAsync('https://expo.io').then(result => console.log(result));
        let body = "searchKey=" + encodeURIComponent(this.state.search);
        fetch(constants.host + constants.workspace + 'api/search.php', {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        }).then((response) => response.json()).then(
            (responseJson) => {
                if (responseJson.code != 0) {
                    alert(responseJson.msg)
                    return
                }

            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });
    };

    fetchSignData = (result) => {
        let northEastLat = result.target.latitude + (result.target.latitudeDelta * 0.5)
        let northEastLng = result.target.longitude + (result.target.longitudeDelta * 0.5)
        let southWestLat = result.target.latitude - (result.target.latitudeDelta * 0.5)
        let southWestLng = result.target.longitude - (result.target.longitudeDelta * 0.5)
        let scale = result.zoom
        let body = "northEastLat=" + northEastLat + "&northEastLng=" + northEastLng + "&southWestLat=" + southWestLat
            + "&southWestLng=" + southWestLng + "&scale=" + scale;

        fetch(constants.host + constants.workspace + 'api/sign/getSignListByRange.php', {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body
        }).then((response) => response.json()).then(
            (responseJson) => {
                if (responseJson.code != 0) {
                    alert(responseJson.msg)
                    return
                }
                let maskers = [];
                for (var i = 0; i < responseJson.data.pos_list.length; i++) {
                    var pos = responseJson.data.pos_list[i];
                    maskers.push({id: pos.id, uri: pos.cover_url, width: 15, height: 15, lng: pos.lng, lat: pos.lat})
                }
                // maskers.push({uri: 'http://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg',width: 30,height: 30,lng: 116.297047, lat: 39.979542})
                // maskers.push({uri: 'http://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg',width: 30,height: 30,lng: 116.321768, lat: 39.88748})
                this.baiduMap.updateMasker(maskers);
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });
    };


    render() {
        var that = this
        const {search, fadeInOpacity, logoHeight} = this.state;
        return (
            <View style={{flex: 1, flexDirection: "column"}}>
            {/*<KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={"padding"} enabled*/}
            {/*                      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 84}>*/}
                <View style={{width: "100%", height: Constants.statusBarHeight}}/>
                <SearchBar
                    placeholder="支持查找已收录商家、社团、同袍、活动"
                    platform="ios"
                    cancelButtonTitle={""}
                    showCancel={false}
                    onChangeText={() => {
                        this.selectFiles()
                    }}
                    value={search}
                />
                <BaiduMap style={{width: "100%", height: "100%"}} ref={ref => this.baiduMap = ref}
                          lat={116.297047} lng={39.979542} level={15}
                          moveCallback={(result) => this.fetchSignData(result)}/>
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
    }
});
