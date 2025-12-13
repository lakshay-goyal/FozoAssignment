import { View, Image, Dimensions, Text } from 'react-native'
import { BlurView } from 'expo-blur'

const { width } = Dimensions.get('window')

const BURGER_SIZE = width * 0.70

interface BurgerBackgroundProps {
  hideLogo?: boolean
}

export function BurgerBackground({ hideLogo = false }: BurgerBackgroundProps) {
  return (
    <View className="absolute inset-0">
      <View className="absolute inset-0 bg-[#00494B]" />
      <BlurView intensity={20} className="absolute inset-0" />
      {!hideLogo && (
        <View 
          className="absolute left-0 right-0 items-center justify-center top-36 opacity-100"
          style={{ zIndex: 10 }}
        >
          <Image
            source={{ uri: "https://getfozo.in/brand-full.png" }}
            className="w-32 h-16"
            resizeMode="contain"
          />
          <Text className="font-semibold text-gray-300 mt-2 tracking-wider text-base">
            Fast delivery at your doorstep
          </Text>
        </View>
      )}

      <Image
        source={require('@/assets/burger.png')}
        resizeMode="contain"
        style={{
          width: BURGER_SIZE,
          height: BURGER_SIZE,
          position: 'absolute',
          top: 200,
          left: -BURGER_SIZE * 0.30,
        }}
      />

      <Image
        source={require('@/assets/burger.png')}
        resizeMode="contain"
        style={{
          width: BURGER_SIZE,
          height: BURGER_SIZE,
          position: 'absolute',
          top: 300,
          right: -BURGER_SIZE * 0.40,
        }}
      />
    </View>
  )
}
