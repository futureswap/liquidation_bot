import { Router } from 'express';
import * as controller  from '../controllers/trades.controllers.js';


const router = Router();

router.get('/', controller.getTrades);
router.post('/', controller.setTrades);


export default router;