import { DARK_OVERLAY } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  detectionCount: number;
};

export function BottomHint({ detectionCount }: Props) {
  const insets = useSafeAreaInsets();

  const text =
    detectionCount > 0
      ? `${detectionCount} object${detectionCount > 1 ? "s" : ""} detected`
      : "Point at any object to detect it";

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.pill}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    backgroundColor: DARK_OVERLAY,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  text: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
