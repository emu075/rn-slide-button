import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { SlideButtonCommonProps } from './SlideButton';

const DEFAULT_TEXT_COLOR = '#FAFAFA';
const DEFAULT_FONT_SIZE = 16;

export interface SlideButtonTextProps
  extends Omit<SlideButtonCommonProps, 
  'autoReset' | 'autoResetDelay' | 'animation'| 'animationDuration' | 'endReached'> {
  /**
   * Text to display in the button
   */
  title: string;

  /**
   * Style for the title text
   */
  titleStyle?: StyleProp<TextStyle>;

  /**
   * Style for the title container
   */
  titleContainerStyle?: StyleProp<ViewStyle>;

  /**
   * Height of the button
   * @default 56
   */
  height?: number;

  /**
   * Border radius of the button
   * @default height / 2
   */
  borderRadius?: number;

  /**
   * Padding around the button
   * @default 5
   */
  padding?: number;
}

const SlideButtonText = ({
  title,
  titleStyle,
  titleContainerStyle,
  height = 56,
  borderRadius = 28,
  padding = 5,
  translateX,
  scrollDistance
}: SlideButtonTextProps) => {
  const textAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateX.value,
        [0, scrollDistance],
        [0.99, 0],
        Extrapolate.CLAMP,
      ),
    };
  })

  return (
    <View
      testID="TitleContainer"
      style={[
        styles.titleContainer,
        {
          height,
          margin: padding,
          borderRadius
        },
        titleContainerStyle
      ]}
    >
      <Animated.Text
        testID="Title"
        numberOfLines={2}
        allowFontScaling={false}
        style={[styles.title, titleStyle, textAnimStyle]}
      >
        {title}
      </Animated.Text>
    </View>
  );
};

export default React.memo(SlideButtonText);

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: DEFAULT_FONT_SIZE,
    maxWidth: '50%',
    textAlign: 'center',
    color: DEFAULT_TEXT_COLOR,
  },
});
