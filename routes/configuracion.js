import routerx from 'express-promise-router';

import arqueoControl from '../controllers/configuracion';


const router=routerx();



router.get('/obtenerip',arqueoControl.obtenerip);


export default router;