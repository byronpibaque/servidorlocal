import routerx from 'express-promise-router';

import egresoControl from '../controllers/egresoControlador';


const router=routerx();



router.post('/add',egresoControl.emitir);
router.get('/query',egresoControl.query);
router.get('/list',egresoControl.list);
router.get('/listporfechas',egresoControl.listporFechas);
router.get('/listporfechasad',egresoControl.listporFechasAdmin);
router.get('/listF',egresoControl.listFecha);
router.get('/listone',egresoControl.listOne);
router.get('/listoneF',egresoControl.listOneF);
//router.put('/update',egresoControl.update);
//router.delete('/remove',egresoControl.remove);
router.put('/activate',egresoControl.activate);
router.put('/deactivate',egresoControl.deactivate);
//router.get('/grafico12Meses',egresoControl.grafico12Meses);
//router.get('/consultaFechas',egresoControl.consultaFechas);
router.get('/contarventas',egresoControl.contarVentas); 

export default router;