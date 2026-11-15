import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import Header from "../components/Header";
import ButtonIcon from "../components/ButtonIcon";
import Title from "../components/Title";
import Input from "../components/Input";
import Button from "../components/Button";
import { useProducts } from "../contexts/ProductsContext";
import { colors } from "../theme/colors";
import { parsePrice, priceToInput } from "../utils/price";

// A mesma tela serve para cadastrar e para alterar:
//   navigation.navigate("productForm")            -> cadastro
//   navigation.navigate("productForm", { id: 3 }) -> alteração do produto 3
export default function ProductForm() {
  const navigation = useNavigation();
  const route = useRoute();
  const { products, saveProduct } = useProducts();

  const id = route.params?.id;
  const editing = id != null;
  const product = editing
    ? products.find((item) => item.id === id)
    : undefined;

  const [nome, setNome] = useState(product?.nome ?? "");
  const [preco, setPreco] = useState(
    product ? priceToInput(product.preco) : ""
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const precoRef = useRef(null);

  async function handleSave() {
    // Validação no app, antes de incomodar a API.
    const errors = {};
    const precoNumber = parsePrice(preco);

    if (!nome.trim()) {
      errors.nome = "Informe o nome do produto.";
    }
    if (Number.isNaN(precoNumber)) {
      errors.preco = "Informe um preço válido (ex.: 19,90).";
    } else if (precoNumber <= 0) {
      errors.preco = "O preço deve ser maior que zero.";
    }

    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      await saveProduct({ nome: nome.trim(), preco: precoNumber }, id);
      navigation.goBack();
    } catch (e) {
      // A API também valida: se ela apontar um campo, o erro aparece nele;
      // qualquer outro problema (ex.: sem conexão) aparece acima do botão.
      setFieldErrors(e.fieldErrors);
      if (Object.keys(e.fieldErrors).length === 0) {
        setFormError(e.message);
      }
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Header style={styles.header}>
          <ButtonIcon
            icon="arrow-circle-left"
            accessibilityLabel="Voltar"
            onPress={() => navigation.goBack()}
          />
          <Title>{editing ? "Alterar produto" : "Novo produto"}</Title>
        </Header>

        <Input
          label="Nome"
          placeholder="Ex.: Teclado mecânico"
          value={nome}
          onChangeText={setNome}
          error={fieldErrors.nome}
          maxLength={120}
          returnKeyType="next"
          onSubmitEditing={() => precoRef.current?.focus()}
        />
        <Input
          ref={precoRef}
          label="Preço (R$)"
          placeholder="0,00"
          value={preco}
          onChangeText={setPreco}
          error={fieldErrors.preco}
          keyboardType="decimal-pad"
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        {formError ? (
          <Text style={styles.formError} accessibilityRole="alert">
            {formError}
          </Text>
        ) : null}

        <Button
          title={editing ? "Salvar alterações" : "Cadastrar"}
          loading={saving}
          onPress={handleSave}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    padding: 32,
    paddingTop: 54,
  },
  header: { marginBottom: 32 },
  formError: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.dangerSurface,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
});
