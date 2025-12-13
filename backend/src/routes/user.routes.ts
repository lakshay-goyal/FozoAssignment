import { Router } from 'express';
import { createUser, getUserByUsername } from '../controllers/user.controller';

const router = Router();
router.post('/', createUser);
router.get('/:username', getUserByUsername);

export default router;