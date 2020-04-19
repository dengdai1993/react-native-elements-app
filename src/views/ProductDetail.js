import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
    TouchableWithoutFeedback,
    Linking
} from 'react-native';
import {
    Input,
    SearchBar,
    Icon,
    Button,
    ThemeProvider,
} from 'react-native-elements';
import constants from '../config/constants'
import {Header} from 'react-native-elements';
import {scaleSize, SCREEN_WIDTH, sp, SCREEN_HEIGHT} from "../utils/DimensionUtil";
import * as WebBrowser from 'expo-web-browser';

class ProductDetail extends Component {

    state = {
        search: ""
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        // try {
        //     let ua = window.navigator.userAgent.toLowerCase();
        //     alert(ua.match(/MicroMessenger/i) == 'micromessenger')
        // } catch (e) {
        //     alert(false)
        // }

        let shopName = this.props.navigation.state.params.shopName
        // alert(shopName);
    }


    loginByWChat = () => {
        if (Platform.OS === 'web') {
            try {
                let ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {

                    // Linking.openURL("https://app.zxyqwe.com/hanbj/mobile/rpcauth?callback=https%3a%2f%2fdp.hanfubj.com&register=https%3a%2f%2factive.qunliaoweishi.com%2fdetect%2fbackground%2fapi%2fregister4web.php");
                    WebBrowser.openBrowserAsync("https://app.zxyqwe.com/hanbj/mobile/rpcauth?callback=https%3a%2f%2fdp.hanfubj.com&register=https%3a%2f%2factive.qunliaoweishi.com%2fdetect%2fbackground%2fapi%2fregister4web.php").then(result => console.log(result));

                    // Linking.openURL("https://app.zxyqwe.com/hanbj/mobile/rpcauth?callback=https%3a%2f%2factive.hanfubj.com%2fdetect&register=https%3a%2f%2factive.qunliaoweishi.com%2fdetect%2fbackground%2fapi%2fregister4web.php");
                    // Linking.openURL("https://app.zxyqwe.com/hanbj/mobile/rpcauth?callback=https%3a%2f%2fapi.hanfubj.com%2fdetect%2fbackground%2fapi%2ftokenSave.php&register=https%3a%2f%2factive.qunliaoweishi.com%2fdetect%2fbackground%2fapi%2fregister4web.php")
                    return;
                }
            } catch (e) {
            }
            alert("请在微信中打开,或选择qq登陆");
        }
    }

    loginByQQ = () => {
        if (Platform.OS === 'web') {
            try {
                Linking.openURL("https://active.qunliaoweishi.com/detect/background/qqlogin/index.php");
            } catch (e) {
            }
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }


    render() {
        let that = this
        return (
            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={"padding"} enabled
                                  keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 84}>
                <View
                    style={{
                        flex: 1,
                        width: '100%',
                        height: SCREEN_HEIGHT,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>

                    <View
                        style={{
                            flexDirection: 'row',
                        }}>
                        <TouchableWithoutFeedback onPress={() => {
                            that.loginByWChat();
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: scaleSize(120),
                                        height: scaleSize(120),
                                    }}
                                    source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/common_icon/icon_weixin.png'}}/>
                                <Text style={{marginTop: 10, fontSize: sp(15)}}>
                                    微信登录
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {
                            that.loginByQQ();
                        }}>
                            <View style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: (SCREEN_WIDTH - scaleSize(240)) / 3
                            }}>
                                <Image
                                    style={{
                                        flex: 1,
                                        width: scaleSize(120),
                                        height: scaleSize(120),

                                    }}
                                    source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/common_icon/icon_qq.png'}}/>
                                <Text style={{marginTop: 10, fontSize: sp(15)}}>
                                    QQ登录
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop: 70}}>
                        <TouchableWithoutFeedback
                            onPress={this.goBack}>
                            <Text style={{
                                fontSize: sp(14)
                            }}>
                                我再想想，暂不登录
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
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
});

export default ProductDetail;