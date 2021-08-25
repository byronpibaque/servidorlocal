import routerx from 'express-promise-router';

import arqueoControl from '../controllers/ArqueosController';


const router=routerx();



router.post('/add',arqueoControl.add);
router.get('/query',arqueoControl.query);
router.get('/list',arqueoControl.list);
router.get('/listporfechasad',arqueoControl.listporFechasAdmin);
router.get('/suma',arqueoControl.SumarTotales);
router.get('/existe',arqueoControl.existeRegistro);
router.put('/activate',arqueoControl.activate);
router.put('/deactivate',arqueoControl.deactivate);

export default router;