import { View } from "react-native";

export default function Header( { children, style }) {
    return (
        <View
            style={[{
                width:'100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 54,
            }, style]}>
            {children}
        </View>
    )
}
