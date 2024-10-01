import { Router } from 'express';
import { upload, confirma, listar } from '../controllers/ReadingController';

const router = Router();

router.post('/upload', upload);
router.patch('/confirm', confirma);
router.get('/:customer_code/list', listar);

export default router;
