import { TextInput, View } from "react-native"
import { cn } from "../app/utils/cn"
import { useState } from "react"

interface InputFeildProps {
    value: string
    placeholder: string
    onChangeText: (text: string) => void
    className?: string
    secureTextEntry?: boolean
}

export const InputFeild = ({ value, placeholder, onChangeText, className, secureTextEntry }: InputFeildProps) => {
    const [isFocused, setIsFocused] = useState(false)
    return (
        <View>
            <TextInput
                autoCapitalize="none"
                secureTextEntry={secureTextEntry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={value}
                placeholder={placeholder}
                onChangeText={(t) => {
                    onChangeText(t)
                }}
                className={cn("border border-gray-300 rounded-xl p-4 mb-4 bg-white w-full", isFocused && "border-gray-400", className)}
            />
        </View>
    )
}