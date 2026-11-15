import { NavigationContainer } from "@react-navigation/native";
import { StackRoutes } from "./StackRoutes";

export function Routes() {
  return (
    <NavigationContainer>
      {/* A pilha é a navegação principal; as abas (BottomRoutes) ficam dentro dela. */}
      <StackRoutes />
    </NavigationContainer>
  );
}
