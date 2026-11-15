import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity} from "react-native";

export default function ButtonIcon({ icon, color, size = 24, ...rest }) {
    return (
        <TouchableOpacity accessibilityRole="button" {...rest}>
            <MaterialIcons
                name={icon}
                size={size}
                color={color}
            />
        </TouchableOpacity>
    )
}

