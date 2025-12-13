import React, { useState, useEffect } from 'react'
import { View, Text, Dimensions, Keyboard, ScrollView } from 'react-native'
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
  onDragStateChange?: (isDragging: boolean) => void
}

export function DraggableCard({ children, title, onDragStateChange }: DraggableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  const cardHeight = useSharedValue(MIN_HEIGHT)
  const startHeight = useSharedValue(MIN_HEIGHT)

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true)
      cardHeight.value = withSpring(MAX_HEIGHT)
      setIsExpanded(true)
    })
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false)
      cardHeight.value = withSpring(MIN_HEIGHT)
      setIsExpanded(false)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  /* ---------------- DRAG GESTURE ---------------- */
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = cardHeight.value
      if (onDragStateChange) {
        runOnJS(onDragStateChange)(true)
      }
    })
    .onUpdate((e) => {
      const nextHeight = startHeight.value - e.translationY

      if (nextHeight >= MIN_HEIGHT && nextHeight <= MAX_HEIGHT) {
        cardHeight.value = nextHeight
      }
    })
    .onEnd(() => {
      if (onDragStateChange) {
        runOnJS(onDragStateChange)(false)
      }
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
    zIndex: 20,
  }))

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={animatedStyle}
        className="absolute bottom-0 w-full bg-white rounded-t-3xl px-6 pb-8 pt-6"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={isExpanded && !isKeyboardVisible ? { flexGrow: 1, justifyContent: 'center' } : { flexGrow: 0 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!isExpanded && (
            <View className="w-10 h-1 bg-gray-400 rounded-full self-center mb-4" />
          )}

          {title && (
            <Text className="text-xl font-bold text-center mb-6 text-gray-800">
              {title}
            </Text>
          )}

          <View className="w-full">
            {children}
          </View>
        </ScrollView>

      </Animated.View>
    </GestureDetector>
  )
}