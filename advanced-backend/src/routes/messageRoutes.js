import express from 'express';
import { addMessage, getMessages, deleteMessage, updateMessageStatus } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getMessages)
    .post(addMessage);

router.route('/:id')
    .put(protect, admin, updateMessageStatus)
    .delete(protect, admin, deleteMessage);

export default router;
