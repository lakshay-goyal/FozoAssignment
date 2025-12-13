import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting seed...')

  // Clear existing data (optional - remove if you want to keep existing data)
  await prisma.menu.deleteMany()
  await prisma.restaurant.deleteMany()

  // Seed Restaurants
  const restaurants = await prisma.restaurant.createMany({
    data: [
      {
        name: 'Spice Route',
        description: 'Authentic Indian cuisine with rich spices',
        tags: ['Indian', 'Spicy', 'Family'],
        latitude: 28.6139,
        longitude: 77.2090,
        imageUrl: 'https://picsum.photos/seed/rest1/400',
      },
      {
        name: 'Green Bowl',
        description: 'Healthy vegetarian meals and salads',
        tags: ['Healthy', 'Veg', 'Salads'],
        latitude: 28.7041,
        longitude: 77.1025,
        imageUrl: 'https://picsum.photos/seed/rest2/400',
      },
      {
        name: 'Urban Tadka',
        description: 'Modern Indian street food',
        tags: ['Street Food', 'Indian'],
        latitude: 19.0760,
        longitude: 72.8777,
        imageUrl: 'https://picsum.photos/seed/rest3/400',
      },
      {
        name: 'Pasta Palace',
        description: 'Italian pastas and wood-fired pizzas',
        tags: ['Italian', 'Pasta', 'Pizza'],
        latitude: 12.9716,
        longitude: 77.5946,
        imageUrl: 'https://picsum.photos/seed/rest4/400',
      },
      {
        name: 'Burger Hub',
        description: 'Juicy burgers and crispy fries',
        tags: ['Burgers', 'Fast Food'],
        latitude: 13.0827,
        longitude: 80.2707,
        imageUrl: 'https://picsum.photos/seed/rest5/400',
      },
      {
        name: 'Sushi Zen',
        description: 'Fresh sushi and Japanese delicacies',
        tags: ['Japanese', 'Sushi'],
        latitude: 22.5726,
        longitude: 88.3639,
        imageUrl: 'https://picsum.photos/seed/rest6/400',
      },
      {
        name: 'Tandoori Flames',
        description: 'Charcoal grilled tandoori specials',
        tags: ['North Indian', 'Grill'],
        latitude: 26.9124,
        longitude: 75.7873,
        imageUrl: 'https://picsum.photos/seed/rest7/400',
      },
      {
        name: 'Cafe Brew',
        description: 'Coffee, snacks and desserts',
        tags: ['Cafe', 'Coffee', 'Desserts'],
        latitude: 23.0225,
        longitude: 72.5714,
        imageUrl: 'https://picsum.photos/seed/rest8/400',
      },
      {
        name: 'Dragon Wok',
        description: 'Chinese and Asian fusion cuisine',
        tags: ['Chinese', 'Asian'],
        latitude: 18.5204,
        longitude: 73.8567,
        imageUrl: 'https://picsum.photos/seed/rest9/400',
      },
      {
        name: 'Coastal Catch',
        description: 'Fresh seafood and coastal flavors',
        tags: ['Seafood', 'Coastal'],
        latitude: 15.2993,
        longitude: 74.1240,
        imageUrl: 'https://picsum.photos/seed/rest10/400',
      },
    ],
  })

  console.log(`Created ${restaurants.count} restaurants`)

  // Get all restaurants to map menu items
  const allRestaurants = await prisma.restaurant.findMany({
    orderBy: { id: 'asc' },
  })

  if (allRestaurants.length !== 10) {
    throw new Error(`Expected 10 restaurants, but found ${allRestaurants.length}`)
  }

  // Seed Menu Items
  const menuItems = await prisma.menu.createMany({
    data: [
      // Restaurant 1 (Spice Route)
      {
        item_name: 'Paneer Butter Masala',
        price: 280,
        restaurantId: allRestaurants[0]!.id,
        description: 'Creamy tomato-based paneer curry',
        imageUrl: 'https://picsum.photos/seed/menu1/300',
        isVeg: true,
      },
      {
        item_name: 'Butter Naan',
        price: 60,
        restaurantId: allRestaurants[0]!.id,
        description: 'Soft buttery naan bread',
        imageUrl: 'https://picsum.photos/seed/menu2/300',
        isVeg: true,
      },
      {
        item_name: 'Chicken Tikka',
        price: 320,
        restaurantId: allRestaurants[0]!.id,
        description: 'Smoky grilled chicken chunks',
        imageUrl: 'https://picsum.photos/seed/menu3/300',
        isVeg: false,
      },
      // Restaurant 2 (Green Bowl)
      {
        item_name: 'Quinoa Salad',
        price: 220,
        restaurantId: allRestaurants[1]!.id,
        description: 'Protein-rich healthy salad',
        imageUrl: 'https://picsum.photos/seed/menu4/300',
        isVeg: true,
      },
      {
        item_name: 'Veg Wrap',
        price: 180,
        restaurantId: allRestaurants[1]!.id,
        description: 'Whole wheat wrap with veggies',
        imageUrl: 'https://picsum.photos/seed/menu5/300',
        isVeg: true,
      },
      {
        item_name: 'Fruit Smoothie',
        price: 150,
        restaurantId: allRestaurants[1]!.id,
        description: 'Fresh seasonal fruits blend',
        imageUrl: 'https://picsum.photos/seed/menu6/300',
        isVeg: true,
      },
      // Restaurant 3 (Urban Tadka)
      {
        item_name: 'Vada Pav',
        price: 80,
        restaurantId: allRestaurants[2]!.id,
        description: 'Mumbai-style street burger',
        imageUrl: 'https://picsum.photos/seed/menu7/300',
        isVeg: true,
      },
      {
        item_name: 'Pav Bhaji',
        price: 160,
        restaurantId: allRestaurants[2]!.id,
        description: 'Spicy mashed veggies with butter pav',
        imageUrl: 'https://picsum.photos/seed/menu8/300',
        isVeg: true,
      },
      {
        item_name: 'Chicken Kathi Roll',
        price: 200,
        restaurantId: allRestaurants[2]!.id,
        description: 'Spicy chicken roll',
        imageUrl: 'https://picsum.photos/seed/menu9/300',
        isVeg: false,
      },
      // Restaurant 4 (Pasta Palace)
      {
        item_name: 'Margherita Pizza',
        price: 300,
        restaurantId: allRestaurants[3]!.id,
        description: 'Classic cheese pizza',
        imageUrl: 'https://picsum.photos/seed/menu10/300',
        isVeg: true,
      },
      {
        item_name: 'Penne Alfredo',
        price: 320,
        restaurantId: allRestaurants[3]!.id,
        description: 'Creamy white sauce pasta',
        imageUrl: 'https://picsum.photos/seed/menu11/300',
        isVeg: true,
      },
      {
        item_name: 'Chicken Lasagna',
        price: 380,
        restaurantId: allRestaurants[3]!.id,
        description: 'Layered pasta with chicken',
        imageUrl: 'https://picsum.photos/seed/menu12/300',
        isVeg: false,
      },
      // Restaurant 5 (Burger Hub)
      {
        item_name: 'Classic Veg Burger',
        price: 150,
        restaurantId: allRestaurants[4]!.id,
        description: 'Veg patty with cheese',
        imageUrl: 'https://picsum.photos/seed/menu13/300',
        isVeg: true,
      },
      {
        item_name: 'Chicken Burger',
        price: 190,
        restaurantId: allRestaurants[4]!.id,
        description: 'Grilled chicken burger',
        imageUrl: 'https://picsum.photos/seed/menu14/300',
        isVeg: false,
      },
      {
        item_name: 'French Fries',
        price: 120,
        restaurantId: allRestaurants[4]!.id,
        description: 'Crispy golden fries',
        imageUrl: 'https://picsum.photos/seed/menu15/300',
        isVeg: true,
      },
      // Restaurant 6 (Sushi Zen)
      {
        item_name: 'Veg Sushi Roll',
        price: 260,
        restaurantId: allRestaurants[5]!.id,
        description: 'Avocado and cucumber sushi',
        imageUrl: 'https://picsum.photos/seed/menu16/300',
        isVeg: true,
      },
      {
        item_name: 'Salmon Sushi',
        price: 420,
        restaurantId: allRestaurants[5]!.id,
        description: 'Fresh salmon slices',
        imageUrl: 'https://picsum.photos/seed/menu17/300',
        isVeg: false,
      },
      {
        item_name: 'Miso Soup',
        price: 140,
        restaurantId: allRestaurants[5]!.id,
        description: 'Traditional Japanese soup',
        imageUrl: 'https://picsum.photos/seed/menu18/300',
        isVeg: true,
      },
      // Restaurant 7 (Tandoori Flames)
      {
        item_name: 'Tandoori Paneer',
        price: 300,
        restaurantId: allRestaurants[6]!.id,
        description: 'Charcoal grilled paneer',
        imageUrl: 'https://picsum.photos/seed/menu19/300',
        isVeg: true,
      },
      {
        item_name: 'Tandoori Chicken',
        price: 360,
        restaurantId: allRestaurants[6]!.id,
        description: 'Spicy grilled chicken',
        imageUrl: 'https://picsum.photos/seed/menu20/300',
        isVeg: false,
      },
      {
        item_name: 'Mint Chutney',
        price: 40,
        restaurantId: allRestaurants[6]!.id,
        description: 'Fresh mint dip',
        imageUrl: 'https://picsum.photos/seed/menu21/300',
        isVeg: true,
      },
      // Restaurant 8 (Cafe Brew)
      {
        item_name: 'Cappuccino',
        price: 140,
        restaurantId: allRestaurants[7]!.id,
        description: 'Hot brewed coffee',
        imageUrl: 'https://picsum.photos/seed/menu22/300',
        isVeg: true,
      },
      {
        item_name: 'Chocolate Brownie',
        price: 180,
        restaurantId: allRestaurants[7]!.id,
        description: 'Rich chocolate dessert',
        imageUrl: 'https://picsum.photos/seed/menu23/300',
        isVeg: true,
      },
      {
        item_name: 'Veg Sandwich',
        price: 160,
        restaurantId: allRestaurants[7]!.id,
        description: 'Grilled veggie sandwich',
        imageUrl: 'https://picsum.photos/seed/menu24/300',
        isVeg: true,
      },
      // Restaurant 9 (Dragon Wok)
      {
        item_name: 'Veg Manchurian',
        price: 220,
        restaurantId: allRestaurants[8]!.id,
        description: 'Fried veg balls in sauce',
        imageUrl: 'https://picsum.photos/seed/menu25/300',
        isVeg: true,
      },
      {
        item_name: 'Chicken Hakka Noodles',
        price: 260,
        restaurantId: allRestaurants[8]!.id,
        description: 'Stir fried noodles',
        imageUrl: 'https://picsum.photos/seed/menu26/300',
        isVeg: false,
      },
      {
        item_name: 'Spring Rolls',
        price: 180,
        restaurantId: allRestaurants[8]!.id,
        description: 'Crispy rolls',
        imageUrl: 'https://picsum.photos/seed/menu27/300',
        isVeg: true,
      },
      // Restaurant 10 (Coastal Catch)
      {
        item_name: 'Fish Curry',
        price: 340,
        restaurantId: allRestaurants[9]!.id,
        description: 'Spicy coastal fish curry',
        imageUrl: 'https://picsum.photos/seed/menu28/300',
        isVeg: false,
      },
      {
        item_name: 'Prawn Fry',
        price: 380,
        restaurantId: allRestaurants[9]!.id,
        description: 'Crispy fried prawns',
        imageUrl: 'https://picsum.photos/seed/menu29/300',
        isVeg: false,
      },
      {
        item_name: 'Steamed Rice',
        price: 120,
        restaurantId: allRestaurants[9]!.id,
        description: 'Plain steamed rice',
        imageUrl: 'https://picsum.photos/seed/menu30/300',
        isVeg: true,
      },
    ],
  })

  console.log(`Created ${menuItems.count} menu items`)
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

