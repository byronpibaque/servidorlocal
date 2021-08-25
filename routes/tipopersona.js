import routerx from 'express-promise-router';

import tipopersonaControl from '../controllers/tipopersonaControlador';


const router=routerx();



router.post('/add',tipopersonaControl.add);
router.get('/query',tipopersonaControl.query);
router.get('/list',tipopersonaControl.list);
router.put('/update',tipopersonaControl.update);
router.delete('/remove',tipopersonaControl.remove);
router.put('/activate',tipopersonaControl.activate);
router.put('/deactivate',tipopersonaControl.deactivate);

export default router;