import routerx from 'express-promise-router';

import inventarioControl from '../controllers/inventarioControlador';


const router=routerx();



router.post('/add',inventarioControl.add);
router.get('/query',inventarioControl.query);
router.get('/queryinv',inventarioControl.queryInv);
router.get('/list',inventarioControl.list);
router.put('/update',inventarioControl.update);
router.delete('/remove',inventarioControl.remove);
router.put('/activate',inventarioControl.activate);
router.put('/deactivate',inventarioControl.deactivate);

export default router;