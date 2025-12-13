import { View, ScrollView } from 'react-native'
import { CategoryItem } from './CategoryItem'

interface Category {
  id: string
  name: string
  icon: string
}

interface CategoryListProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryName: string) => void
}

export const CategoryList = ({ categories, selectedCategory, onCategorySelect }: CategoryListProps) => {
  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.name}
            onPress={() => onCategorySelect(category.name)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

