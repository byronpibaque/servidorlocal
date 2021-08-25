import routerx from 'express-promise-router';

import ctascobrarcontrol from '../controllers/cuentasCobrarControlador';


const router=routerx();



router.post('/add',ctascobrarcontrol.add);
router.get('/query',ctascobrarcontrol.query);
router.get('/list',ctascobrarcontrol.list);
router.get('/listporfechas',ctascobrarcontrol.listporFechas);
router.get('/listporfechasad',ctascobrarcontrol.listporFechasAdmin);
router.get('/listone',ctascobrarcontrol.listOne);
//router.put('/update',ctascobrarcontrol.update);
//router.delete('/remove',ctascobrarcontrol.remove);
router.put('/activate',ctascobrarcontrol.activate);
router.put('/deactivate',ctascobrarcontrol.deactivate);
router.get('/grafico12Meses',ctascobrarcontrol.grafico12Meses);
router.get('/consultaFechas',ctascobrarcontrol.consultaFechas);


export default router;