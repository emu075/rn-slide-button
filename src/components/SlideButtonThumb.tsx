import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {SlideButtonCommonProps} from './SlideButton';

const DEFAULT_ICON_CONTAINER_COLOR = '#FFFFFF';

/**
 * Props for the SlideButtonThumb component
 */
export interface SlideButtonThumbProps extends SlideButtonCommonProps {
  /**
   * Gesture handler for pan gestures
   */
  gestureHandler?:
    | ((event: GestureEvent<PanGestureHandlerEventPayload>) => void)
    | undefined;
  
  /**
   * Custom icon component
   */
  icon?: React.ReactNode;
  
  /**
   * Style for the thumb component
   */
  thumbStyle?: StyleProp<ViewStyle>;
  
  /**
   * Callback when animation starts
   */
  animStarted?: () => void;
  
  /**
   * Callback when animation ends
   */
  animEnded?: () => void;
  
  /**
   * Whether the component is in RTL mode
   */
  isRTL: boolean;
  
  /**
   * Enable animation
   * @default false
   */
  animation?: boolean;
  
  /**
   * Animation duration in milliseconds
   * @default 180
   */
  animationDuration?: number;
  
  /**
   * Enable dynamic reset
   * @default false
   */
  dynamicResetEnabled?: boolean;
  
  /**
   * Dynamic reset delaying
   * @default false
   */
  dynamicResetDelaying?: boolean;
}

const SlideButtonThumb = ({
  icon,
  gestureHandler,
  translateX,
  height,
  padding,
  endReached,
  borderRadius,
  thumbStyle,
  animStarted,
  animEnded,
  isRTL,
  animation = false,
  animationDuration = 180,
  dynamicResetEnabled = false,
  dynamicResetDelaying = false,
}: SlideButtonThumbProps) => {

  const opacityValue = useSharedValue(1);

  const play = () => {
    const repeatCount = dynamicResetEnabled ? -1 : 6;
    opacityValue.value = withRepeat(
      withTiming(
        0.4,
        {duration: animationDuration, easing: Easing.inOut(Easing.ease)},
      ),
      repeatCount,
      true,
      () => {
        runOnJS(animFinished)();
      },
    );
  };

  const stop = () => {
    cancelAnimation(opacityValue);
    runOnJS(animFinished)();
  }

  const animFinished = () => {
    animEnded && animEnded();
  };

  const thumbAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: endReached ? opacityValue.value : 1,
      transform: [{translateX: translateX.value}],
    };
  });

  //const KEY = isRTL ? 'right' : 'left';
  const thumbDynamicStyle = {
    left: padding,
    width: height,
    height,
    borderRadius,
  };

  const iconContainerDynamicStyle = {
    width: height,
    height,
    borderRadius,
    transform: [{scaleX: isRTL ? -1 : 1}],
  };

  React.useEffect(() => {
    if (endReached) {
      if (animation) {
        animStarted && animStarted();
        play();
      }  
    }
  }, [endReached]);

  React.useEffect(() => {
    if (dynamicResetEnabled) {
      if (!dynamicResetDelaying) {
        stop()
      }  
    }
  }, [dynamicResetDelaying]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        testID="ThumbContainer"
        style={[
          styles.thumbContainer,
          thumbAnimStyle,
          thumbDynamicStyle,
          thumbStyle,
        ]}>
        <Animated.View
          testID="IconContainer"
          style={[styles.iconContainer, iconContainerDynamicStyle]}>
          {icon}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default React.memo(SlideButtonThumb);

const styles = StyleSheet.create({
  thumbContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DEFAULT_ICON_CONTAINER_COLOR,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
