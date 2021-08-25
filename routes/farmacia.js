import routerx from 'express-promise-router';

import farmaciaControl from '../controllers/farmaciaControlador';


const router=routerx();



router.post('/add',farmaciaControl.add);
router.get('/query',farmaciaControl.query);
router.get('/list',farmaciaControl.list);
router.put('/update',farmaciaControl.update);
router.delete('/remove',farmaciaControl.remove);
router.put('/activate',farmaciaControl.activate);
router.put('/deactivate',farmaciaControl.deactivate);

export default router;