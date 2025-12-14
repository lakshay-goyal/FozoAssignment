import { Router } from 'express';
import { addToCart, getCart, updateCart, removeFromCart } from '../controllers/cart.controller';

const router = Router();
router.post('/add', addToCart);
router.post('/', getCart);
router.put('/update', updateCart);
router.delete('/remove', removeFromCart);

export default router;

