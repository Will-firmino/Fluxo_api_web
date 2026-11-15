import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme/colors";

// Campo de texto com rótulo em cima e mensagem de erro embaixo.
// As demais propriedades (value, onChangeText, keyboardType...) vão direto
// para o TextInput.
export default function Input({ label, error, style, ...rest }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, error && styles.inputError, style]}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 20 },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    fontSize: 16,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { marginTop: 6, fontSize: 13, color: colors.danger },
});
