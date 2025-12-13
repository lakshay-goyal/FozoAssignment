import { View, Text, ScrollView } from 'react-native'
import { fontFamily } from '../../fonts'
import { SpecialOfferCard } from './SpecialOfferCard'

interface SpecialOffer {
  id: number
  restaurant: string
  rating: number
  price: string
  imageUrl: string
  bgColor: string
}

interface SpecialOffersSectionProps {
  offers: SpecialOffer[]
}

export const SpecialOffersSection = ({ offers }: SpecialOffersSectionProps) => {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <Text
          style={{ fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 27 }}
          className="text-[#242731]"
        >
          Special Offers
        </Text>
        <Text
          style={{ fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16 }}
          className="text-[#FF6B57]"
        >
          View All
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {offers.map((offer) => (
          <SpecialOfferCard key={offer.id} offer={offer} />
        ))}
      </ScrollView>
    </View>
  )
}

