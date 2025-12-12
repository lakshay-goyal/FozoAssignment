import { Router } from 'express';
import { getRestaurants } from '../controllers/restaurant.controller';

const router = Router();
router.post('/', getRestaurants);

export default router;