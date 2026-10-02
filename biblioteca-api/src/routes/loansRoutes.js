import { Router } from 'express';
import * as loansController from '../controllers/loansController.js';

const router = Router();

router.get('/', loansController.listActive);
router.get('/:id', loansController.findOne);
router.post('/', loansController.store);
router.put('/:id', loansController.update);
router.patch('/:id', loansController.patch);
router.delete('/:id', loansController.remove);

export default router;
