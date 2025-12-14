import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import restaurantRoutes from './routes/restaurant.routes';
import cartRoutes from './routes/cart.routes';
import wishlistRoutes from './routes/wishlist.routes';
import addressRoutes from './routes/address.routes';
import locationRoutes from './routes/location.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/addresses', addressRoutes);
app.use('/location', locationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});