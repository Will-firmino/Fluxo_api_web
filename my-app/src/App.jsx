import { Routes } from "./routes";
import { ProductsProvider } from "./contexts/ProductsContext";

export default function App() {
   // O ProductsProvider deixa a lista de produtos (vinda da API) disponível
   // para todas as telas. Dentro dele, o arquivo que contém as rotas/telas.
   return (
      <ProductsProvider>
         <Routes/>
      </ProductsProvider>
   )
  }
