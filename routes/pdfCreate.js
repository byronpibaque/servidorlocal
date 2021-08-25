import routerx from 'express-promise-router';

import pdf from '../controllers/crearPDF';


const router=routerx();



router.post('/pdf',pdf.crear);
// router.get('/query',pdf.query);
// router.get('/list',pdf.list);
// router.put('/update',pdf.update);
// router.delete('/remove',pdf.remove);
// router.put('/activate',pdf.activate);
// router.put('/deactivate',pdf.deactivate);

export default router;