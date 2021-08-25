import routerx from 'express-promise-router';

import categoriaRouter from './categoria';
import farmaciaRouter from './farmacia';
import farmaciasRouter from './farmacias';
import ingresosRouter from './ingresos';
import inventarioRouter from './inventario';
import laboratorioRouter from './laboratorio';
import personaRouter from './persona';
import presentacionRouter from './presentacion';
import productosRouter from './productos';
import rolRouter from './rol';
import tipocomprobanteRouter from './tipocomprobante';
import tipodocumentoRouter from './tipodocumento';
import tipopersonaRouter from './tipopersona';
import usuarioRouter from './usuario';
import ventasRouter from './ventas';
import LoginRouter from './login'
import XmlRouter from './xml'
import CtasCobrar from './cuentasporcobrar'
import serverCorreo from './servercorreo'
import pdf from './pdfCreate'
import expor from './exportToxlsx'
import arqueo from './arqueo'
import egreso from './egreso'
import configuracion from './configuracion'



const router=routerx();
router.use('/email',serverCorreo)
router.use('/farmacias',farmaciasRouter);
router.use('/rol',rolRouter);
router.use('/tipodocumento',tipodocumentoRouter);
router.use('/tipopersona',tipopersonaRouter);
router.use('/tipocomprobante',tipocomprobanteRouter);
router.use('/categoria',categoriaRouter);
router.use('/presentacion',presentacionRouter);
router.use('/laboratorio',laboratorioRouter);
router.use('/persona',personaRouter);
router.use('/usuario',usuarioRouter);
router.use('/farmacia',farmaciaRouter);
router.use('/inventario',inventarioRouter);
router.use('/productos',productosRouter);
router.use('/ingresos',ingresosRouter);
router.use('/ventas',ventasRouter);
router.use('/login',LoginRouter);
router.use('/xml',XmlRouter);
router.use('/ctascobrar',CtasCobrar);
router.use('/pdf',pdf)
router.use('/exports',expor)
router.use('/arqueo',arqueo)
router.use('/egreso',egreso)
router.use('/configuracion',configuracion)
export default router;