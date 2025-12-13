import { View, Image, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const BURGER_SIZE = width * 0.70

export function BurgerBackground() {
  return (
    <View className="absolute inset-0 bg-[#D6EE72]">
      <Image
        source={require('@/assets/burger.png')}
        resizeMode="contain"
        style={{
          width: BURGER_SIZE,
          height: BURGER_SIZE,
          position: 'absolute',
          top: 40,
          left: width / 3 - BURGER_SIZE / 4,
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
          left: -BURGER_SIZE * 0.25,
        }}
      />

      <Image
        source={require('@/assets/burger.png')}
        resizeMode="contain"
        style={{
          width: BURGER_SIZE,
          height: BURGER_SIZE,
          position: 'absolute',
          top: 220,
          right: -BURGER_SIZE * 0.50,
        }}
      />
    </View>
  )
}
