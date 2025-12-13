import { Text, TextInput, View } from "react-native"
import { cn } from "../../app/utils/cn"
import { useState } from "react"
import { fontFamily } from "../../fonts"

type InputVariant = "default" | "floating" | "filled"
type InputTheme = "light" | "dark" | "primary"
type InputSize = "sm" | "md" | "lg"
type BorderVariant = "outline" | "underline"

interface InputFieldProps {
    value: string
    label?: string
    placeholder?: string
    onChangeText: (text: string) => void
    secureTextEntry?: boolean

    variant?: InputVariant
    theme?: InputTheme
    size?: InputSize
    borderVariant?: BorderVariant

    error?: string
    className?: string
}

const sizeStyles: Record<InputSize, string> = {
    sm: "text-sm px-3 py-2",
    md: "text-base px-4 py-3",
    lg: "text-lg px-5 py-4",
}

const themeStyles: Record<InputTheme, string> = {
    light: "bg-[#F9F9FA] text-black border-[#F9F9FA]",
    dark: "bg-[#1c1c1e] text-white border-gray-600",
    primary: "bg-[#ECFDFD] text-[#00494B] border-[#2EC4B6]",
}

const borderStyles: Record<BorderVariant, string> = {
    outline: "border rounded-xl",
    underline: "border-b",
}

export const InputField = ({
    value,
    label,
    placeholder,
    onChangeText,
    secureTextEntry,
    variant = "filled",
    theme = "light",
    size = "md",
    borderVariant = "outline",
    error,
    className,
}: InputFieldProps) => {
    const [isFocused, setIsFocused] = useState(false)

    const showFloatingLabel = variant === "floating" && (isFocused || value)

    return (
        <View className="mb-4">
            {/* Floating Label */}
            {variant === "floating" && label && (
                <Text
                    className={cn(
                        "font-sans absolute left-4 z-10 px-1",
                        showFloatingLabel
                            ? "top-1 text-xs text-gray-500 bg-white"
                            : "top-1/2 -translate-y-1/2 text-base text-gray-400",
                        theme === "dark" && "bg-[#1c1c1e]",
                        error && "text-red-500"
                    )}
                >
                    {label}
                </Text>
            )}

            <TextInput
                value={value}
                placeholder={variant === "floating" ? "" : placeholder}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={onChangeText}
                style={{ fontFamily: fontFamily.regular }}
                className={cn(
                    "w-full",
                    sizeStyles[size],
                    themeStyles[theme],
                    borderStyles[borderVariant],
                    isFocused && "border-gray-400",
                    error && "border-red-500",
                    variant === "floating" && "pt-2",
                    className
                )}
            />

            {error && (
                <Text className="font-sans mt-1 text-xs text-red-500">{error}</Text>
            )}
        </View>
    )
}