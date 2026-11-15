import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Header from "../components/Header";
import ButtonIcon from "../components/ButtonIcon";
import Title from "../components/Title";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import ConfirmDialog from "../components/ConfirmDialog";
import { useProducts } from "../contexts/ProductsContext";
import { colors } from "../theme/colors";

export default function Product() {
  const navigation = useNavigation();
  const { products, loading, error, loadProducts, removeProduct } =
    useProducts();

  // Produto escolhido para exclusão. Ele continua guardado depois que a caixa
  // de confirmação fecha, para o nome não sumir durante a animação de saída.
  const [productToDelete, setProductToDelete] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function askToDelete(product) {
    setDeleteError(null);
    setProductToDelete(product);
    setConfirmVisible(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await removeProduct(productToDelete.id);
      setConfirmVisible(false);
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  // Na primeira carga ainda não há lista para mostrar: só o indicador.
  const firstLoad = loading && products.length === 0;

  return (
    <View style={styles.container}>
      <Header style={styles.header}>
        <Title>Produtos</Title>
        <View style={styles.headerActions}>
          <ButtonIcon
            icon="refresh"
            style={styles.headerButton}
            accessibilityLabel="Atualizar lista"
            disabled={loading}
            onPress={loadProducts}
          />
          <ButtonIcon
            icon="add-circle"
            color={colors.primary}
            style={styles.headerButton}
            accessibilityLabel="Cadastrar produto"
            onPress={() => navigation.navigate("productForm")}
          />
        </View>
      </Header>

      {error ? (
        <View style={styles.errorBox} accessibilityRole="alert">
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Tentar novamente"
            variant="secondary"
            loading={loading}
            onPress={loadProducts}
          />
        </View>
      ) : null}

      {firstLoad ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.hint}>Carregando produtos...</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onEdit={() => navigation.navigate("productForm", { id: item.id })}
              onDelete={() => askToDelete(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            products.length > 0 ? (
              <Text style={styles.count}>
                {products.length === 1
                  ? "1 produto cadastrado"
                  : `${products.length} produtos cadastrados`}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            error ? null : (
              <View style={styles.centered}>
                <Text style={styles.emptyTitle}>Nenhum produto cadastrado</Text>
                <Text style={styles.hint}>
                  Toque no botão + para cadastrar o primeiro.
                </Text>
              </View>
            )
          }
          // Puxar a lista para baixo busca os produtos de novo na API.
          refreshing={loading}
          onRefresh={loadProducts}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmDialog
        visible={confirmVisible}
        title="Excluir produto"
        message={`Deseja excluir "${productToDelete?.nome}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={deleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 54,
  },
  header: { marginBottom: 24 },
  headerActions: { flexDirection: "row", alignItems: "center" },
  headerButton: { padding: 8 },
  errorBox: {
    marginBottom: 16,
    padding: 16,
    gap: 12,
    borderRadius: 12,
    backgroundColor: colors.dangerSurface,
  },
  errorText: { fontSize: 14, lineHeight: 20, color: colors.text },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 54,
  },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: colors.text },
  hint: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: colors.textMuted,
  },
  count: { marginBottom: 12, fontSize: 14, color: colors.textMuted },
  separator: { height: 12 },
  listContent: { flexGrow: 1, paddingBottom: 32 },
});
