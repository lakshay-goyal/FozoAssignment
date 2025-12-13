import { View, Text, TouchableOpacity } from 'react-native'
import { fontFamily } from '../../../fonts'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export const ErrorState = ({ 
  message, 
  onRetry, 
  retryLabel = 'Retry' 
}: ErrorStateProps) => {
  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text
        style={{ fontFamily: fontFamily.regular }}
        className="text-red-500 text-center mb-4"
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="bg-[#FF6B57] px-6 py-3 rounded-full"
        >
          <Text
            style={{ fontFamily: fontFamily.semiBold }}
            className="text-white"
          >
            {retryLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}