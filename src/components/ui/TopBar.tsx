import { ACCENT, DARK_OVERLAY } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PulsingDot } from "./PulsingDot";

type Props = {
  onFlip: () => void;
};

export function TopBar({ onFlip }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.liveChip}>
        <PulsingDot />
        <Text style={styles.liveText}>LIVE</Text>
      </View>

      <Text style={styles.title}>ObjDetect</Text>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onFlip}
        activeOpacity={0.7}
      >
        <Text style={styles.iconBtnText}>⇄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: DARK_OVERLAY,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  liveText: {
    color: ACCENT,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: DARK_OVERLAY,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 22,
  },
});
