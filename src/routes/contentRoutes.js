import express from 'express';
import {
    uploadContent,
    getPending,
    reviewContent
} from '../controllers/contentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Teacher: upload content
router.post(
    '/upload',
    protect,
    authorize('teacher'),
    upload.single('file'),
    uploadContent
);

// Principal: view pending content
router.get(
    '/pending',
    protect,
    authorize('principal'),
    getPending
);

// Principal: approve or reject content
router.patch(
    '/:id/review',
    protect,
    authorize('principal'),
    reviewContent
);

export default router;