
import routerx from 'express-promise-router';

import xmlControl from '../controllers/generar_xml';


const router=routerx();




router.post('/xml',xmlControl.xml);
router.post('/xmlsinimprimir',xmlControl.xmlsinimprimir);
router.post('/xmlIngreso',xmlControl.xmlingresos);
router.post('/xmlEgreso',xmlControl.xmlegresos);
router.post('/xmlArqueos',xmlControl.xmlArqueos);
router.post('/xmlInventario',xmlControl.xmlinventario);
router.post('/reimpresion',xmlControl.reimprimirFactura);


export default router;