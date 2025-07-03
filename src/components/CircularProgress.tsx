import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  size?: number;
  strokeWidth?: number;
  percentage: number;
  color?: string;
  bgColor?: string;
  label?: string;
}

const CircularProgress: React.FC<Props> = ({
  size = 48,
  strokeWidth = 6,
  percentage,
  color = '#f4631e',
  bgColor = '#eee',
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(percentage, 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={bgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference},${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
        <Text style={{ fontSize: size * 0.32, fontWeight: 'bold', color }}>{label ?? `${progress}%`}</Text>
      </View>
    </View>
  );
};

export default CircularProgress; 