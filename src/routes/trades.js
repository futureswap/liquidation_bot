import { Router } from 'express';
import * as controller  from '../controllers/trades.controllers.js';


const router = Router();

router.get('/', controller.getTrades);
router.post('/add', controller.setTrades);
router.post('/remove', controller.removeTrades);


export default router;