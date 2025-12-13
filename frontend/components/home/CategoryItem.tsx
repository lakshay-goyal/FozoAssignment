import { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'
import { fontFamily } from '../../fonts'

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryItemProps {
  category: Category
  isSelected: boolean
  onPress: () => void
}

export const CategoryItem = ({ category, isSelected, onPress }: CategoryItemProps) => {
  const scale = useSharedValue(1)
  const progress = useSharedValue(isSelected ? 1 : 0)
  const shadowOpacity = useSharedValue(isSelected ? 0.3 : 0)

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 300 })
    shadowOpacity.value = withTiming(isSelected ? 0.3 : 0, { duration: 300 })
  }, [isSelected])

  const animatedParentStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', '#6ED39D']
    ),
    shadowOpacity: shadowOpacity.value,
    transform: [{ scale: scale.value }],
  }))

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      ['#333333', '#FFFFFF']
    ),
  }))

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200, mass: 1 })
    })
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={{ width: 60, height: 93 }}
    >
      <Animated.View
        className="w-[60px] h-[85px] rounded-full items-center justify-center"
        style={[
          animatedParentStyle,
          {
            shadowColor: '#9EECC1',
            shadowOffset: { width: 0, height: 20 },
            shadowRadius: 30,
            elevation: 5,
          },
        ]}
      >
        <View
          className="w-[50px] h-[50px] rounded-full items-center justify-center mb-2"
          style={{
            backgroundColor: '#FFFFFF',
            shadowColor: '#D3D1D8',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.251,
            shadowRadius: 30,
            elevation: 5,
          }}
        >
          <Text className="text-2xl">{category.icon}</Text>
        </View>
        
        <Animated.Text
          style={[
            animatedTextStyle,
            {
              fontFamily: isSelected ? fontFamily.semiBold : fontFamily.regular,
              fontSize: 10,
              lineHeight: 15,
              textAlign: 'center',
            },
          ]}
        >
          {category.name}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

