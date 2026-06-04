import { ACCENT } from "@/constants/theme";
import { Detection } from "@/types/Detection";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  detections: Detection[];
  frameWidth: number;
  frameHeight: number;
};

export function BoundingBoxes({ detections, frameWidth, frameHeight }: Props) {
  return (
    <>
      {detections.map((detection, index) => {
        const left = detection.xMin * frameWidth;
        const top = detection.yMin * frameHeight;
        const width = (detection.xMax - detection.xMin) * frameWidth;
        const height = (detection.yMax - detection.yMin) * frameHeight;
        const pct = Math.round(detection.confidence * 100);

        return (
          <View key={index} style={[styles.box, { left, top, width, height }]}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText} numberOfLines={1}>
                {detection.label} {pct}%
              </Text>
            </View>
          </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  box: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: ACCENT,
    borderRadius: 4,
  },
  labelContainer: {
    position: "absolute",
    top: -22,
    left: -1,
    backgroundColor: ACCENT,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  labelText: {
    color: "#000",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
