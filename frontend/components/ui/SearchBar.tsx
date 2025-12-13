import { View, TextInput } from 'react-native'
import { fontFamily } from '../../fonts'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export const SearchBar = ({ value, onChangeText, placeholder = 'Search dishes, restaurants' }: SearchBarProps) => {
  return (
    <View
      className="flex-row items-center bg-[#F9F9FA] rounded-[15px] px-4 py-3"
      style={{ height: 50 }}
    >
      <View className="w-4 h-4 border-2 border-[#A0A5BA] rounded-full mr-3" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#A9ABB4"
        style={{
          fontFamily: fontFamily.regular,
          fontSize: 12,
          lineHeight: 18,
          flex: 1,
        }}
        className="text-[#242731]"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  )
}

