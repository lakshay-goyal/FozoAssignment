import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter, usePathname } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { Home, ShoppingCart, Heart, User, LogOut } from 'lucide-react-native'
import { useClerk } from '@clerk/clerk-expo'
import { fontFamily } from '../../fonts'

interface DrawerItem {
  label: string
  route: string
  icon: React.ComponentType<{ size: number; color: string }>
}

const drawerItems: DrawerItem[] = [
  { label: 'Home', route: '/(home)', icon: Home },
  { label: 'Cart', route: '/(home)/cart', icon: ShoppingCart },
  { label: 'Wishlist', route: '/(home)/wishlist', icon: Heart },
]

export const DrawerContent = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleNavigation = (route: string) => {
    router.push(route as any)
    onClose()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/(auth)/sign-in')
      onClose()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-8 border-b border-gray-200">
        <View className="w-16 h-16 rounded-full bg-[#FF6B57] items-center justify-center mb-3">
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: 24,
            }}
            className="text-white"
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fontFamily.semiBold,
            fontSize: 18,
          }}
          className="text-[#242731] mb-1"
        >
          {user?.username || 'User'}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: 14,
          }}
          className="text-[#7E8392]"
        >
          {user?.emailAddresses[0]?.emailAddress || ''}
        </Text>
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1">
        {drawerItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.route || (item.route === '/(home)' && pathname?.startsWith('/(home)') && pathname !== '/(home)/cart' && pathname !== '/(home)/wishlist')
          
          return (
            <TouchableOpacity
              key={item.route}
              onPress={() => handleNavigation(item.route)}
              className={`flex-row items-center px-6 py-4 ${
                isActive ? 'bg-[#FF6B57]/10' : ''
              }`}
            >
              <Icon
                size={24}
                color={isActive ? '#FF6B57' : '#7E8392'}
              />
              <Text
                style={{
                  fontFamily: isActive ? fontFamily.semiBold : fontFamily.regular,
                  fontSize: 16,
                }}
                className={`ml-4 ${isActive ? 'text-[#FF6B57]' : 'text-[#242731]'}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Sign Out */}
      <View className="px-6 py-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center"
        >
          <LogOut size={24} color="#EF4444" />
          <Text
            style={{
              fontFamily: fontFamily.medium,
              fontSize: 16,
            }}
            className="ml-4 text-[#EF4444]"
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

