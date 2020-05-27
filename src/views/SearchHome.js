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
    Image, ViewPagerAndroid, Linking
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
// import BaiduMap from "../components/map/BaiduMap";

// let { MapView, MapTypes, Geolocation, Overlay, MapApp } = Platform.OS === "web" ?
//     {MapView: null,MapTypes: null, Geolocation: null, Overlay: null, MapApp: null} : require('react-native-baidu-map')
// let { BaiduMapManager } = Platform.OS === "web" ?
//     {BaiduMapManager: null} : require('react-native-baidu-map')

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

class SearchHome extends Component {

    state = {
        search: "",
        fadeInOpacity: new Animated.Value(1),  // 透明度初始值设为0
        logoHeight: new Animated.Value(200),  // 透明度初始值设为0
        data: null,
    };

    componentWillMount() {
       // BaiduMap.init();
    }

    componentDidMount() {
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
            // document.write(init(116.297047, 39.979542, 12))
            // document.write(addMasker())

            // let name = "token";
            // var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            // if (arr != null) {
            //     // alert(unescape(arr[2]))
            // }

            // Linking.openURL("https://www.baidu.com");
        } else if (Platform.OS === 'ios') {
            // BaiduMapManager.initSDK('sIMQlfmOXhQmPLF1QMh4aBp8zZO9Lb2A');
        }
        // try {
        //     let ua = window.navigator.userAgent.toLowerCase();
        //     alert(ua.match(/MicroMessenger/i) == 'micromessenger')
        // } catch (e) {
        //     alert(false)
        // }
        // this.props.navigation.navigate("ProductDetailRoute", {
        //     shopName: "1111"
        // });

    }

    refreshAvatar() {
        let body = "token=" + constants.token;
        fetch(constants.host + constants.workspace + 'api/getUserInfo.php', {
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
                this.props.navigation.setParams({name: responseJson.data.userName});
                this.props.navigation.setParams({status: true});
                this.props.navigation.setParams({avatar: responseJson.data.headimgurl});
                LoginDrawerItem.navigationOptions = {
                    drawerLabel: '个人信息',
                    drawerIcon: ({tintColor}) => (
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
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });

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

    startAnimated = () => {
        // 同步执行的动画
        Animated.parallel([
            Animated.timing(this.state.fadeInOpacity, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear,
            }),
            Animated.timing(this.state.logoHeight, {
                toValue: 0,
                duration: 500,
                easing: Easing.linear,
            }),
            // 可以添加其他动画
        ]).start(() => {
        });
    };

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
                this.startAnimated();
                this.setState({
                    data: responseJson.data,
                })
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });
    };

// <Image
// source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg'}}
// style={styles.searchIcon}>
// </Image>
// <Overlay.Marker style={{width:20,height:20}} rotate={45} icon={{ uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg' }} location={{ longitude: 113.975453, latitude: 22.510045 }} />
// <Overlay.Marker location={{ longitude: 113.969453, latitude: 22.530045 }}/>
    render() {
        var that = this
        const {search, fadeInOpacity, logoHeight} = this.state;
        return (
            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={"padding"} enabled
                                  keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 84}>

                {/*{Platform.OS === 'web' ? <div id='customMap' style={{width: "100%", height: 200}}/> :*/}
                {/*    <MapView center={{ longitude: 113.969453, latitude: 22.530045 }} style={{width: "100%", height: 200}}>*/}
                {/*        /!*<Overlay.Marker style={{width:20,height:20}} icon={{ uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg' }} location={{ longitude: 113.975453, latitude: 22.510045 }} />*!/*/}
                {/*        <Overlay.Marker style={{width:20,height:20}} icon={require('../images/logo.png')} location={{ longitude: 113.969453, latitude: 22.530045 }}/>*/}
                {/*        /!*<Overlay.Marker rotate={45} icon={{ uri: 'https://mapopen-website-wiki.cdn.bcebos.com/homePage/images/logox1.png' }} location={{ longitude: 113.975453, latitude: 22.510045 }} />*!/*/}
                {/*    </MapView>*/}
                {/*}*/}
                {/*<BaiduMap ref={ref => this.baiduMap = ref}*/}
                {/*lat={116.297047} lng={39.979542} level={15}*/}
                {/*moveCallback={(result) => this.fetchSignData(result)}/>*/}

                <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                    <Animated.View                       // 使用专门的可动画化的View组件
                        style={{
                            ...this.props.style,
                            opacity: fadeInOpacity,          // 将透明度指定为动画变量值
                            height: logoHeight,
                        }}
                    >
                        <View style={styles.headerContainer}>
                            <Image
                                source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg'}}
                                style={styles.searchIcon}>
                            </Image>

                            <Text style={styles.heading}>汉服</Text>
                        </View>
                    </Animated.View>
                    <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#f5f5f5'}}>
                        <View style={{flex: 1, justifyContent: 'center', backgroundColor: "#f5f5f5"}}>
                            <SearchBar
                                placeholder="输入店家名/淘口令"
                                platform="ios"
                                cancelButtonTitle={""}
                                showCancel={false}
                                onChangeText={this.updateSearch}
                                value={search}
                            />
                        </View>
                        <View style={{justifyContent: 'center', marginHorizontal: 10}}>
                            <Button
                                title="云鉴定"
                                loading={false}
                                loadingProps={{size: 'small', color: 'white'}}
                                buttonStyle={{
                                    backgroundColor: 'rgba(111, 202, 186, 1)',
                                    borderRadius: 5,
                                }}
                                titleStyle={{fontWeight: 'bold', fontSize: 18}}
                                onPress={() => this._onSearch()}
                                underlayColor="transparent"
                            />
                        </View>
                    </View>
                    {
                        this.state.data == null ? (
                            <View style={styles.normalView}>
                                <Text
                                    style={{
                                        fontSize: scaleSize(30),
                                        marginVertical: 10,
                                        fontWeight: '300',
                                        marginTop: 20,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        color: '#333333',
                                        flex: 1
                                    }}>合作品牌</Text>
                            </View>
                        ) : (
                            <View style={styles.normalView}>
                                <View style={{flexDirection: 'row'}}>
                                    <Image
                                        source={{uri: that.state.data.mainPic}}
                                        style={styles.productImg}>
                                    </Image>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        <Text
                                            style={{
                                                fontSize: scaleSize(30),
                                                marginVertical: 10,
                                                fontWeight: '300',
                                                marginTop: 20,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                color: '#333333',
                                                numberOfLines: 2,
                                                flex: 1
                                            }}
                                        >
                                            {that.state.data.productTitle}
                                        </Text>
                                        <View style={{width: "100%", flexDirection: 'row'}}>
                                            <Image
                                                source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/common_icon/icon_bad.png'}}
                                                style={styles.badImg}>
                                            </Image>
                                            <View style={{flex: 1, flexDirection: 'column'}}>
                                                <View style={{flex: 1, width: "100%", flexDirection: 'row'}}>
                                                    <Text
                                                        style={{
                                                            flex: 1,
                                                            fontSize: scaleSize(20),
                                                            color: '#333333',
                                                        }}
                                                    >
                                                        拔草
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: scaleSize(20),
                                                            color: '#f2466e',
                                                        }}
                                                    >
                                                        种草
                                                    </Text>
                                                </View>

                                                <View
                                                    style={{
                                                        flexDirection: 'column',
                                                        backgroundColor: '#cccccc',
                                                        borderRadius: 5,
                                                        alignItems: 'flex-start',
                                                        height: 5
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: '60%',
                                                            height: '100%',
                                                            backgroundColor: '#00ff00',
                                                            borderRadius: 5,
                                                            alignItems: 'flex-start',
                                                        }}
                                                    >
                                                    </View>
                                                </View>

                                            </View>
                                            <Image
                                                source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/common_icon/icon_good.png'}}
                                                style={styles.goodImg}>
                                            </Image>
                                        </View>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'column',
                                        borderColor: '#cccccc',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        alignItems: 'flex-start',
                                        marginHorizontal: 10,
                                        paddingBottom: 10,
                                        marginBottom: 10,
                                        marginTop: 15,
                                        shadowColor: '#cccccc',
                                        shadowOffset: {width: 3, height: 2},
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scaleSize(30),
                                            marginVertical: 10,
                                            fontWeight: '300',
                                            marginTop: 10,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            color: '#333333',
                                            numberOfLines: 2,
                                        }}
                                    >
                                        EasyDL分析结果：{that.state.data.aipNlp}（0%-100%，越接近100，有问题的可能性越小）
                                    </Text>

                                </View>

                                <Text
                                    style={{
                                        fontSize: scaleSize(45),
                                        marginTop: 20,
                                        marginLeft: 10,
                                        marginRight: 10,
                                        color: '#333333',
                                        numberOfLines: 2,
                                        flex: 1
                                    }}
                                >
                                    {that.state.data.shopName}
                                </Text>
                                <View style={{
                                    width: 0,
                                    height: 0,
                                    borderTopWidth: 10,
                                    borderTopColor: 'transparent',
                                    borderRightWidth: 10,
                                    borderRightColor: 'transparent',
                                    borderLeftWidth: 10,
                                    borderLeftColor: 'transparent',
                                    borderBottomWidth: 7,
                                    marginLeft: 30,
                                    marginTop: -5,
                                    borderBottomColor: '#96ea70',
                                }}/>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column',
                                        backgroundColor: '#96ea70',
                                        borderRadius: 5,
                                        alignItems: 'flex-start',
                                        marginLeft: 10,
                                        marginRight: 10,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scaleSize(30),
                                            marginVertical: 10,
                                            fontWeight: '300',
                                            color: '#333333',
                                            numberOfLines: 3,
                                            marginLeft: 10,
                                            marginRight: 10
                                        }}
                                    >
                                        商家点评：{that.state.data.comment}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        borderColor: '#cccccc',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        alignItems: 'flex-start',
                                        marginHorizontal: 10,
                                        paddingBottom: 10,
                                        marginBottom: 10,
                                        marginTop: 15,
                                        shadowColor: '#cccccc',
                                        shadowOffset: {width: 3, height: 2},
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scaleSize(30),
                                            marginVertical: 10,
                                            fontWeight: '300',
                                            marginTop: 10,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            color: '#333333',
                                            numberOfLines: 2,
                                        }}
                                    >
                                        印象标签
                                    </Text>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'flex-start',
                                            marginTop: 2,
                                            flexWrap: "wrap",
                                            marginLeft: 3,
                                            marginRight: 3
                                        }}
                                    >
                                        {that.state.data.shopTags ? that.state.data.shopTags.map((l, i) => (
                                            <View
                                                style={{
                                                    backgroundColor: '#96ea70',
                                                    borderRadius: 5,
                                                    alignItems: 'flex-start',
                                                    marginLeft: 2,
                                                    marginRight: 2,
                                                    marginTop: 2,
                                                    marginBottom: 2
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: scaleSize(30),
                                                        color: 'white',
                                                        numberOfLines: 3,
                                                        marginLeft: 10,
                                                        marginRight: 10,
                                                        marginTop: 3,
                                                        marginBottom: 3
                                                    }}
                                                >
                                                    {l.tagName} {l.tagCount}
                                                </Text>
                                                <CountTag style={{}}
                                                          text={l.agreeCount}/>
                                            </View>
                                        )) : null}
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'column',
                                        borderColor: '#cccccc',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        marginHorizontal: 10,
                                        paddingBottom: 10,
                                        paddingRight: 10,
                                        marginBottom: 10,
                                        marginTop: 15,
                                        shadowColor: '#cccccc',
                                        shadowOffset: {width: 3, height: 2},
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scaleSize(30),
                                            marginTop: 10,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            color: '#333333',
                                            numberOfLines: 2,
                                        }}
                                    >
                                        资料文献（{that.state.data.powerTags ? that.state.data.powerTags.join(' | ') : null}）
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: scaleSize(20),
                                            marginTop: 1,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            color: '#cc0000',
                                            numberOfLines: 1,
                                        }}
                                    >
                                        系统提取到以上标签，已为您展示相关文献资料，以供比对
                                    </Text>
                                    <ScrollView
                                        contentContainerStyle={styles.contentContainer}
                                        horizontal={true}>
                                        {that.state.data.powerImgs ? that.state.data.powerImgs.map((l, i) => (
                                            <Image
                                                source={{uri: l}}
                                                style={styles.productRef}>
                                            </Image>
                                        )) : null}
                                        {/*<Image*/}
                                        {/*    source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/common_icon/WechatIMG23.jpeg'}}*/}
                                        {/*    style={styles.productRef}>*/}
                                        {/*</Image>*/}
                                    </ScrollView>
                                    <Text
                                        style={{
                                            fontSize: scaleSize(30),
                                            marginTop: 1,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            color: '#FFA500',
                                            numberOfLines: 1,
                                        }}
                                    >
                                        以上资料来源：汉服古墓仙女平台
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        borderColor: '#cccccc',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        alignItems: 'flex-start',
                                        marginHorizontal: 10,
                                        paddingBottom: 10,
                                        marginBottom: 10,
                                        marginTop: 15,
                                        shadowColor: '#cccccc',
                                        shadowOffset: {width: 3, height: 2},
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: scaleSize(30),
                                            marginTop: 10,
                                            marginLeft: 10,
                                            marginRight: 10,
                                            color: '#333333',
                                            numberOfLines: 2,
                                        }}
                                    >
                                        问同袍
                                    </Text>

                                </View>
                            </View>
                        )
                    }
                </ScrollView>
            </KeyboardAvoidingView>
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

export default SearchHome;