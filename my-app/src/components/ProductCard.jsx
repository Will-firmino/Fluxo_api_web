import { StyleSheet, Text, View } from "react-native";

import ButtonIcon from "./ButtonIcon";
import { colors } from "../theme/colors";
import { formatPrice } from "../utils/price";

// Uma linha da lista: nome e preço à esquerda, botões de alterar e excluir à direita.
export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nome}
        </Text>
        <Text style={styles.price}>{formatPrice(product.preco)}</Text>
      </View>

      <ButtonIcon
        icon="edit"
        color={colors.textMuted}
        style={styles.action}
        accessibilityLabel={`Alterar ${product.nome}`}
        onPress={onEdit}
      />
      <ButtonIcon
        icon="delete"
        color={colors.danger}
        style={styles.action}
        accessibilityLabel={`Excluir ${product.nome}`}
        onPress={onDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  info: { flex: 1, marginRight: 4 },
  name: { fontSize: 16, fontWeight: "600", color: colors.text },
  price: { marginTop: 4, fontSize: 14, color: colors.textMuted },
  action: { padding: 12 },
});
