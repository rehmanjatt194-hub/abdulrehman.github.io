import express from 'express';
import { getContent, getContentBySlug, createContent, updateContent, deleteContent } from '../controllers/contentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getContent)
    .post(protect, admin, upload.single('coverImage'), createContent);

router.route('/:slug')
    .get(getContentBySlug);

router.route('/:id')
    .put(protect, admin, upload.single('coverImage'), updateContent)
    .delete(protect, admin, deleteContent);

export default router;
