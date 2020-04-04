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

// const SCREEN_WIDTH = Dimensions.get('window').width;

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

const list2 = [
    {
        name: '老店',
        count: 1,
    },
    {
        name: '放心购',
        count: 10,
    },
    {
        name: '性价比高',
        count: 10,
    },
    {
        name: '版型靠谱',
        count: 10,
    },
    {
        name: '售后有保障',
        count: 10,
    },
];

const TAG_COLORS = []


class SearchHome extends Component {

    state = {
        search: "",
        fadeInOpacity: new Animated.Value(1),  // 透明度初始值设为0
        logoHeight: new Animated.Value(200),  // 透明度初始值设为0
        data: null,
    };

    componentDidMount() {
        if (Platform.OS === 'web') {
            try {
                let ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    Linking.getInitialURL().then(url => {
                        let token = this.getQueryString(url, "token");
                        if (typeof token !== 'undefined') {
                            alert(decodeURI(token));
                        }

                    })
                }
            } catch (e) {
            }
            // let name = "token";
            // var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            // if (arr != null) {
            //     // alert(unescape(arr[2]))
            // }

            // Linking.openURL("https://www.baidu.com");
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
        let body = "searchKey=" + this.state.search;
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
                // alert(responseJson.data.shopName)
                // this.props.navigation.navigate("ProductDetailRoute", {
                //     shopName: responseJson.data.shopName
                // });
            })
            .catch((error) => {
                alert(JSON.stringify(error));
            });
    };

    render() {
        var that = this
        const {search, fadeInOpacity, logoHeight} = this.state;
        return (
            <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={"padding"} enabled
                                  keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 84}>
                <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                    <Animated.View                       // 使用专门的可动画化的View组件
                        style={{
                            ...this.props.style,
                            opacity: fadeInOpacity,          // 将透明度指定为动画变量值
                            height: logoHeight,
                        }}
                    >
                        <View style={styles.headerContainer}>
                            {/*<Icon color="white" name="search" size={62}/>*/}
                            <Image
                                source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg'}}
                                style={styles.searchIcon}>
                            </Image>

                            <Text style={styles.heading}>汉服点评</Text>
                        </View>
                    </Animated.View>
                    {/*<View style={styles.headerContainer}>*/}
                    {/*    /!*<Icon color="white" name="search" size={62}/>*!/*/}
                    {/*    <Image*/}
                    {/*        source={{uri: 'https://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg'}}*/}
                    {/*        style={styles.searchIcon}>*/}
                    {/*    </Image>*/}

                    {/*    <Text style={styles.heading}>汉服云鉴定</Text>*/}
                    {/*</View>*/}


                    {/*<SearchBar*/}
                    {/*    placeholder="iOS searchbar"*/}
                    {/*    platform="ios"*/}
                    {/*    {...dummySearchBarProps}*/}
                    {/*/>*/}
                    {/*<SearchBar*/}
                    {/*    placeholder="Android searchbar"*/}
                    {/*    platform="android"*/}
                    {/*    {...dummySearchBarProps}*/}
                    {/*/>*/}
                    {/*alignItems: 'center',*/}
                    {/*justifyContent: 'center'*/}
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

                        <View style={{justifyContent: 'center'}}>
                            <Button
                                style={{marginRight: 13.33}}
                                title="云鉴定"
                                loading={false}
                                loadingProps={{size: 'small', color: 'white'}}
                                buttonStyle={{
                                    backgroundColor: 'rgba(111, 202, 186, 1)',
                                    borderRadius: 5,
                                }}
                                titleStyle={{fontWeight: 'bold', fontSize: 18}}
                                // containerStyle={{marginVertical: 10, height: 50}}
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
                                        numberOfLines: 2,
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
                                                {/*<Slider style={{width: "100%", height: 10}}*/}
                                                {/*        minimumValue={0}*/}
                                                {/*        maximumValue={100}*/}
                                                {/*        value={50}*/}
                                                {/*        minimumTrackTintColor={'red'}*/}
                                                {/*        maximumTrackTintColor={'green'}*/}
                                                {/*/>*/}

                                                <View
                                                    style={{
                                                        flexDirection: 'column',
                                                        backgroundColor: '#cccccc',
                                                        borderRadius: 5,
                                                        alignItems: 'left',
                                                        height: 5
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: '60%',
                                                            height: '100%',
                                                            backgroundColor: '#00ff00',
                                                            borderRadius: 5,
                                                            alignItems: 'left',
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
                                        alignItems: 'left',
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
                                        商家点评：十二年老店，同袍的一站式购物中心
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        borderColor: '#cccccc',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        alignItems: 'left',
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
                                            alignItems: 'left',
                                            marginTop: 2,
                                            flexWrap: "wrap",
                                            marginLeft: 3,
                                            marginRight: 3
                                        }}
                                    >
                                        {list2.map((l, i) => (
                                            <View
                                                style={{
                                                    backgroundColor: '#96ea70',
                                                    borderRadius: 5,
                                                    alignItems: 'left',
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
                                                    {l.name}
                                                </Text>
                                            </View>
                                        ))}
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
                                        资料文献（{that.state.data.powerTags.join(' | ')}）
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
                                        {that.state.data.powerImgs.map((l, i) => (
                                            <Image
                                                source={{uri: l}}
                                                style={styles.productRef}>
                                            </Image>
                                        ))}
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
                                        alignItems: 'left',
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
        // backgroundColor: '#616389',
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