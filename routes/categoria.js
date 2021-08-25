import routerx from 'express-promise-router';

import categoriaControl from '../controllers/categoriaControlador';


const router=routerx();



router.post('/add',categoriaControl.add);
router.get('/query',categoriaControl.query);
router.get('/list',categoriaControl.list);
router.put('/update',categoriaControl.update);
router.delete('/remove',categoriaControl.remove);
router.put('/activate',categoriaControl.activate);
router.put('/deactivate',categoriaControl.deactivate);

export default router;