import express from 'express';
import userRoutes from './routes/user.routes';
import restaurantRoutes from './routes/restaurant.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/restaurants', restaurantRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});