import { Router } from 'express';
import {
    createAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
} from '../controllers/address.controller';

const router = Router();

router.post('/', createAddress);
router.post('/list', getAddresses);
router.put('/:addressId', updateAddress);
router.delete('/:addressId', deleteAddress);

export default router;