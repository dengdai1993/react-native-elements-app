'use strict'
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    StatusBar,
    Dimensions, TouchableWithoutFeedback, Animated
} from 'react-native';

export default class Dialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(this.props.initValue)
        };
    }

    setProgress(progress) {
        this.setState({
            progress: new Animated.Value(progress)
        })
    }

    render() {
        return (
            <View style={[styles.background, this.props.style]}>
                <Animated.View style={[styles.fill, { width: this.state.progress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                    })} ]}
                />
            </View>);
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#bbbbbb',
        height: 5,
        overflow: 'hidden'
    },
    fill: {
        backgroundColor: 'rgba(0, 122, 255, 1)',
        height: 5
    }
});
