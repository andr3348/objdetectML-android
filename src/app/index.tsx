import { useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

import { CameraView } from "@/components/camera/CameraView";
import { NoDeviceScreen } from "@/components/camera/NoDeviceScreen";
import { PermissionScreen } from "@/components/camera/PermissionScreen";
import { BottomHint } from "@/components/ui/BottomHint";
import { TopBar } from "@/components/ui/TopBar";
import { useObjectDetection } from "@/hooks/useObjectDetection";

type CameraFacing = "back" | "front";

export default function Index() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState<CameraFacing>("back");
  const device = useCameraDevice(facing);

  const { detections, frameOutput, isModelLoaded } = useObjectDetection();

  if (!hasPermission) return <PermissionScreen onRequest={requestPermission} />;
  if (!device) return <NoDeviceScreen />;

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <CameraView
        device={device}
        frameOutput={frameOutput}
        detections={detections}
      />
      <TopBar
        onFlip={() => setFacing((f) => (f === "back" ? "front" : "back"))}
        isModelLoaded={isModelLoaded}
      />
      <BottomHint detectionCount={detections.length} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
});
