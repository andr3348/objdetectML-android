import type { Detection } from "@/types/Detection";
import { useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";
import type { CameraFrameOutput } from "react-native-vision-camera";
import { Camera, CameraDevice } from "react-native-vision-camera";
import { BoundingBoxes } from "./BoundingBoxes";

type Props = {
  device: CameraDevice;
  frameOutput: CameraFrameOutput;
  detections: Detection[];
};

export function CameraView({ device, frameOutput, detections }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

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
      <BoundingBoxes
        detections={detections}
        frameWidth={width}
        frameHeight={height}
      />
    </Animated.View>
  );
}
