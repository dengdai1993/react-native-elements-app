import React, { Component } from 'react';
import {StyleSheet, View, ScrollView, Platform, Linking} from 'react-native';

import LoginScreen2 from './login/screen2';
import LoginScreen3 from './login/screen3';

export default class Login extends Component {

  componentDidMount() {
    if (Platform.OS === 'web') {
      try {
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          Linking.openURL("https://app.zxyqwe.com/hanbj/mobile/rpcauth?callback=https%3a%2f%2fdp.hanfubj.com&register=https%3a%2f%2factive.qunliaoweishi.com%2fdetect%2fbackground%2fapi%2fregister4web.php");
          return;
        }
      } catch (e) {
        alert("登录失败，请重试");
      }
      alert("暂不支持在浏览器中登录，请在微信中打开");
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView horizontal pagingEnabled decelerationRate={0.993}>
          <LoginScreen2 />
          <LoginScreen3 />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
