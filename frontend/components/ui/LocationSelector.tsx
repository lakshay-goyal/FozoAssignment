import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { fontFamily } from '../../fonts'

interface LocationSelectorProps {
  address: string
  onPress?: () => void
}

export const LocationSelector = ({ address, onPress }: LocationSelectorProps) => {
  return (
    <View className="flex-1 items-center gap-3">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center border border-gray-200 rounded-full px-2 py-1"
      >
        <Text
          style={{ fontFamily: fontFamily.medium }}
          className="text-[13px] text-[#737477] mr-1"
        >
          Deliver to
        </Text>
        <ChevronDown size={15} color="#737477" />
      </TouchableOpacity>
      <Text
        style={{ fontFamily: fontFamily.medium }}
        className="text-[13px] text-[#242731] mt-0.5 text-center"
      >
        {address}
      </Text>
    </View>
  )
}

