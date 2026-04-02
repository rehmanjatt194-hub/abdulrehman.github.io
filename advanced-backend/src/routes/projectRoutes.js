import express from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProjects)
    .post(protect, admin, upload.single('image'), createProject);

router.route('/:id')
    .put(protect, admin, upload.single('image'), updateProject)
    .delete(protect, admin, deleteProject);

export default router;
