import { Router } from 'express';

import { authenticate } from '../middleware/auth';
import { createProject, deleteProject, listProjects, updateProject } from '../controllers/projectController';

const router = Router();

router.use(authenticate);
router.get('/', listProjects);
router.post('/', createProject);
router.patch('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

export default router;
