import { ACCENT } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onRequest: () => void;
};

export function PermissionScreen({ onRequest }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera Access</Text>
      <Text style={styles.subtitle}>
        Required to detect and classify objects in real time.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={onRequest}
        activeOpacity={0.75}
      >
        <Text style={styles.buttonText}>Grant Permission</Text>
      </TouchableOpacity>
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
    marginBottom: 36,
  },
  button: {
    backgroundColor: ACCENT,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
