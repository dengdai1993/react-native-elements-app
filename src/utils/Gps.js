import {Platform} from "react-native";
import * as Location from "expo-location";

let {MapView, MapTypes, Geolocation, Overlay, MapApp} = Platform.OS === "web" ?
    {
        MapView: null,
        MapTypes: null,
        Geolocation: null,
        Overlay: null,
        MapApp: null
    } : require('react-native-baidu-map-wm')

var pi = 3.14159265358979324;
// var a = 6378245.0;

var a = 6378245.0;
var f = 1 / 298.3;
var b = a * (1 - f);
var ee = (a ^ 2 - b ^ 2) / a ^ 2;

// var ee = 0.00669342162296594323;

//火星坐标
var mgLat = 0.0;
var mgLon = 0.0;

function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

export function transLation(latitude, longitude) {

    if (longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271) {
        mgLat = latitude;
        mgLon = longitude;
        return;
    }

    var dLat = transformLat(longitude - 105.0, latitude - 35.0);
    var dLon = transformLon(longitude - 105.0, latitude - 35.0);
    var radLat = latitude / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    mgLat = latitude + dLat;
    mgLon = longitude + dLon;
};

export function getCurrentPosition(callback) {
    if (Platform.OS === 'android') {
        Geolocation.getCurrentPosition("bd09ll").then((data) => {
            // alert(JSON.stringify(data))
            console.log("location:", data.latitude, data.longitude)
            // this.baiduMap.rePosition(data.longitude, data.latitude)
            // alert(data.latitude + ":" + data.longitude)
            callback({latitude: data.latitude, longitude: data.longitude})
        });
    } else if (Platform.OS === 'ios') {
        Location.getCurrentPositionAsync({}).then(locationData => {
            console.log("location:", locationData.coords.latitude, locationData.coords.longitude)
            // alert(locationData.latitude + "," +  locationData.longitude)
            // locationData.coords.longitude, locationData.coords.latitude
            // alert(locationData.coords.latitude + ":" + locationData.coords.longitude)
            callback({latitude: locationData.coords.latitude, longitude: locationData.coords.longitude})
            // location = Gps.transLation(locationData.latitude, locationData.longitude)
            // console.log(location.latitude, location.longitude)
        });
    } else {
        // Location.getCurrentPositionAsync({}).then(locationData => {
        //     console.log("location:", locationData.coords.latitude, locationData.coords.longitude)
        //     // alert(locationData.latitude + "," +  locationData.longitude)
        //     // locationData.coords.longitude, locationData.coords.latitude
        //     alert(locationData.coords.latitude + ":" + locationData.coords.longitude)
        //     return {latitude: locationData.coords.latitude, longitude: locationData.coords.longitude}
        //     // location = Gps.transLation(locationData.latitude, locationData.longitude)
        //     // console.log(location.latitude, location.longitude)
        // });
        document.addEventListener("location", function(e){
            if (e.detail) {
                callback({latitude: e.detail.latitude, longitude: e.detail.longitude})
            }
        })
        let event = new CustomEvent("Event", {});
        event.initEvent('bridge_getCurrentPosition', true, true);
        document.dispatchEvent(event);
    }
}
