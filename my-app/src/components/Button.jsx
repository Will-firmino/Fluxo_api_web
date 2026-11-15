import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

import { colors } from "../theme/colors";

// variant: "primary" (roxo), "danger" (vermelho) ou "secondary" (contornado)
export default function Button({
  title,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  ...rest
}) {
  const isSecondary = variant === "secondary";
  const blocked = disabled || loading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: blocked, busy: loading }}
      activeOpacity={0.8}
      disabled={blocked}
      style={[styles.base, styles[variant], blocked && styles.blocked, style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.text : colors.surface} />
      ) : (
        <Text style={[styles.label, isSecondary && styles.labelSecondary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blocked: { opacity: 0.6 },
  label: { color: colors.surface, fontSize: 16, fontWeight: "600" },
  labelSecondary: { color: colors.text },
});
