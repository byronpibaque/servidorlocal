import routerx from 'express-promise-router';

import tipocomprobanteControl from '../controllers/tipocomprobanteControlador';


const router=routerx();



router.post('/add',tipocomprobanteControl.add);
router.get('/query',tipocomprobanteControl.query);
router.get('/list',tipocomprobanteControl.list);
router.put('/update',tipocomprobanteControl.update);
router.delete('/remove',tipocomprobanteControl.remove);
router.put('/activate',tipocomprobanteControl.activate);
router.put('/deactivate',tipocomprobanteControl.deactivate);

export default router;