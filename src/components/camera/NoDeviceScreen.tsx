import { StyleSheet, Text, View } from "react-native";

export function NoDeviceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Camera Found</Text>
      <Text style={styles.subtitle}>
        Could not find a camera on this device.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});
