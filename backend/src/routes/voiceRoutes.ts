import { Router } from 'express';
import multer from 'multer';

import { authenticate } from '../middleware/auth';
import { generateTts, listVoices, runPipeline, uploadVoice } from '../controllers/voiceController';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(authenticate);
router.get('/', listVoices);
router.post('/upload', upload.single('sample'), uploadVoice);
router.post('/tts', generateTts);
router.post('/pipeline', runPipeline);

export default router;
