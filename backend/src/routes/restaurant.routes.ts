import { Router } from 'express';
import { getRestaurants, getRestaurantById } from '../controllers/restaurant.controller';

const router = Router();
router.post('/', getRestaurants);
router.post('/:restaurantId', getRestaurantById);

export default router;