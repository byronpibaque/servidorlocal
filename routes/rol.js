import routerx from 'express-promise-router';

import rolControl from '../controllers/rolControlador';


const router=routerx();



router.post('/add',rolControl.add);
router.get('/query',rolControl.query);
router.get('/list',rolControl.list);
router.put('/update',rolControl.update);
router.delete('/remove',rolControl.remove);
router.put('/activate',rolControl.activate);
router.put('/deactivate',rolControl.deactivate);

export default router;