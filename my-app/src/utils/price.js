const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// 1299.9 -> "R$ 1.299,90" (para exibir na lista)
export function formatPrice(value) {
  return formatter.format(value);
}

// 1299.9 -> "1299,90" (para preencher o campo ao alterar um produto)
export function priceToInput(value) {
  return Number(value).toFixed(2).replace(".", ",");
}

/*
 * Converte o texto digitado em número: "19,90", "19.90" e "1.299,90" são
 * aceitos. Devolve NaN quando o texto não é um preço válido.
 */
export function parsePrice(text) {
  const clean = text.replace(/\s/g, "").replace(/^R\$/, "");

  // Com vírgula, ela é o separador decimal e os pontos são de milhar.
  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean;

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return NaN;
  }

  return Number(normalized);
}
