import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/api";

/*
 * Guarda a lista de produtos em um único lugar. Assim a tela de listagem, o
 * formulário e o contador da aba "Produtos" enxergam sempre os mesmos dados,
 * sem precisar buscar tudo de novo na API a cada troca de tela.
 */
const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // READ -> busca todos os produtos na API.
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProducts(await getProducts());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega a lista uma vez, quando o app abre.
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // CREATE (sem id) ou UPDATE (com id). Depois ajusta a lista em memória.
  const saveProduct = useCallback(async (data, id) => {
    const isNew = id == null;
    const saved = isNew
      ? await createProduct(data)
      : await updateProduct(id, data);

    setProducts((current) =>
      isNew
        ? [...current, saved]
        : current.map((product) => (product.id === id ? saved : product))
    );
    setError(null); // A API respondeu: um aviso antigo de falha de conexão já não vale.
    return saved;
  }, []);

  // DELETE -> remove na API e depois tira da lista em memória.
  const removeProduct = useCallback(async (id) => {
    try {
      await deleteProduct(id);
    } catch (e) {
      // 404 = o produto já não existe na API; basta tirá-lo da lista.
      if (e.status !== 404) {
        throw e;
      }
    }
    setProducts((current) => current.filter((product) => product.id !== id));
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      loadProducts,
      saveProduct,
      removeProduct,
    }),
    [products, loading, error, loadProducts, saveProduct, removeProduct]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

// Hook para as telas acessarem os produtos: const { products } = useProducts();
export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts precisa ser usado dentro de <ProductsProvider>.");
  }
  return context;
}
