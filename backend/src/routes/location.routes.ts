import { Router } from 'express';
import {
    getLocationSuggestions,
    reverseGeocodeLocation,
} from '../controllers/location.controller';

const router = Router();

router.get('/autocomplete', getLocationSuggestions);
router.get('/reverse-geocode', reverseGeocodeLocation);

export default router;