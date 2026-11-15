import { Modal, StyleSheet, Text, View } from "react-native";

import Button from "./Button";
import { colors } from "../theme/colors";

/*
 * Caixa de confirmação para ações que não têm volta (ex.: excluir).
 * Usa o Modal em vez do Alert.alert porque o Alert não funciona no navegador.
 */
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirmar",
  loading = false,
  error,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityRole="alert">
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              variant="secondary"
              style={styles.button}
              disabled={loading}
              onPress={onCancel}
            />
            <Button
              title={confirmLabel}
              variant="danger"
              style={styles.button}
              loading={loading}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: colors.overlay,
  },
  dialog: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.text },
  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  error: { marginTop: 12, fontSize: 14, color: colors.danger },
  actions: { flexDirection: "row", gap: 12, marginTop: 24 },
  button: { flex: 1 },
});
