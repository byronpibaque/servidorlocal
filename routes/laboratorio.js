import routerx from 'express-promise-router';

import laboratorioControl from '../controllers/laboratorioControlador';


const router=routerx();



router.post('/add',laboratorioControl.add);
router.get('/query',laboratorioControl.query);
router.get('/list',laboratorioControl.list);
router.put('/update',laboratorioControl.update);
router.delete('/remove',laboratorioControl.remove);
router.put('/activate',laboratorioControl.activate);
router.put('/deactivate',laboratorioControl.deactivate);

export default router;