import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Menu } from 'lucide-react-native'
import { useUser } from '@clerk/clerk-expo'
import { fontFamily } from '../../fonts'
import { LocationSelector } from '../ui/LocationSelector'
import { SearchBar } from '../ui/SearchBar'

interface HomeHeaderProps {
  address: string
  searchQuery: string
  onSearchChange: (text: string) => void
  onProfilePress: () => void
  onLocationPress?: () => void
}

export const HomeHeader = ({
  address,
  searchQuery,
  onSearchChange,
  onProfilePress,
  onLocationPress,
}: HomeHeaderProps) => {
  const { user } = useUser()

  return (
    <View className="px-6 pt-12 pb-4">
      <View className="flex-row justify-between items-center mb-4 gap-6">
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm"
          style={{
            shadowColor: '#D3D1D8',
            shadowOffset: { width: 5, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 5,
          }}
        >
          <Menu size={20} color="#111719" strokeWidth={2} />
        </TouchableOpacity>

        <LocationSelector address={address} onPress={onLocationPress} />

        <View className="relative">
          <TouchableOpacity
            className="w-10 h-10 rounded-[10px] overflow-hidden"
            onPress={onProfilePress}
            style={{
              shadowColor: '#D3D1D8',
              shadowOffset: { width: 5, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 5,
            }}
          >
            <Image
              source={{ uri: user?.imageUrl || 'https://via.placeholder.com/40' }}
              className="w-full h-full"
            />
          </TouchableOpacity>
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC529] rounded-full items-center justify-center">
            <Text
              style={{ fontFamily: fontFamily.semiBold }}
              className="text-[9px] text-white"
            >
              2
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-4">
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: 20,
            lineHeight: 30,
            color: '#FE724D',
          }}
        >
          Good Afternoon!
        </Text>
      </View>

      <SearchBar value={searchQuery} onChangeText={onSearchChange} />
    </View>
  )
}

