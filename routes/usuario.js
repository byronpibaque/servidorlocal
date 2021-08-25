import routerx from 'express-promise-router';

import usuarioCOntrol from '../controllers/usuarioControlador';


const router=routerx();



router.post('/add',usuarioCOntrol.add);
router.get('/query',usuarioCOntrol.query);
router.get('/list',usuarioCOntrol.list);
router.put('/update',usuarioCOntrol.update);
router.delete('/remove',usuarioCOntrol.remove);
router.put('/activate',usuarioCOntrol.activate);
router.put('/deactivate',usuarioCOntrol.deactivate);
router.post('/login',usuarioCOntrol.login);

export default router;