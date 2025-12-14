import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {

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
        imageUrl: 'https://imgs.search.brave.com/M6z_1YeRw0BqFpujy-POa_IzncyqM0hGavwKWrk-Qyw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jb3p5LXJlc3Rh/dXJhbnQtd2l0aC1w/ZW9wbGUtd2FpdGVy/XzE3NTkzNS0yMzAu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MCZxPTgw',
      },
      {
        name: 'Green Bowl',
        description: 'Healthy vegetarian meals and salads',
        tags: ['Healthy', 'Veg', 'Salads'],
        latitude: 28.7041,
        longitude: 77.1025,
        imageUrl: 'https://imgs.search.brave.com/sIEvsBsz3HFLabpIiJ7osXSH3WrcRDszGITX0pHyOWo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/Njc2Njc3NzgyMTEt/YjE5ZjVhNGUxZWZl/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE1UWjhmSEps/YzNSaGRYSmhiblJ6/ZkdWdWZEQjhmREI4/Zkh3dw',
      },
      {
        name: 'Urban Tadka',
        description: 'Modern Indian street food',
        tags: ['Street Food', 'Indian'],
        latitude: 19.0760,
        longitude: 72.8777,
        imageUrl: 'https://imgs.search.brave.com/G7ndQ6mwjCfbUODBMeEBSelpf3OSCJ1tw_mU5PIAAqs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMC53/cC5jb20vdGhlc2Fu/YW50b25pb3RoaW5n/cy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjMvMDgvTmlu/ZXRlZW4tSHlha3Ut/Ni5qcGc_cmVzaXpl/PTIwNDgsMTUzNyZz/c2w9MQ',
      },
      {
        name: 'Pasta Palace',
        description: 'Italian pastas and wood-fired pizzas',
        tags: ['Italian', 'Pasta', 'Pizza'],
        latitude: 12.9716,
        longitude: 77.5946,
        imageUrl: 'https://imgs.search.brave.com/R3r0WHnkaxhHDj35SWL5epqL0Gy_w98DIbL5GGACW0I/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMucGV4ZWxzLmNv/bS9waG90b3MvNzc2/NTM4L3BleGVscy1w/aG90by03NzY1Mzgu/anBlZz9hdXRvPWNv/bXByZXNzJmNzPXRp/bnlzcmdiJmRwcj0x/Jnc9NTAw',
      },
      {
        name: 'Burger Hub',
        description: 'Juicy burgers and crispy fries',
        tags: ['Burgers', 'Fast Food'],
        latitude: 13.0827,
        longitude: 80.2707,
        imageUrl: 'https://imgs.search.brave.com/ikxTbv2BfBV6UrfYt4kE65DFGht63KXIOXV6nnvJH3U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/NTQzMDk0Ni9waG90/by9hYnN0cmFjdC1i/bHVyLWRlZm9jdXMt/Y29mZmVlLXNob3At/Y2FmZS1vci1yZXN0/YXVyYW50LWludGVy/aW9yLWJhY2tncm91/bmQtYmx1cnJlZC1j/YWZlLmpwZz9iPTEm/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9bGpZ/OVNtRHdKMlRrYTVP/WFZHZDcxcHVybjVS/XzhaRGhpVnBpR2Rr/enNWOD0',
      },
      {
        name: 'Sushi Zen',
        description: 'Fresh sushi and Japanese delicacies',
        tags: ['Japanese', 'Sushi'],
        latitude: 22.5726,
        longitude: 88.3639,
        imageUrl: 'https://imgs.search.brave.com/kl5SvKC42OZCtKYD5pos6fSmEFAzV96xAQOKOm-s458/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjcv/MTIxLzE2Ny9zbWFs/bC9tb2Rlcm4tcmVz/dGF1cmFudC1pbnRl/cmlvci1mcmVlLXBo/b3RvLmpwZw',
      },
      {
        name: 'Tandoori Flames',
        description: 'Charcoal grilled tandoori specials',
        tags: ['North Indian', 'Grill'],
        latitude: 26.9124,
        longitude: 75.7873,
        imageUrl: 'https://imgs.search.brave.com/UXtckfYrRJ1lt907S6odWPBYTumZ89Poi4zrCaCJfx0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9yZXNlcnZlZC10/YWJsZS1yZXN0YXVy/YW50XzUzODc2LTIx/OTM4LmpwZz9zZW10/PWFpc19oeWJyaWQm/dz03NDAmcT04MA',
      },
      {
        name: 'Cafe Brew',
        description: 'Coffee, snacks and desserts',
        tags: ['Cafe', 'Coffee', 'Desserts'],
        latitude: 23.0225,
        longitude: 72.5714,
        imageUrl: 'https://imgs.search.brave.com/EmeE7VxzUR9z2mQu2B1Xjgy_ujAiZc3tTnOYqfXYdqw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS50aW1lb3V0LmNv/bS9pbWFnZXMvMTA1/ODQzNTg3Lzc1MC81/NjIvaW1hZ2UuanBn',
      },
      {
        name: 'Dragon Wok',
        description: 'Chinese and Asian fusion cuisine',
        tags: ['Chinese', 'Asian'],
        latitude: 18.5204,
        longitude: 73.8567,
        imageUrl: 'https://imgs.search.brave.com/d4JADVRHqLZ8z08s83uoyL4ux3eF__hqbP2ftx_FmfI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjE2/ODQ0ODM3MS9waG90/by9idXNpbmVzcy1w/cm9mZXNzaW9uYWxz/LWF0LWEtcmVzdGF1/cmFudC1oYXZpbmct/ZGlubmVyLndlYnA_/YT0xJmI9MSZzPTYx/Mng2MTImdz0wJms9/MjAmYz1fY2ZnRG12/SS1iZUFPSW1DZXMt/MXA3RWhGbkVhbGFF/SVlnTUlucmctRVdv/PQ',
      },
      {
        name: 'Coastal Catch',
        description: 'Fresh seafood and coastal flavors',
        tags: ['Seafood', 'Coastal'],
        latitude: 15.2993,
        longitude: 74.1240,
        imageUrl: 'https://imgs.search.brave.com/cEdEHr0uCo7B7uDN7m_KrY96IgNz4MsmL5pvBN_wjIk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS1jZG4udHJpcGFk/dmlzb3IuY29tL21l/ZGlhL3Bob3RvLW8v/MzAvNjAvNWIvZTQv/cmVzdGF1cmFudC5q/cGc',
      },
    ],
  })

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
        imageUrl: 'https://imgs.search.brave.com/e3q5735XR9MZZMyAgs974d42dafOu7zLUTEzYZ9eO7o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9qb3lm/b29kc3Vuc2hpbmUu/Y29tL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzA1L2hvdy10/by1tYWtlLXF1aW5v/YS1zYWxhZC1yZWNp/cGUtMS5qcGc',
        isVeg: true,
      },
      {
        item_name: 'Veg Wrap',
        price: 180,
        restaurantId: allRestaurants[1]!.id,
        description: 'Whole wheat wrap with veggies',
        imageUrl: 'https://imgs.search.brave.com/y_e6Ya64b4mx1LTAjXbzunOpZ0AaCnke7uu3lYLhAsc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTIw/NDE2MzM3NC9waG90/by93cmFwLXNhbmR3/aWNoLXdpdGgtZ3Jp/bGxlZC12ZWdldGFi/bGVzLWFuZC1mZXRh/LWNoZWVzZS1vbi1h/LXBsYXRlLWdyZXkt/YmFja2dyb3VuZC1j/b3B5LXNwYWNlLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1L/X1AxQTVsU281Zzhx/SUtsSFBvYUhKTy1h/VmczcnI5dXh6MG5w/aHRyZUxFPQ',
        isVeg: true,
      },
      {
        item_name: 'Fruit Smoothie',
        price: 150,
        restaurantId: allRestaurants[1]!.id,
        description: 'Fresh seasonal fruits blend',
        imageUrl: 'https://imgs.search.brave.com/hCVMqmcP3BELzgaz6w0hn-e5O0-9ImcyF4kTpi6pX3c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjkv/NTUxLzczNS9zbWFs/bC9zZXQtb2YtZnJ1/aXQtc21vb3RoaWVz/LWhlYWx0aHktZnJ1/aXQtYW5kLXZlZ2V0/YWJsZS1zbW9vdGhp/ZXMtZ2VuZXJhdGl2/ZS1haS1mcmVlLXBo/b3RvLmpwZw',
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

}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

