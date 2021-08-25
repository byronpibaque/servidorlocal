import routerx from 'express-promise-router';

import ingresosControl from '../controllers/ingresosControlador';


const router=routerx();



router.post('/add',ingresosControl.add);
router.get('/query',ingresosControl.query);
router.get('/list',ingresosControl.list);
router.get('/listtotal',ingresosControl.listtotal); 
router.get('/listporfechas',ingresosControl.listporFechas);
router.get('/listporfechasad',ingresosControl.listporFechasAdmin);
//router.put('/update',ingresosControl.update);
//router.delete('/remove',ingresosControl.remove);
router.put('/activate',ingresosControl.activate);
router.put('/deactivate',ingresosControl.deactivate);
router.get('/grafico12Meses',ingresosControl.grafico12Meses);
router.get('/consultaFechas',ingresosControl.consultaFechas);

export default router;