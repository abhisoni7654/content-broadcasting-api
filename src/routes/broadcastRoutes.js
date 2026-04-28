import express from 'express';
import { getLiveBroadcast } from '../controllers/broadcastController.js';

const router = express.Router();

router.get('/live/:teacherId', getLiveBroadcast);

export default router;