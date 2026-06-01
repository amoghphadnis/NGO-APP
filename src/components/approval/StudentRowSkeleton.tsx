import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const TABLE_WIDTH = 1180;

const COLUMNS = [120, 100, 140, 90, 100, 80, 140, 90, 60, 120, 140];

export default function StudentRowSkeleton() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.row}>
      {COLUMNS.map((width, index) => (
        <View key={index} style={[styles.cell, { width }]}>
          <Animated.View style={[styles.placeholder, animatedStyle]} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: TABLE_WIDTH,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  cell: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  placeholder: {
    height: 14,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
});
