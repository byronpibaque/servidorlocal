import routerx from 'express-promise-router';

import ventasControl from '../controllers/ventasControlador';


const router=routerx();



router.post('/add',ventasControl.add);
router.get('/query',ventasControl.query);
router.get('/list',ventasControl.list);
router.get('/listF',ventasControl.listFecha);
router.get('/listone',ventasControl.listOne);
router.get('/listoneF',ventasControl.listOneF);
router.put('/update',ventasControl.update);
//router.delete('/remove',ventasControl.remove);
router.put('/activate',ventasControl.activate);
router.put('/deactivate',ventasControl.deactivate);
router.get('/grafico12Meses',ventasControl.grafico12Meses);
router.get('/consultaFechas',ventasControl.consultaFechas);
router.get('/contarventas',ventasControl.contarVentas); 

export default router;