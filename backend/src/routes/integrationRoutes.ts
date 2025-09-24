import { Router } from 'express';

import { authenticate, requireRole } from '../middleware/auth';
import { createWebhook, deleteWebhook, listWebhooks } from '../controllers/integrationController';

const router = Router();

router.use(authenticate);
router.get('/webhooks', listWebhooks);
router.post('/webhooks', requireRole(['owner', 'admin']), createWebhook);
router.delete('/webhooks/:webhookId', requireRole(['owner', 'admin']), deleteWebhook);

export default router;
