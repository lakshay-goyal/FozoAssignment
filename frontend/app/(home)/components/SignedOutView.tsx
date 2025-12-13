import { View, Text } from 'react-native'
import { Link } from 'expo-router'

export const SignedOutView = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Link href="../sign-in">
        <Text className="font-sans text-[#F05A28] text-lg font-semibold">Sign in</Text>
      </Link>
    </View>
  )
}