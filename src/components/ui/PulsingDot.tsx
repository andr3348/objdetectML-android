import { ACCENT } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },
});
