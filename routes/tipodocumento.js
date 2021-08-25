import routerx from 'express-promise-router';

import tipodocumentoControl from '../controllers/tipodocumentoControlador';


const router=routerx();



router.post('/add',tipodocumentoControl.add);
router.get('/query',tipodocumentoControl.query);
router.get('/list',tipodocumentoControl.list);
router.put('/update',tipodocumentoControl.update);
router.delete('/remove',tipodocumentoControl.remove);
router.put('/activate',tipodocumentoControl.activate);
router.put('/deactivate',tipodocumentoControl.deactivate);

export default router;