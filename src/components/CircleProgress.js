/**
 * 圆形进度条
 */
import React, { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import Svg, { Circle, Text, G } from 'react-native-svg';

const svgSize = 70;  // 画布的宽高
const halfOfSvgSize = svgSize / 2;
const strokeWidth = 2;  // 圆形进度条宽度
const radius = (svgSize - strokeWidth) / 2;  // 外层倒计时进度半径
const innerRadius = radius - 6;  // 内层半径
const circumference = 2 * radius * Math.PI;  // 总周长

const CircleProgress = (props) => {
    const { progress, durationTime } = props;
    const radian = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 2 * Math.PI]
    });
    const circumferenceWithProgress = Animated.multiply(radius, radian);
    const AnimatedCircleProgress = Animated.createAnimatedComponent(Circle);
    const outerCircleCommonConfig = {
        fill: 'none',
        cx: halfOfSvgSize,
        cy: halfOfSvgSize,
        r: radius,
        strokeWidth: strokeWidth,
        strokeDasharray: `${circumference}  ${circumference}`
    };

    const [count, setCount] = useState(durationTime);

    useEffect(() => {
        progress.addListener(({ value }) => {
            const ratio = 1 - value;
            setCount(Math.round(durationTime * ratio));
        });
        return () => {
            progress.removeAllListeners();
        }
    }, [])

    return (
        <Svg width={svgSize} height={svgSize}>
            {/* 内层显示倒计时时间圆圈 */}
            <Circle
                stroke='#25BB7E'
                fill='#25BB7E'
                cx={halfOfSvgSize}
                cy={halfOfSvgSize}
                r={innerRadius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference}  ${circumference}`}
            />
            <Text
                fill="#fff"
                fontSize="20"
                fontWeight="bold"
                x={halfOfSvgSize}
                y={halfOfSvgSize + 5}
                textAnchor="middle"
            >
                {`${count} s`}
            </Text>
            {/* 外层倒计时圆圈 */}
            <G rotation={-90} origin={`${halfOfSvgSize}, ${halfOfSvgSize}`}>
                <Circle
                    stroke='#D2D2D2'
                    {...outerCircleCommonConfig}
                />
                <AnimatedCircleProgress
                    stroke='#25BB7E'
                    {...outerCircleCommonConfig}
                    strokeDashoffset={circumferenceWithProgress}
                />
            </G>
        </Svg>
    );
};

export default CircleProgress;