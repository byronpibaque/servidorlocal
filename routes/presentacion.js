import routerx from 'express-promise-router';

import presentacionControl from '../controllers/presentacionControlador';


const router=routerx();



router.post('/add',presentacionControl.add);
router.get('/query',presentacionControl.query);
router.get('/list',presentacionControl.list);
router.put('/update',presentacionControl.update);
router.delete('/remove',presentacionControl.remove);
router.put('/activate',presentacionControl.activate);
router.put('/deactivate',presentacionControl.deactivate);

export default router;