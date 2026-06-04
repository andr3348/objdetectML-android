import { useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import {
  Camera,
  CameraDevice,
} from "react-native-vision-camera";
import type { CameraFrameOutput } from "react-native-vision-camera";

type Props = {
  device: CameraDevice;
  frameOutput: CameraFrameOutput;
};

export function CameraView({ device, frameOutput }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  // Fade in the camera preview once it's ready to avoid a white flash on Android
  const onCameraReady = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        outputs={[frameOutput]}
        onStarted={onCameraReady}
      />
    </Animated.View>
  );
}
