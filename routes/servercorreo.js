import routerx from 'express-promise-router';

import servidorcorreo from '../controllers/servidorcorreo.js';


const router=routerx();



router.post('/email',servidorcorreo.sendEmail);
router.post('/correo',servidorcorreo.enviar);


export default router;