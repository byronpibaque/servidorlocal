import routerx from 'express-promise-router';

import productosControl from '../controllers/productosControl';


const router=routerx();



router.post('/add',productosControl.add);
router.get('/query',productosControl.query);
router.get('/queryA',productosControl.queryA);
router.get('/queryB',productosControl.queryB);
router.get('/list',productosControl.list);
router.get('/listB',productosControl.listB);
router.get('/listtotal',productosControl.listtotalProductos); 
router.put('/update',productosControl.update);
router.delete('/remove',productosControl.remove);
router.put('/activate',productosControl.activate);
router.put('/deactivate',productosControl.deactivate);

export default router;