import routerx from 'express-promise-router';

import farmaciasControl from '../controllers/farmaciasControlador';


const router=routerx();



router.post('/add',farmaciasControl.add);
router.get('/query',farmaciasControl.query);
router.get('/list',farmaciasControl.list);
router.put('/update',farmaciasControl.update);
router.delete('/remove',farmaciasControl.remove);
router.put('/activate',farmaciasControl.activate);
router.put('/deactivate',farmaciasControl.deactivate);

export default router;