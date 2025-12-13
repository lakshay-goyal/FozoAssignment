import { View, ActivityIndicator, Text } from 'react-native'
import { fontFamily } from '../../../fonts'

interface LoadingStateProps {
  message?: string
}

export const LoadingState = ({ message = 'Loading...' }: LoadingStateProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size="large" color="#FF6B57" />
      <Text
        style={{ fontFamily: fontFamily.regular }}
        className="mt-3 text-gray-500"
      >
        {message}
      </Text>
    </View>
  )
}