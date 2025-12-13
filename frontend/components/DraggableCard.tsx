import React, { useState } from 'react'
import { View, Text, Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'

const { height } = Dimensions.get('window')

const MIN_HEIGHT = height * 0.5
const MAX_HEIGHT = height

interface DraggableCardProps {
  children: React.ReactNode
  title?: string
}

export function DraggableCard({ children, title }: DraggableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const cardHeight = useSharedValue(MIN_HEIGHT)
  const startHeight = useSharedValue(MIN_HEIGHT)

  /* ---------------- DRAG GESTURE ---------------- */
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = cardHeight.value
    })
    .onUpdate((e) => {
      const nextHeight = startHeight.value - e.translationY

      if (nextHeight >= MIN_HEIGHT && nextHeight <= MAX_HEIGHT) {
        cardHeight.value = nextHeight
      }
    })
    .onEnd(() => {
      if (cardHeight.value > height * 0.75) {
        cardHeight.value = withSpring(MAX_HEIGHT)
        runOnJS(setIsExpanded)(true)
      } else {
        cardHeight.value = withSpring(MIN_HEIGHT)
        runOnJS(setIsExpanded)(false)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
  }))

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={animatedStyle}
        className={`absolute bottom-0 w-full bg-white rounded-t-3xl px-6 pb-8 ${
          isExpanded ? 'justify-center' : 'pt-6'
        }`}
      >
        <View className={isExpanded ? 'items-center' : ''}>
          {!isExpanded && (
            <View className="w-10 h-1 bg-gray-400 rounded-full self-center mb-4" />
          )}

          {title && (
            <Text className="text-xl font-bold text-center mb-6 text-gray-800">
              {title}
            </Text>
          )}

          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  )
}