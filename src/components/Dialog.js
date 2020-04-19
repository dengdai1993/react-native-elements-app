'use strict'
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Dimensions, TouchableWithoutFeedback
} from 'react-native';

const {width, height} = Dimensions.get('window');
const [left, top] = [0, 0];

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHidden: this.props.isHidden
        };
        this.position = this.props.position || "center";
        this.outSideDisappear = this.props.outSideDisappear || true;
        this.height = this.props.height || 0;
        this.contentStyle = this.props.contentStyle;
        this.margin = this.props.margin || 0;
    }

    /**
     * 隐藏对话框
     */
    dismiss = () => {
        this.setState({
            isHidden: true
        });
    }

    /**
     * 显示对话框
     */
    show = (item) => {
        this.setState({
            isHidden: false,
            currentItem: item
        });
    }

    /**
     * 点击透明区域是否消失对话框;
     */
    onDialogOutSideClicked = () => {
        if (this.props.outSideDisappear) {
            this.dismiss();
        }
    }

    render() {
        //计算屏的高度
        let screenHeight = height - StatusBar.currentHeight;
        //计算对话框内容区域top的起点位置;
        let top = this.position == "center" ? (screenHeight - this.height) / 2
            : this.position == "top" ? this.margin
                :(screenHeight - this.height - this.margin ) ;

        return this.state.isHidden ? <View/> : (
            <View style={styles.dialog_container}>
                {
                    //对话框半透明背景
                }
                <TouchableWithoutFeedback style={styles.dialog_mask}
                                          onPress={this.onDialogOutSideClicked}>
                    <View style={styles.dialog_mask}/>
                </TouchableWithoutFeedback>
                {
                    //对话内容区域视图渲染
                }
                <View style={[
                    styles.dialog_center,
                    this.props.contentStyle,
                    {
                        left:this.margin,
                        width:width - 2 * this.margin }] }>
                    {this.props.children}
                </View>

            </View>);
    }
}

const styles = StyleSheet.create({
    dialog_container: {
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
        justifyContent: "center",
        alignSelf: "center",
    },
    dialog_mask: {
        justifyContent: "center",
        backgroundColor: "#383838",
        opacity: 0.8,
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
    },
    dialog_center: {
        position: "absolute",
        width: width,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignSelf: "center",
        left: left,
    }
});
