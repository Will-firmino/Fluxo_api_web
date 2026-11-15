import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BottomRoutes } from "./BottomRoutes";
import ProductForm from "../screens/ProductForm";

const Stack = createNativeStackNavigator();

export function StackRoutes() {
  return (
    <Stack.Navigator
      initialRouteName="tabs"
      screenOptions={{ headerShown: false }}
    >
      {/* A primeira tela da pilha são as abas (Início, Produtos e Perfil)... */}
      <Stack.Screen name="tabs" component={BottomRoutes} />
      {/* ...e o formulário é empilhado por cima delas, cobrindo a barra de abas. */}
      <Stack.Screen name="productForm" component={ProductForm} />
    </Stack.Navigator>
  );
}
