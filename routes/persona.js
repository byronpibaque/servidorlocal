import routerx from 'express-promise-router';

import personaControl from '../controllers/personaControlador';


const router=routerx();



router.post('/add',personaControl.add);
router.get('/query',personaControl.query);
router.get('/list',personaControl.list);
router.get('/listCliente',personaControl.listClientes);
router.get('/listProveedor',personaControl.listProveedores);
router.put('/update',personaControl.update);
router.delete('/remove',personaControl.remove);
router.put('/activate',personaControl.activate);
router.put('/deactivate',personaControl.deactivate);

export default router;