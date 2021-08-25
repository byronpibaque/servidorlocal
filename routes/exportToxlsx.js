import routerx from 'express-promise-router';

import xlsxControl from '../controllers/exportToxlsx';


const router=routerx();




router.get('/list',xlsxControl.list);
router.get('/exportarTotal',xlsxControl.exportarTotal);
router.get('/inventarioEx',xlsxControl.listInventario);



export default router;