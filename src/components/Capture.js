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
import CircleProgress from "./CircleProgress";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as ImageUploader from "../utils/ImageUploader";
import {Video} from "expo-av";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../utils/DimensionUtil";
import Dialog from "./Dialog";
import * as DateUtils from "../utils/DateUtils";
import constants from "../config/constants";
import {LinearGradient} from 'expo-linear-gradient';
import Bar from "./Bar";

let COS = require('../utils/cos-react-native-sdk-v5.js');

export default class Capture extends Component {

    Bucket = 'hanbei-1256982553';
    Region = 'ap-chengdu';

    static defaultProps = {}

    constructor(props) {
        super(props);
        const {backPress, publishAlbum} = this.props
        this.backPress = backPress
        this.publishAlbum = publishAlbum
    };

    state = {
        type: Camera.Constants.Type.back,
        rotate: true,
        captures: [],
        files: [],
        finishCount: 0,
        previewVisible: false,
        uploadProgress: 0
    };

    componentWillMount() {
        this.initCos()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    initCos() {
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

    pickImage() {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        }).then(result => {
            if (!result.cancelled) {
                if (!result.type) {
                    result.type = result.uri.startsWith("data:video") ? "video" : "image"
                }
                console.log(result.uri, result.type)
                this.state.files.push({uri: result.uri, type: result.type})
                this.setState({
                    files: this.state.files
                })
            }
        });
    };

    componentDidMount() {
        this.startReview()
    }

    startReview() {
        if (this.camera) {
            this.camera.resumePreview()
        }
    }

    stopReview() {
        if (this.camera) {
            this.camera.pausePreview();
        }
    }

    uploadImg(result, index) {
        let that = this
        let key = 'app/sign/' + DateUtils.dateFormat(new Date().getTime(), 'yyyyMMdd') + "/sign_" + new Date().getTime() + index + ('image' === result.type ? '.jpeg' : '.mp4')

        let finishCount = 0;
        for (let i = 0; i < that.state.files.length; i++) {
            if (that.state.files[i].remoteUrl) {
                finishCount++;
            }
        }
        // this.bar.setProgress(finishCount * 100 / that.state.files.length)
        this.setState({
            uploadProgress: finishCount * 100 / that.state.files.length,
            finishCount: finishCount
        })

        this.cos.postObject({
            Bucket: this.Bucket,
            Region: this.Region,
            Key: key,
            FilePath: result.uri
        }, function (err, response) {
            console.log(err)
            console.log(response)
            if (err) {
                alert("上传失败")
                return;
            }
            result.remoteUrl = key;
            // let allFinished = true;
            let finishCount = 0;
            for (let i = 0; i < that.state.files.length; i++) {
                if (that.state.files[i].remoteUrl) {
                    finishCount++;
                }
            }
            that.bar.setProgress(finishCount * 100 / that.state.files.length)
            that.setState({
                finishCount: finishCount
            })
            if (finishCount === that.state.files.length) {
                // alert("上传完毕")
                that.progressDialog.dismiss()
                that.publishAlbum(that.state.files)
            }
        });
    }

    publish() {
        if (!this.state.files || this.state.files.length === 0) {
            alert('请先选择或拍摄图片')
            return
        }
        let finishCount = 0;
        for (let i = 0; i < this.state.files.length; i++) {
            if (!this.state.files[i].remoteUrl) {
                this.uploadImg(this.state.files[i], i)
            } else {
                finishCount++;
            }
        }
        if (finishCount === this.state.files.length) {
            this.publishAlbum(this.state.files)
        } else {
            this.progressDialog.show()
        }
    }

    refreshAlbum() {
        this.setState({
            files: this.state.files
        })
    }

    clearAlbum() {
        this.setState({
            files: []
        })
    }

    render() {
        let that = this
        return (
            <View style={{flex: 1}}>
                <View style={{
                    flexDirection: "row",
                    height: 50,
                    backgroundColor: "red",
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        style={{}}
                        onPress={() => {
                            this.backPress();
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
                        }}>打卡</Text>
                    </View>
                    {this.state.rotate ? <TouchableOpacity
                        style={{}}
                        onPress={() => {
                            this.setState({
                                type: this.state.type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            })
                        }}>
                        <Image source={require('../images/icon_camera_rotate.png')}
                               style={{width: 30, height: 24, marginRight: 10}}/>
                    </TouchableOpacity> : null}
                </View>
                <Camera style={{flex: 1}} type={that.state.type}
                        ref={ref => {
                            that.camera = ref;
                        }}>
                    <View style={{flex: 1}}/>
                    <View style={{flexDirection: "row"}}>
                        <View style={{flex: 1, flexDirection: "row", margin: 3}}>
                            {this.state.files.map((value, i) => (<TouchableOpacity onPress={() => {
                                    this.setState({
                                        currentReviewIndex: i
                                    })
                                    this.previewDialog.show(value)
                                }}>
                                    <View style={{backgroundColor: "white", borderRadius: 3, padding: 1, margin: 2}}
                                          key={i}>
                                        {value.type === 'image' ? <Image source={{uri: value.uri}} style={{
                                                width: 30,
                                                height: 30,
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
                                                style={{width: 30, height: 30}}
                                            />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Camera>
                <View
                    style={{
                        backgroundColor: 'transparent',
                        flexDirection: 'column',
                    }}>

                    <View style={{flex: 1}}/>
                    <View style={{flexDirection: "row", marginVertical: 10}}>
                        <View style={{
                            flex: 1, flexDirection: "column", justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={() => {
                                this.pickImage()
                            }}>
                                <View style={{
                                    flexDirection: "column", justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Image source={require('../images/icon_album.png')}
                                           style={{width: 25, height: 25}}/>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "white"
                                    }}>相册选择</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.camera.takePictureAsync({quality: 0.5}).then(response => {

                                // let captures =  this.state.captures;
                                // captures.push({
                                //     type: 1,
                                //     origin: uri
                                // })
                                // this.setState({
                                //     captures: captures
                                // })

                                // ImageUploader.uploadFile(this, response.uri, "image");
                                this.state.files.push({uri: response.uri, type: "image"})
                                this.setState({
                                    files: this.state.files
                                })
                            });
                        }}>
                            <CircleProgress styles={{width: 25, height: 24}} progress={new Animated.Value(0.5)}
                                            durationTime={5}/>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1, flexDirection: "column", justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity onPress={() => this.publish()}>
                                <View style={{
                                    flexDirection: "column", justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Image source={require('../images/icon_publish.png')}
                                           style={{width: 25, height: 25}}/>
                                    <Text style={{
                                        fontSize: 13,
                                        color: "white"
                                    }}>去发布</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dialog: {
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        borderRadius: 5,
    },

});

