import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Truck } from 'lucide-react-native'
import { fontFamily } from '../../fonts'

interface SpecialOffer {
  id: number
  restaurant: string
  rating: number
  price: string
  imageUrl: string
  bgColor: string
}

interface SpecialOfferCardProps {
  offer: SpecialOffer
}

export const SpecialOfferCard = ({ offer }: SpecialOfferCardProps) => {
  return (
    <View
      className="rounded-[15px] overflow-hidden"
      style={{
        width: 256,
        height: 110,
        backgroundColor: offer.bgColor,
        shadowColor: offer.bgColor === '#FF6B57' ? '#FE754C' : '#70D09A',
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 5,
      }}
    >
      <View className="flex-row h-full">
        <View className="flex-1 p-4 justify-between">
          <View className="flex-row items-center gap-1 mb-1">
            <Text
              style={{ fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 12 }}
              className="text-white"
            >
              ⭐
            </Text>
            <Text
              style={{ fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 12 }}
              className="text-white"
            >
              {offer.rating}
            </Text>
          </View>
          <Text
            style={{ fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 24 }}
            className="text-white mb-1"
          >
            {offer.restaurant}
          </Text>
          <View className="flex-row items-center gap-1 mb-2">
            <Truck size={14} color={offer.bgColor === '#FF6B57' ? '#FFB8AE' : '#A7ECBB'} />
            <Text
              style={{ fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 14 }}
              className="text-white"
            >
              Free delivery
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="px-3 py-1 rounded-[15px]"
              style={{
                backgroundColor: offer.bgColor === '#FF6B57' ? '#E54630' : '#51B781',
              }}
            >
              <Text
                style={{ fontFamily: fontFamily.semiBold, fontSize: 10, lineHeight: 15 }}
                className="text-white"
              >
                Buy Now
              </Text>
            </TouchableOpacity>
            <Text
              style={{ fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 14 }}
              className="text-white"
            >
              {offer.price}
            </Text>
          </View>
        </View>
        <View className="w-[116px] h-full">
          <Image
            source={{ uri: offer.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  )
}

