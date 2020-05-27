import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text, Platform, Linking, Image, Animated
} from 'react-native';
import constants from "../../config/constants";
import PropTypes from "prop-types";

const {width, height} = Dimensions.get('window');
// let {MapView, MapTypes, Geolocation, Overlay, MapApp} = Platform.OS === "web" ?
//     {MapView: null, MapTypes: null, Geolocation: null, Overlay: null, MapApp: null} : require('react-native-baidu-map')
// let {BaiduMapManager} = Platform.OS === "web" ?
//     {BaiduMapManager: null} : require('react-native-baidu-map')
let {MapView, MapTypes, Geolocation, Overlay, MapApp} = Platform.OS === "web" ?
    {
        MapView: null,
        MapTypes: null,
        Geolocation: null,
        Overlay: null,
        MapApp: null
    } : require('react-native-baidu-map-wm')
let {BaiduMapManager} = Platform.OS === "web" ?
    {BaiduMapManager: null} : require('react-native-baidu-map-wm')

//模块声名并导出
export default class BaiduMap extends Component {

    moveCallback;

    //属性声名
    static propTypes = {};
    //默认属性
    static defaultProps = {
        lat: 116.297047,
        lng: 39.979542,
        level: 12,
    };

    //构造函数
    constructor(props) {
        super(props);
        const {moveCallback} = this.props
        this.moveCallback = moveCallback
        // this.props.moveCallback = moveCallback
        this.state = { //状态机变量声明
            lat: 116.297047,
            lng: 39.979542,
            level: 14,
            maskers: []
        }
    }

    //渲染
    render() {
        var that = this
        var timer;
        console.log("BaiduMap->render")
        return (
            <View style={{width: "100%", height: "100%"}}>
                {Platform.OS === 'web' ? <div id='customMap' style={{width: "100%", height: "100%"}}/> :
                    <MapView
                        ref={ref => this.baiduMap = ref}
                        onMapStatusChange={(a) => {
                            if (timer) {
                                window.clearTimeout(timer)
                            }
                            timer = window.setTimeout(function () {
                                console.log(JSON.stringify(a))
                                that.moveCallback(a)
                            }, 1000);
                        }}
                        zoom={this.state.level}
                        center={{longitude: this.state.lat, latitude: this.state.lng}}
                        style={{width: "100%", height: "100%"}}
                        onMarkerClick={(params) => {
                            this.onMarkerClick(params.title)
                            // console.log("onMarkerClick->tag:", params.tag+ " ,title:" + params.title + " ,位置:" + params.position.longitude + "," + params.position.latitude)
                        }}
                    >
                        {that.state.maskers.map((l, i) => (
                            <Overlay.Marker icon={{
                                uri: l.uri,
                                width: l.width,
                                height: l.height
                            }} location={{longitude: l.lng, latitude: l.lat}}
                            title={l.id} key={Math.round(Math.random()*10000000000)}/>
                        ))}
                        {/*<Overlay.InfoWindow location={{latitude:39.97954214346878, longitude: 116.29704699999986}} visible={true}>*/}
                        {/*    <View style={{backgroundColor: "red",width: 50, height:50}}></View>*/}
                        {/*</Overlay.InfoWindow>*/}

                        {/*<Overlay.Marker icon={{*/}
                        {/*    uri: 'http://hanbei-1256982553.cos.ap-chengdu.myqcloud.com/hanbei-active/org_hanbei.jpg',*/}
                        {/*    width: 30,*/}
                        {/*    height: 30*/}
                        {/*}} location={{longitude: 113.975453, latitude: 22.510045}}/>*/}

                        {/*<Overlay.Marker style={{width:20,height:20}} location={{ longitude: 113.975453, latitude: 22.510045 }} />*/}
                        {/*<Overlay.Marker style={{width: 20, height: 20}} icon={require('../../images/logo.png')}*/}
                        {/*                location={{longitude: 113.969453, latitude: 22.530045}}/>*/}
                    </MapView>
                }
            </View>
        );
    }

    componentDidMount() {
        let that = this
        if (Platform.OS === 'web') {
            document.write(init(this.props.lat, this.props.lng, this.props.level));
            document.addEventListener("zoomend", function(e){
                if (e.detail) {
                    that.moveCallback(e.detail)
                }
            })
            document.addEventListener("dragend", function(e){
                if (e.detail) {
                    that.moveCallback(e.detail)
                }
            })
            document.addEventListener("onMarkerClick", function(e){
                if (e.detail) {
                    that.onMarkerClick(e.detail.id)
                }
            })
            let refreshEvent = new CustomEvent("Event", {"detail":null});
            refreshEvent.initEvent('bridge_refreshMasker', true, true);
            document.dispatchEvent(refreshEvent);
        }
    }

    onMarkerClick(id) {
        alert(id)
    }

    updateMasker(maskers) {
        if (Platform.OS === 'web') {
            console.log("map->updateMasker")
            // alert(JSON.stringify(maskers))
            // document.write(refreshMasker(maskers))

            let event = new CustomEvent("Event", {"detail":maskers});
            event.initEvent('bridge_updateMasker', true, true);
            document.dispatchEvent(event);

            return
        }
        this.setState({
            maskers: maskers
        })

    }

    reloadView() {
        if (Platform.OS === 'android') {
            BaiduMapManager.refresh();
            console.log("reloadView")
        }
    }

    static init() {
        if (Platform.OS === 'ios') {
            BaiduMapManager.initSDK('sIMQlfmOXhQmPLF1QMh4aBp8zZO9Lb2A');
        }
    }

    rePosition(lat, lng) {
        this.setState({
            lat: lat,
            lng: lng,
        })
        console.log(this.state.lat, this.state.lng, this.state.level)
        let event = new CustomEvent("Event", {"detail":{lat: lat, lng: lng, level: this.state.level}});
        event.initEvent('bridge_updateCenter', true, true);
        document.dispatchEvent(event);
    }


};
