import { Text, TouchableOpacity } from "react-native"

interface ButtonProps {
    title: string
    onPress: () => void
}

export const Button = ({ title, onPress }: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-[#D6EE72] rounded-xl py-4 mb-4 w-full"
        >
            <Text className="text-center font-normal text-black">
                {title}
            </Text>
        </TouchableOpacity>
    )
}