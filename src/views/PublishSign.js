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
    Image, ViewPagerAndroid, Linking, ToastAndroid, StatusBar, TouchableOpacity, Modal, TextInput
} from 'react-native';
import {
    Input,
    SearchBar,
    Icon,
    Button,
    ThemeProvider, ListItem, ButtonGroup,
} from 'react-native-elements';
import TouchableScale from "react-native-touchable-scale";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {Asset} from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import Constants from "expo-constants";
// import {Camera} from "expo";
import {Camera} from "expo-camera";
import {BottomTabBar} from "react-navigation-tabs";
import TabNavigator from "react-native-tab-navigator";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as ImageUploader from "../utils/ImageUploader";
import {Video} from "expo-av";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../utils/DimensionUtil";
import * as DateUtils from "../utils/DateUtils";
import constants from "../config/constants";
import Dialog from "../components/Dialog";
import * as Location from 'expo-location';
import * as Gps from "../utils/Gps";
import Bar from "../components/Bar";

let COS = require('../utils/cos-react-native-sdk-v5.js');

export default class PublishSign extends Component {

    Bucket = 'hanbei-1256982553';
    Region = 'ap-chengdu';
    lat= 0;
    lng= 0;

    static defaultProps = {}

    constructor(props) {
        super(props);
        console.log(this.props.navigation.getParam("files", []))
        console.log("publish:" + JSON.stringify(this.props))
    };

    state = {
        files: [],
        previewVisible: false,
        address: "获取中...",
        comment: "",
    };

    componentWillMount() {
        // Location.requestPermissionsAsync().then(status => {
        //     console.log("status:" + JSON.stringify(status))
        //     Location.getCurrentPositionAsync({}).then(locationData => {
        //         console.log(locationData.latitude, locationData.longitude)
        //         location = Gps.transLation(locationData.latitude, locationData.longitude)
        //         console.log(location.latitude, location.longitude)
        //     });
        // });
        this._navListener = this.props.navigation.addListener('didFocus', (obj) => {
            console.log("didFocus" + JSON.stringify(obj))
            this.getLocationAsync()
        });

    }

    getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        console.log("location:", status)
        // let location = await Location.getCurrentPositionAsync({ accuracy: 1, timeout: 30000 });
        // console.log("location:", location)
        Gps.getCurrentPosition(result => {
            this.lat = result.latitude;
            this.lng = result.longitude;
            let body = "lat=" + result.latitude + "&lng=" + result.longitude;
            fetch(constants.host + constants.workspace + 'api/getGeocoder.php', {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body
            }).then((response) => response.json()).then(
                (responseJson) => {
                    this.setState({
                        address: responseJson.data.recommend,
                        addressList: responseJson.data.addressList
                    })
                })
                .catch((error) => {
                    alert(error);
                });
        })
        // .then((data) => {
        //     // alert(JSON.stringify(data))
        //     console.log("location:", data.latitude, data.longitude)
        //     this.baiduMap.rePosition(data.longitude, data.latitude)
        // });;
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentDidMount() {
        this.setState({
            files: this.props.navigation.state.params.files
        })
    }

    onChangeText(text) {
        this.setState({
            comment: text
        })
    }

    render() {
        let that = this
        console.log(this.state.files.length)
        return (
            <View style={{flex: 1}}>
                <View style={{width: "100%", height: Constants.statusBarHeight}}/>
                <View style={{
                    flexDirection: "row",
                    height: 50,
                    backgroundColor: "#3a404b",
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={{}}
                        onPress={() => {
                            this.props.navigation.goBack()
                        }}>
                        <Image source={require('../images/icon_back_white.png')}
                               style={{width: 25, height: 25, margin: 5}}/>
                    </TouchableOpacity>
                    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                        <Text style={{
                            fontSize: 18,
                            justifyContent: 'center',
                            textAlign: "center",
                            color: "white"
                        }}>发布</Text>
                    </View>
                    <TouchableOpacity
                        style={{}}
                        onPress={() => {
                            let body = "comment=" + encodeURIComponent(this.state.comment) + "&files="
                                + encodeURIComponent(JSON.stringify(this.state.files)) + "&address=" + encodeURIComponent(this.state.address)
                                + "&lat=" + this.lat + "&lng=" + this.lng
                            console.log(body)
                            fetch(constants.host + constants.workspace + 'api/publish.php', {
                                method: 'POST',
                                mode: "cors",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: body
                            }).then((response) => response.json()).then(
                                (responseJson) => {
                                    if (responseJson.code === 0) {
                                        this.setState({
                                            files: [],
                                        })
                                        this.props.navigation.navigate("MapTab", {})
                                    }
                                })
                                .catch((error) => {
                                    alert(error);
                                });
                        }}>
                        <View style={{flexDirection: "row", alignItems: 'center', marginRight: 5}}>
                            <Text style={{
                                fontSize: 18,
                                color: "#42aaf3",
                                flexShrink: 1
                            }}>保存</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <KeyboardAvoidingView
                    behavior={'height'}>
                    <ScrollView>
                        <View style={{
                            flexDirection: "row", margin: 3,
                            alignItems: 'flex-start',
                            flexWrap: "wrap",
                        }}>
                            {this.state.files.map((value, i) => (<TouchableOpacity onPress={() => {
                                    this.setState({
                                        currentReviewIndex: i
                                    })
                                    this.previewDialog.show(value)
                                }}>
                                    <View style={{backgroundColor: "white", borderRadius: 3, padding: 1, margin: 2}}
                                          key={i}>
                                        {value.type === 'image' ? <Image source={{uri: value.uri}} style={{
                                                width: (SCREEN_WIDTH - 3 * 6 - 3 * 2) / 3,
                                                height: (SCREEN_WIDTH - 3 * 6 - 3 * 2) / 3,
                                                borderRadius: 3
                                            }}/>
                                            : <Video
                                                source={{uri: value.uri}}
                                                rate={1.0}
                                                volume={1.0}
                                                isMuted={true}
                                                resizeMode="cover"
                                                shouldPlay
                                                isLooping
                                                style={{
                                                    width: (SCREEN_WIDTH - 3 * 6 - 3 * 2) / 3,
                                                    height: (SCREEN_WIDTH - 3 * 6 - 3 * 2) / 3
                                                }}
                                            />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={{}}
                            onPress={() => {
                                this.adddressDialog.show()
                            }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: 'center',
                                marginHorizontal: 3,
                                marginVertical: 5
                            }}>
                                <Image source={require("../images/icon_pos.png")} style={{width: 32, height: 32}}/>
                                <Text style={{
                                    fontSize: 18,
                                    color: "#42aaf3",
                                    flexShrink: 1
                                }}>{this.state.address}</Text>
                            </View>
                        </TouchableOpacity>
                        <TextInput
                            style={{
                                height: SCREEN_WIDTH,
                                borderColor: '#42aaf3',
                                borderWidth: 1,
                                marginBottom: 30,
                                marginHorizontal: 8,
                                marginTop: 5,
                                borderRadius: 3,
                                padding: 5
                            }}
                            onChangeText={text => this.onChangeText(text)}
                            placeholder={"说点什么吧~"}
                            multiline={true}
                            textAlignVertical="top"
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
                <Dialog
                    ref={component => {
                        this.previewDialog = component;
                    }}
                    outSideDisappear={true} //是否点击半透明区域让对话框消失;
                    contentStyle={styles.dialog}
                    position="center" // 对话框内容区域布局对齐方式:"center","top","bottom", 默认值是:"center"
                    height={SCREEN_HEIGHT * 0.6}
                    isHidden={true} // 对话框默认是否隐藏,默认为false
                    isStatusBarHidden={true} //状态栏是否处于显示状态，默认为false;
                    margin={30}>
                    <View style={{flex: 1, backgroundColor: "white", borderRadius: 3, padding: 1, margin: 2}}>
                        {this.state.files[this.state.currentReviewIndex] ? (this.state.files[this.state.currentReviewIndex].type === 'image' ?
                            <Image source={{uri: this.state.files[this.state.currentReviewIndex].uri}} style={{
                                flex: 1,
                                width: SCREEN_WIDTH - 66, height: SCREEN_HEIGHT * 0.6,
                                borderRadius: 3
                            }}/>
                            : <Video
                                source={{uri: this.state.files[this.state.currentReviewIndex].uri}}
                                rate={1.0}
                                volume={1.0}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                style={{
                                    flex: 1,
                                    width: SCREEN_WIDTH - 66, height: SCREEN_HEIGHT * 0.6,
                                    borderRadius: 3
                                }}
                            />) : null}
                        <TouchableOpacity style={{position: "absolute", right: -10, top: -10}}
                                          onPress={() => {
                                              this.previewDialog.dismiss()
                                          }}>
                            <Image source={require('../images/icon_album_close.png')} style={{width: 30, height: 30}}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            position: "absolute",
                            bottom: 10,
                            marginLeft: 12,
                            flexDirection: "row",
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            backgroundColor: "white",
                            paddingHorizontal: 6,
                            paddingVertical: 4
                        }}
                                          onPress={() => {
                                              for (let i = this.state.files.length - 1; i >= 0; i--) {
                                                  console.log("capture:", i, this.state.currentReviewIndex)
                                                  if (i === this.state.currentReviewIndex) {
                                                      // this.state.files.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
                                                      this.state.files.splice(i, 1)
                                                      console.log("capture:", this.state.files.length)
                                                      this.setState({
                                                          files: this.state.files
                                                      })
                                                  }
                                              }
                                              this.previewDialog.dismiss()
                                          }}>
                            <Image source={require('../images/icon_album_delete.png')} style={{width: 20, height: 20}}/>
                            <Text>删除此图片</Text>
                        </TouchableOpacity>

                    </View>
                </Dialog>
                <Dialog
                    ref={component => {
                        this.progressDialog = component;
                    }}
                    outSideDisappear={false} //是否点击半透明区域让对话框消失;
                    contentStyle={styles.dialog}
                    position="center" // 对话框内容区域布局对齐方式:"center","top","bottom", 默认值是:"center"
                    height={SCREEN_HEIGHT * 0.6}
                    isHidden={true} // 对话框默认是否隐藏,默认为false
                    isStatusBarHidden={true} //状态栏是否处于显示状态，默认为false;
                    margin={30}>
                    <View style={{flex: 1, backgroundColor: "white", borderRadius: 3, padding: 1, margin: 2}}>
                        <Bar
                            ref={component => {
                                this.bar = component;
                            }}
                            initValue={this.state.uploadProgress}
                        />
                        <Text>图片保存中{this.state.finishCount + "/" + (this.state.files ? this.state.files.length : 0)}</Text>
                    </View>
                </Dialog>
                <Dialog
                    ref={component => {
                        this.adddressDialog = component;
                    }}
                    outSideDisappear={true} //是否点击半透明区域让对话框消失;
                    contentStyle={styles.dialog}
                    position="center" // 对话框内容区域布局对齐方式:"center","top","bottom", 默认值是:"center"
                    height={SCREEN_HEIGHT * 0.6}
                    isHidden={true} // 对话框默认是否隐藏,默认为false
                    isStatusBarHidden={true} //状态栏是否处于显示状态，默认为false;
                    margin={30}>
                    <View style={{flex: 1, backgroundColor: "white", borderRadius: 3, padding: 1, margin: 2}}>
                        {this.state.addressList ? this.state.addressList.map((value, i) => (
                            <View><TouchableOpacity onPress={() => {
                                this.setState({
                                    address: value
                                })
                                this.adddressDialog.dismiss()
                            }}>
                                <Text style={{fontSize: 16, margin: 6}}>{value}</Text>
                            </TouchableOpacity>
                            </View>)) : null}
                    </View>
                </Dialog>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dialog: {
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        borderRadius: 5,
    }
});

