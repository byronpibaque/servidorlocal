import routerx from 'express-promise-router';

import LoginControl from '../controllers/LoginControlador';


const router=routerx();



router.post('/add',LoginControl.add);
router.get('/query',LoginControl.query);
router.get('/queryCode',LoginControl.queryCode);
router.get('/list',LoginControl.list);
router.put('/update',LoginControl.update);
router.delete('/remove',LoginControl.remove);
router.put('/activate',LoginControl.activate);
router.put('/deactivate',LoginControl.deactivate);
router.post('/login',LoginControl.login);

export default router;