import { Text, TouchableOpacity, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "gradient"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  loading?: boolean
  disabled?: boolean
}

export const Button = ({
  title,
  onPress,
  variant = "secondary",
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const base =
    "w-full py-4 rounded-2xl items-center justify-center flex-row"

  const variants = {
    primary: "bg-[#D6EE72]",
    secondary: "bg-[#00494B]",
    outline: "border border-[#00494B] bg-transparent",
    danger: "bg-red-500",
    gradient: "bg-[#D6EE72] to-[#2EC4B6]",
  }

  const textVariants = {
    primary: "text-black",
    secondary: "text-white",
    outline: "text-[#00494B]",
    danger: "text-white",
    gradient: "text-white",
  }

  if (variant === "gradient") {
    return (
      <TouchableOpacity
        disabled={disabled || loading}
        activeOpacity={0.85}
        onPress={onPress}
        className="mb-4"
      >
        <LinearGradient
          colors={["#D6EE72", "#2EC4B6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`${base}`}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text className="font-sans text-black text-base font-semibold">
              {title}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      activeOpacity={0.85}
      onPress={onPress}
      className={`${base} ${variants[variant]} mb-4 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#00494B" : "#fff"} />
      ) : (
        <Text className={`font-sans text-base font-semibold ${textVariants[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}
