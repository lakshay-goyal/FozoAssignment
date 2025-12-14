import { Router } from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlist.controller';

const router = Router();
router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);
router.post('/', getWishlist);

export default router;

