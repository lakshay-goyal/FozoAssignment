import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useUser, useClerk } from '@clerk/clerk-expo'
import { Mail, User, LogOut } from 'lucide-react-native'
import { fontFamily } from '../../fonts'
import * as Linking from 'expo-linking'
import { Button } from '../ui/Button'

interface ProfilePopupProps {
  visible: boolean
  onClose: () => void
}

export const ProfilePopup: React.FC<ProfilePopupProps> = ({
  visible,
  onClose,
}) => {
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      onClose()
      Linking.openURL(Linking.createURL('/'))
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  if (!user) {
    return null
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 items-center justify-center px-4"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Header */}
          <LinearGradient
            colors={['#FF6B57', '#FFC529']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="relative px-6 pt-8 pb-6"
          >

            {/* Profile Image */}
            <View className="items-center mb-4">
              <View
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-white"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Image
                  source={{
                    uri: user.imageUrl || 'https://via.placeholder.com/96',
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Name */}
            <Text
              style={{
                fontFamily: fontFamily.bold,
                fontSize: 24,
                lineHeight: 32,
              }}
              className="text-white text-center mb-1"
            >
              {user.fullName || user.firstName || 'User'}
            </Text>

            {/* Username */}
            {user.username && (
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: 14,
                  lineHeight: 20,
                }}
                className="text-white/80 text-center"
              >
                @{user.username}
              </Text>
            )}
          </LinearGradient>

          {/* Content */}
          <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
            <View className="px-6 py-4">
              {/* Email */}
              {user.primaryEmailAddress && (
                <View className="flex-row items-center mb-4 pb-4 border-b border-gray-200">
                  <View className="w-10 h-10 rounded-full bg-[#F9F9FA] items-center justify-center mr-3">
                    <Mail size={18} color="#FF6B57" />
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{
                        fontFamily: fontFamily.medium,
                        fontSize: 12,
                        lineHeight: 16,
                      }}
                      className="text-[#7E8392] mb-1"
                    >
                      Email
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 14,
                        lineHeight: 20,
                      }}
                      className="text-[#242731]"
                    >
                      {user.primaryEmailAddress.emailAddress}
                    </Text>
                  </View>
                </View>
              )}

              {/* Account Created */}
              {user.createdAt && (
                <View className="flex-row items-center mb-4">
                  <View className="w-10 h-10 rounded-full bg-[#F9F9FA] items-center justify-center mr-3">
                    <Text className="text-lg">📅</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{
                        fontFamily: fontFamily.medium,
                        fontSize: 12,
                        lineHeight: 16,
                      }}
                      className="text-[#7E8392] mb-1"
                    >
                      Member since
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        fontSize: 14,
                        lineHeight: 20,
                      }}
                      className="text-[#242731]"
                    >
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Sign Out Button */}
          <View className="px-6 py-4 border-t border-gray-200">
            <Button
              onPress={handleSignOut}   
              title="Sign Out"
              variant="danger"
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}