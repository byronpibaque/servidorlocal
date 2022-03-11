
import moment from 'moment'



var fs = require('fs');

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var codDoc = {
    'factura': 1,
    'comprobanteRetencion': 7,
    'guiaRemision': 6,
    'notaCredito': 4,
    'notaDebito': 5,
};


function p_calcular_digito_modulo11(numero) {
    var digito_calculado = -1;

    if (typeof (numero) == 'string' && /^\d+$/.test(numero)) {

        var digitos = numero.split('').map(Number); //arreglo con los dígitos del número

        digito_calculado = 11 - digitos.reduce(function (valorPrevio, valorActual, indice) {
            return valorPrevio + (valorActual * (7 - indice % 6));
        }, 0) % 11;

        digito_calculado = (digito_calculado == 11) ? 0 : digito_calculado; //según ficha técnica
        digito_calculado = (digito_calculado == 10) ? 1 : digito_calculado; //según ficha técnica
    }
    return digito_calculado;
}


var p_obtener_secuencial = (function (tipo_comprobante) {

    function getRandomInt() {
        return Math.floor(Math.random() * (10000)) + 1;
    }

    tipo_comprobante = tipo_comprobante || 0;

    var secuencial = {
        0: 1,
        1: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1
    };
    return function () {
        return secuencial[tipo_comprobante]++;
        //return getRandomInt();
    }
})();


function p_obtener_codigo_autorizacion_desde_comprobante(comprobante) {
    var tipoComprobante = Object.keys(comprobante)[0];

    var codigoAutorizacion = p_obtener_codigo_autorizacion(
        moment(comprobante[tipoComprobante].infoFactura.fechaEmision, 'DD/MM/YYYY'), //fechaEmision
        tipoComprobante,//tipoComprobante
        comprobante[tipoComprobante].infoTributaria.ruc,//ruc
        comprobante[tipoComprobante].infoTributaria.ambiente,//ambiente
        comprobante[tipoComprobante].infoTributaria.estab,//estab
        comprobante[tipoComprobante].infoTributaria.ptoEmi,//ptoEmi
        comprobante[tipoComprobante].infoTributaria.secuencial,//secuencial
        null,//codigo
        comprobante[tipoComprobante].infoTributaria.tipoEmision//tipoEmision
    );

    return codigoAutorizacion;
}

function p_obtener_codigo_autorizacion(fechaEmision, tipoComprobante, ruc, ambiente, estab, ptoEmi, secuencial, codigo, tipoEmision) {
    fechaEmision = fechaEmision || new Date();
    tipoComprobante = tipoComprobante || 'factura'; //1 factura, 4 nota de crédito, 5 nota de débito, 6 guía de remisión, 7 retención
    ruc = ruc || '9999999999999';
    ambiente = ambiente || 1; // 1 pruebas, 2 produccion

    //serie = serie || 0;
    estab = estab || 1;
    ptoEmi = ptoEmi || 1;


    secuencial = secuencial || p_obtener_secuencial(tipoComprobante);
    codigo = codigo || (moment(fechaEmision).format('DDMM') + pad(secuencial, 4).slice(-3) + p_calcular_digito_modulo11(moment(fechaEmision).format('DDMM') + pad(secuencial, 3).slice(-3)));
    tipoEmision = tipoEmision || 1; //1 emision normal

    var codigo_autorizacion = moment(fechaEmision).format('DDMMYYYY')
        + pad(codDoc[tipoComprobante], 2)
        + pad(ruc, 13)
        + pad(ambiente, 1)
        + pad(estab, 3) + pad(ptoEmi, 3)
        + pad(secuencial, 9)
        + pad(codigo, 8)
        + pad(tipoEmision, 1);

    var digito_calculado = p_calcular_digito_modulo11(codigo_autorizacion);

    if (digito_calculado > -1) {
        return codigo_autorizacion + digito_calculado;
    }
}


export default {

    xml: async (req, res, next) => {
        let detalle = req.body.detalles.detalle;
        let pago = req.body.infoFactura.pagos.pago;
        var builder = require('xmlbuilder');
        var estructuraFactura = {
            factura: {
                '@id': 'comprobante',
                '@version': "1.0.0",
                infoTributaria: {
                    ambiente: null,
                    tipoEmision: null,
                    razonSocial: null,
                    nombreComercial: null,
                    ruc: null,
                    claveAcceso: null,
                    codDoc: null,
                    estab: null,
                    ptoEmi: null,
                    secuencial: null,
                    dirMatriz: null,
                    contribuyenteRimpe:null,
                },
                infoFactura: {
                    fechaEmision: null,
                    dirEstablecimiento: null,
                    contribuyenteEspecial: null,
                    obligadoContabilidad: null,
                    tipoIdentificacionComprador: null,
                    guiaRemision: null,
                    razonSocialComprador: null,
                    identificacionComprador: null,
                    direccionComprador: null,
                    totalSinImpuestos: null,
                    totalDescuento: null,
                    totalConImpuestos: {
                        totalImpuesto: [
                            {
                               
                                codigo: null,
                                codigoPorcentaje: null,
                                baseImponible: null,
                                tarifa:null,
                                valor: null,
                            }
                        ]
                    },
                    propina: null,
                    importeTotal: null,
                    moneda: null,
                    pagos:{
                        pago
                    }
                },
                detalles: {
                    detalle
                }
                ,
                infoAdicional: {
                    campoAdicional: [
                        { '@nombre': "Email", '#text': req.body.emailCli },
                        { '@nombre': "Dirección", '#text': req.body.dirCli },
                        { '@nombre': "Teléfono", '#text': req.body.telfCli }
                    ]
                }
            }
        };
        var tipoComprobante = 'factura';
        //      INFORMACION TRIBUTARIA
        estructuraFactura[tipoComprobante].infoTributaria.ambiente = 2; //1 pruebas, 2 produccion
        estructuraFactura[tipoComprobante].infoTributaria.tipoEmision = 1; //1 emision normal
        estructuraFactura[tipoComprobante].infoTributaria.razonSocial = req.body.infoTributaria.razonSocial;
        estructuraFactura[tipoComprobante].infoTributaria.nombreComercial = req.body.infoTributaria.nombreComercial;
        estructuraFactura[tipoComprobante].infoTributaria.ruc = req.body.infoTributaria.ruc;
        estructuraFactura[tipoComprobante].infoTributaria.claveAcceso = ''; //se lo llena más abajo
        estructuraFactura[tipoComprobante].infoTributaria.codDoc = pad(codDoc[tipoComprobante], 2); //tipo de comprobante
        estructuraFactura[tipoComprobante].infoTributaria.estab = pad(req.body.infoTributaria.estab, 3);
        estructuraFactura[tipoComprobante].infoTributaria.ptoEmi = pad(req.body.infoTributaria.ptoEmi, 3);
        estructuraFactura[tipoComprobante].infoTributaria.secuencial = req.body.infoTributaria.secuencial;
        estructuraFactura[tipoComprobante].infoTributaria.dirMatriz = req.body.infoTributaria.dirMatriz;
        estructuraFactura[tipoComprobante].infoTributaria.contribuyenteRimpe = "CONTRIBUYENTE RÉGIMEN RIMPE";
        //      INFORMACION DE FACTURA
        estructuraFactura[tipoComprobante].infoFactura.fechaEmision = moment().format('DD/MM/YYYY');
        estructuraFactura[tipoComprobante].infoFactura.dirEstablecimiento = req.body.infoFactura.dirEstablecimiento;
        // estructuraFactura[tipoComprobante].infoFactura.contribuyenteEspecial = '5368';
        estructuraFactura[tipoComprobante].infoFactura.obligadoContabilidad = 'SI';
        estructuraFactura[tipoComprobante].infoFactura.tipoIdentificacionComprador = pad(req.body.infoFactura.tipoIdentificacionComprador, 2);
        // estructuraFactura[tipoComprobante].infoFactura.guiaRemision = '001-001-000000001';
        estructuraFactura[tipoComprobante].infoFactura.razonSocialComprador = req.body.infoFactura.razonSocialComprador;
        estructuraFactura[tipoComprobante].infoFactura.identificacionComprador = req.body.infoFactura.identificacionComprador;
        estructuraFactura[tipoComprobante].infoFactura.direccionComprador = req.body.infoFactura.direccionComprador;
        estructuraFactura[tipoComprobante].infoFactura.totalSinImpuestos = req.body.infoFactura.totalSinImpuestos;
        estructuraFactura[tipoComprobante].infoFactura.totalDescuento = parseFloat(req.body.infoFactura.totalDescuento).toFixed(2);
        //      INFORMACION DE FACTRUA TOTAL CON IMPUESTO
        
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].codigo = req.body.infoFactura.totalConImpuestos.totalImpuesto.codigo;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].codigoPorcentaje = req.body.infoFactura.totalConImpuestos.totalImpuesto.codigoPorcentaje;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].baseImponible = req.body.infoFactura.totalConImpuestos.totalImpuesto.baseImponible;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].tarifa = req.body.infoFactura.totalConImpuestos.totalImpuesto.tarifa;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].valor = req.body.infoFactura.totalConImpuestos.totalImpuesto.valor;
        //      INFORMACION DE FACTURA
        estructuraFactura[tipoComprobante].infoFactura.propina = req.body.infoFactura.propina;
        estructuraFactura[tipoComprobante].infoFactura.importeTotal = req.body.infoFactura.importeTotal;
        estructuraFactura[tipoComprobante].infoFactura.moneda = 'DOLAR';
        
        estructuraFactura[tipoComprobante].infoTributaria.claveAcceso = p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura);
        
        
        var xml = builder
            .create(estructuraFactura)
            .dec('1.0', 'UTF-8',{standalone:true})
            .end({ pretty: true });

        var path = require("path")
        var fullpath = path.resolve("./archivos")
        const ruta = fullpath+"\\sri\\Generados\\"+p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura)+'.xml';
        var clave=p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura);
        var numcomprobante=pad(req.body.infoTributaria.estab, 3)+'-'+pad(req.body.infoTributaria.ptoEmi, 3)+'-'+req.body.infoTributaria.secuencial;
       
        let rutafirma=""
         if(req.body.infoTributaria.razonSocial=="MORALES VARAS NELSON GUILLERMO"){
           rutafirma =fullpath+"\\sri\\Firma\\nelson_guillermo_morales_varas.p12";
         }else if(req.body.infoTributaria.razonSocial=="MORALES VARAS DIEGO ARMANDO"){
            rutafirma =fullpath+"\\sri\\Firma\\diego_armando_morales_varas.p12";
         }else if(req.body.infoTributaria.razonSocial=="ROMERO MONTALVAN ANTONIA VANESSA"){
             rutafirma =fullpath+"\\sri\\Firma\\vanessa_antonia_romero_montalvan.p12";
         }else if(req.body.infoTributaria.razonSocial=="COMERCIALIZADORA VANEROMO S.A"){
            rutafirma =fullpath+"\\sri\\Firma\\COMERCIALIZADORA VANEROMO S.A.p12";
         }
       
        
       const rutaauto=fullpath+"\\sri\\Autorizados\\";
       const rutadevu =fullpath+"\\sri\\Devueltos\\";
        
        var child = require('child_process').execFile;
        var executablePath = fullpath+"\\sri\\xadesBes\\Firma_Autorizacion.exe";
        var parameters = [
            ruta,
            rutafirma,
            rutadevu,
            rutaauto];
        var rutaFacturero = fullpath+"\\sri\\Facturera\\AC_facturero.exe";
        var farmacia = req.body.farmacia;
        farmacia.replace(/ /g, "");
        var usuario = req.body.usuario;
        var comprador = req.body.infoFactura.razonSocialComprador;
        comprador.replace(/ /g, "");

        var paramFacturero = [
            farmacia,
            numcomprobante,
            usuario,
            comprador,
            req.body.infoFactura.identificacionComprador,
            req.body.fpago,
            req.body.dinero,
            req.body.cambio,
            clave,
            ruta,
            req.body.infoTributaria.razonSocial,
            req.body.infoTributaria.ruc
        ];
        fs.appendFile(ruta , xml, (err) => {
                if (err)
                throw err;    
                
                child(rutaFacturero, paramFacturero, function(err, data) {

                    if(err){
                        console.log(err)
                        res.status(500).json(2)    
                    }else{
                        child(executablePath, parameters, function(err, data) {
                   
                            if(err){
                                console.log(err)
                                res.status(500).json(2)   
                            }else{
                                console.log("CORRECTO!: "+data);
                                res.status(200).json([clave,numcomprobante,ruta]);
                            }
                         });    
                    }
                });  
            })
        },
    xmlsinimprimir: async (req, res, next) => {
        let detalle = req.body.detalles.detalle;
        let pago = req.body.infoFactura.pagos.pago;
        var builder = require('xmlbuilder');
        var estructuraFactura = {
            factura: {
                '@id': 'comprobante',
                '@version': "1.0.0",
                infoTributaria: {
                    ambiente: null,
                    tipoEmision: null,
                    razonSocial: null,
                    nombreComercial: null,
                    ruc: null,
                    claveAcceso: null,
                    codDoc: null,
                    estab: null,
                    ptoEmi: null,
                    secuencial: null,
                    dirMatriz: null,
                    contribuyenteRimpe:null,
                },
                infoFactura: {
                    fechaEmision: null,
                    dirEstablecimiento: null,
                    contribuyenteEspecial: null,
                    obligadoContabilidad: null,
                    tipoIdentificacionComprador: null,
                    guiaRemision: null,
                    razonSocialComprador: null,
                    identificacionComprador: null,
                    direccionComprador: null,
                    totalSinImpuestos: null,
                    totalDescuento: null,
                    totalConImpuestos: {
                        totalImpuesto: [
                            {
                               
                                codigo: null,
                                codigoPorcentaje: null,
                                baseImponible: null,
                                tarifa:null,
                                valor: null,
                            }
                        ]
                    },
                    propina: null,
                    importeTotal: null,
                    moneda: null,
                    pagos:{
                        pago
                    }
                },
                detalles: {
                    detalle
                }
                ,
                infoAdicional: {
                    campoAdicional: [
                        { '@nombre': "Email", '#text': req.body.emailCli },
                        { '@nombre': "Dirección", '#text': req.body.dirCli },
                        { '@nombre': "Teléfono", '#text': req.body.telfCli }
                    ]
                }
            }
        };
        var tipoComprobante = 'factura';
        //      INFORMACION TRIBUTARIA
        estructuraFactura[tipoComprobante].infoTributaria.ambiente = 2; //1 pruebas, 2 produccion
        estructuraFactura[tipoComprobante].infoTributaria.tipoEmision = 1; //1 emision normal
        estructuraFactura[tipoComprobante].infoTributaria.razonSocial = req.body.infoTributaria.razonSocial;
        estructuraFactura[tipoComprobante].infoTributaria.nombreComercial = req.body.infoTributaria.nombreComercial;
        estructuraFactura[tipoComprobante].infoTributaria.ruc = req.body.infoTributaria.ruc;
        estructuraFactura[tipoComprobante].infoTributaria.claveAcceso = ''; //se lo llena más abajo
        estructuraFactura[tipoComprobante].infoTributaria.codDoc = pad(codDoc[tipoComprobante], 2); //tipo de comprobante
        estructuraFactura[tipoComprobante].infoTributaria.estab = pad(req.body.infoTributaria.estab, 3);
        estructuraFactura[tipoComprobante].infoTributaria.ptoEmi = pad(req.body.infoTributaria.ptoEmi, 3);
        estructuraFactura[tipoComprobante].infoTributaria.secuencial = req.body.infoTributaria.secuencial;
        estructuraFactura[tipoComprobante].infoTributaria.dirMatriz = req.body.infoTributaria.dirMatriz;
        estructuraFactura[tipoComprobante].infoTributaria.contribuyenteRimpe = "CONTRIBUYENTE RÉGIMEN RIMPE";
        //      INFORMACION DE FACTURA
        estructuraFactura[tipoComprobante].infoFactura.fechaEmision = moment().format('DD/MM/YYYY');
        estructuraFactura[tipoComprobante].infoFactura.dirEstablecimiento = req.body.infoFactura.dirEstablecimiento;
        // estructuraFactura[tipoComprobante].infoFactura.contribuyenteEspecial = '5368';
        estructuraFactura[tipoComprobante].infoFactura.obligadoContabilidad = 'SI';
        estructuraFactura[tipoComprobante].infoFactura.tipoIdentificacionComprador = pad(req.body.infoFactura.tipoIdentificacionComprador, 2);
        // estructuraFactura[tipoComprobante].infoFactura.guiaRemision = '001-001-000000001';
        estructuraFactura[tipoComprobante].infoFactura.razonSocialComprador = req.body.infoFactura.razonSocialComprador;
        estructuraFactura[tipoComprobante].infoFactura.identificacionComprador = req.body.infoFactura.identificacionComprador;
        estructuraFactura[tipoComprobante].infoFactura.direccionComprador = req.body.infoFactura.direccionComprador;
        estructuraFactura[tipoComprobante].infoFactura.totalSinImpuestos = req.body.infoFactura.totalSinImpuestos;
        estructuraFactura[tipoComprobante].infoFactura.totalDescuento = parseFloat(req.body.infoFactura.totalDescuento).toFixed(2);
        //      INFORMACION DE FACTRUA TOTAL CON IMPUESTO
        
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].codigo = req.body.infoFactura.totalConImpuestos.totalImpuesto.codigo;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].codigoPorcentaje = req.body.infoFactura.totalConImpuestos.totalImpuesto.codigoPorcentaje;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].baseImponible = req.body.infoFactura.totalConImpuestos.totalImpuesto.baseImponible;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].tarifa = req.body.infoFactura.totalConImpuestos.totalImpuesto.tarifa;
        estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].valor = req.body.infoFactura.totalConImpuestos.totalImpuesto.valor;
        //      INFORMACION DE FACTURA
        estructuraFactura[tipoComprobante].infoFactura.propina = req.body.infoFactura.propina;
        estructuraFactura[tipoComprobante].infoFactura.importeTotal = req.body.infoFactura.importeTotal;
        estructuraFactura[tipoComprobante].infoFactura.moneda = 'DOLAR';
        
        estructuraFactura[tipoComprobante].infoTributaria.claveAcceso = p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura);
        
        
        var xml = builder
            .create(estructuraFactura)
            .dec('1.0', 'UTF-8',{standalone:true})
            .end({ pretty: true });

        var path = require("path")
        var fullpath = path.resolve("./archivos")
        const ruta = fullpath+"\\sri\\Generados\\"+p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura)+'.xml';
        var clave=p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura);
        var numcomprobante=pad(req.body.infoTributaria.estab, 3)+'-'+pad(req.body.infoTributaria.ptoEmi, 3)+'-'+req.body.infoTributaria.secuencial;
       
        let rutafirma=""
         if(req.body.infoTributaria.razonSocial=="MORALES VARAS NELSON GUILLERMO"){
           rutafirma =fullpath+"\\sri\\Firma\\nelson_guillermo_morales_varas.p12";
         }else if(req.body.infoTributaria.razonSocial=="MORALES VARAS DIEGO ARMANDO"){
            rutafirma =fullpath+"\\sri\\Firma\\diego_armando_morales_varas.p12";
         }else if(req.body.infoTributaria.razonSocial=="ROMERO MONTALVAN ANTONIA VANESSA"){
             rutafirma =fullpath+"\\sri\\Firma\\vanessa_antonia_romero_montalvan.p12";
         }else if(req.body.infoTributaria.razonSocial=="COMERCIALIZADORA VANEROMO S.A"){
            rutafirma =fullpath+"\\sri\\Firma\\COMERCIALIZADORA VANEROMO S.A.p12";
         }
       
        
       const rutaauto=fullpath+"\\sri\\Autorizados\\";
       const rutadevu =fullpath+"\\sri\\Devueltos\\";
        
        var child = require('child_process').execFile;
        var executablePath = fullpath+"\\sri\\xadesBes\\Firma_Autorizacion.exe";
        var parameters = [
            ruta,
            rutafirma,
            rutadevu,
            rutaauto];

        var rutaFacturero = fullpath+"\\sri\\Facturera\\AC_facturero.exe";
        var farmacia = req.body.farmacia;
        farmacia.replace(/ /g, "");
        var usuario = req.body.usuario;
        var comprador = req.body.infoFactura.razonSocialComprador;
        comprador.replace(/ /g, "");

        var paramFacturero = [
            farmacia,
            numcomprobante,
            usuario,
            comprador,
            req.body.infoFactura.identificacionComprador,
            req.body.fpago,
            req.body.dinero,
            req.body.cambio,
            clave,
            ruta,
            req.body.infoTributaria.razonSocial,
            req.body.infoTributaria.ruc
        ];

        fs.appendFile(ruta , xml, (err) => {
            if (err)
            throw err;    
            
                    child(executablePath, parameters, function(err, data) {
               
                        if(err){
                            console.log(err)
                            res.status(500).json(2)   
                        }else{
                            console.log("CORRECTO!: "+data);
                            res.status(200).json([clave,numcomprobante,ruta]);
                        }
                     });    
                
             
        }) 
       
        },
    xmlegresos:async(req,res,next)=>{
        try {
            var builder = require('xmlbuilder');
            var detalle = req.body.detalles.detalle
            var estructuraXml = {
                egreso: {
                    '@id': 'comprobante',
                    '@version': "1.0.0",
                    encabezado:{
                        farmaciaEmite:null,
                        farmaciaRecibe:null,
                        usuario:null,
                        descripcion:null,
                        numComprobante:null,
                        total:null
                    },
                    detalles:{
                        detalle
                    }
                }
            }
          var tipoComprobante = "egreso"

          estructuraXml[tipoComprobante].encabezado.farmaciaEmite = req.body.egreso.farmaciaEmite;
          estructuraXml[tipoComprobante].encabezado.farmaciaRecibe = req.body.egreso.farmaciaRecibe;
          estructuraXml[tipoComprobante].encabezado.usuario = req.body.egreso.usuario;
          estructuraXml[tipoComprobante].encabezado.descripcion = req.body.egreso.descripcion;
          estructuraXml[tipoComprobante].encabezado.numComprobante = req.body.egreso.numeroComprobante;
          estructuraXml[tipoComprobante].encabezado.total = req.body.egreso.total;
           
          var xml = builder
            .create(estructuraXml)
            .dec('1.0', 'UTF-8',{standalone:true})
            .end({ pretty: true });
           
            var path = require("path")
            var fullpath = path.resolve("./archivos")

            let aleatorio = Math.floor(Math.random() * (10000)) + 1
            const ruta = fullpath+"\\egresos\\"+moment().format('YYYYYMMDD')+aleatorio+"-EGr"+req.body.egreso.numeroComprobante+'.xml';

            var child = require('child_process').execFile;
            var paramFacturero = [
                ruta 
            ];
            var rutaFacturero = fullpath+"\\egresos\\impresora\\AC_facturero.exe";
            fs.appendFile(ruta , xml, (err) => {
                if(err){
                    console.log(err);
                    res.status(500).json("Ocurrio un error..") 
                }else{
                    child(rutaFacturero, paramFacturero, function(err, data) {
                    
                        if(err){
                            console.log(err)
                            res.status(500).json("Error!")    
                        }else{
                              res.status(200).json("ok");
                                
                        }
                    }); 
                }
                
            })
        } catch (error) {
            console.log(error);
            res.status(500).json("Hubo algun error..")   
        }
    },
    xmlinventario:async(req,res,next)=>{
        try {
            var builder = require('xmlbuilder');
            var detalle = req.body.detalles.detalle
            var estructuraXml = {
                inventario: {
                    '@id': 'comprobante',
                    '@version': "1.0.0",
                    encabezado:{
                       
                      
                        usuario:null,
                   
                       
                    },
                    detalles:{
                        detalle
                    }
                }
            }
          var tipoComprobante = "inventario"

          
          estructuraXml[tipoComprobante].encabezado.usuario = req.body.inventario.usuario;
         
          
            var user =  req.body.inventario.usuario;
          var xml = builder
            .create(estructuraXml)
            .dec('1.0', 'UTF-8',{standalone:true})
            .end({ pretty: true });
           
            var path = require("path")
            var fullpath = path.resolve("./archivos")

            let aleatorio = Math.floor(Math.random() * (10000)) + 1
            const ruta = fullpath+"\\inventario\\"+moment().format('YYYYYMMDD')+aleatorio+'.xml';

            var child = require('child_process').execFile;
            var paramFacturero = [
                ruta ,
                user
            ];
            var rutaFacturero = fullpath+"\\inventario\\impresora\\AC_facturero.exe";
            fs.appendFile(ruta , xml, (err) => {
                if(err){
                    console.log(err);
                    res.status(500).json("Ocurrio un error..") 
                }else{
                    child(rutaFacturero, paramFacturero, function(err, data) {
                    
                        if(err){
                            console.log(err)
                            res.status(500).json("Error!")    
                        }else{
                              res.status(200).json("ok");
                                
                        }
                    }); 
                }
                
            })
        } catch (error) {
            console.log(error);
            res.status(500).json("Hubo algun error..")   
        }
    },
    reimprimirFactura:async(req,res,next)=>{
        var path = require("path")
        var fullpath = path.resolve("./archivos")
        const ruta = fullpath+"\\sri\\Generados\\"+req.body.claveAcceso+'.xml';
      //  const ruta = fullpath+"\\sri\\Generados\\"+'2201202101120402025700120020010000000672201067811.xml';
        var numcomprobante = req.body.numComprobante;
        var child = require('child_process').execFile;
        var rutaFacturero = fullpath+"\\sri\\Reimpresion\\AC_facturero.exe";
        var farmacia = req.body.farmacia;
        farmacia.replace(/ /g, "");
        var usuario = req.body.usuario;
        var comprador = req.body.comprador;
        comprador.replace(/ /g, "");

        var paramFacturero = [
            farmacia,
            numcomprobante,
            usuario,
            comprador,
            req.body.identificacionComprador,
            req.body.fpago,
            0,
            0,
            req.body.claveAcceso,
            ruta,
            req.body.fecha,
            req.body.hora
        ];
         
        if(fs.existsSync(ruta)){
            child(rutaFacturero, paramFacturero, function(err, data) {
                if(err){
                    console.log(err);
                    res.status(500).json(2);
                }
                else{
                    console.log(data);
                    res.status(200).send("Archivo impreso!");
                }
                    });
           
            }else{
                res.status(500).send("El archivo no existe!")   
            }
    },
    xmlArqueos:async(req,res,next)=>{
        try {
            var builder = require('xmlbuilder');
            var detalle = req.body.detalles.detalle
            var estructuraXml = {
                arqueo: {
                    '@id': 'comprobante',
                    '@version': "1.0.0",
                    encabezado:{
                        farmaciaEmite:null,
                        usuario:null,
                        totalSistema:null,
                        totalCaja:null,
                        positivos:null,
                        negativos:null
                        
                    },
                    desgloce:{
                        detalle
                    }
                }
            }
          var tipoComprobante = "arqueo"

          estructuraXml[tipoComprobante].encabezado.farmaciaEmite = req.body.arqueo.farmaciaEmite;
          estructuraXml[tipoComprobante].encabezado.usuario = req.body.arqueo.usuario;
          estructuraXml[tipoComprobante].encabezado.totalSistema = req.body.arqueo.totalSistema;
          estructuraXml[tipoComprobante].encabezado.totalCaja = req.body.arqueo.totalCaja;
          estructuraXml[tipoComprobante].encabezado.positivos = req.body.arqueo.positivos;
          estructuraXml[tipoComprobante].encabezado.negativos = req.body.arqueo.negativos;
          
          
          var xml = builder
            .create(estructuraXml)
            .dec('1.0', 'UTF-8',{standalone:true})
            .end({ pretty: true });
           
            var path = require("path")
            var fullpath = path.resolve("./archivos")

            let aleatorio = Math.floor(Math.random() * (10000)) + 1
            const ruta = fullpath+"\\arqueos\\"+moment().format('YYYYYMMDD')+aleatorio+"-ARQUEOS.xml";

            var child = require('child_process').execFile;
            var paramFacturero = [
                ruta 
            ];
            var rutaFacturero = fullpath+"\\arqueos\\impresora\\AC_facturero.exe";
            fs.appendFile(ruta , xml, (err) => {
                if(err){
                    console.log(err);
                    res.status(500).json("Ocurrio un error..") 
                }else{
                    child(rutaFacturero, paramFacturero, function(err, data) {
                    
                        if(err){
                            console.log(err)
                            res.status(500).json("Error!")    
                        }else{
                              res.status(200).json("ok");
                                
                        }
                    }); 
                }
                
            })
        } catch (error) {
            console.log(error);
            res.status(500).json("Hubo algun error..")   
        }
    },
    xmlingresos:async(req,res,next)=>{
        try {
            var builder = require('xmlbuilder');
            var detalle = req.body.detalles.detalle
            var estructuraXml = {
                ingreso: {
                    '@id': 'comprobante',
                    '@version': "1.0.0",
                    encabezado:{
                        farmacia:null,
                        usuario:null,
                        descripcion:null,
                        numComprobante:null,
                        total:null
                    },
                    detalles:{
                        detalle
                    }
                }
            }
          var tipoComprobante = "ingreso"

          
          estructuraXml[tipoComprobante].encabezado.farmacia = req.body.ingreso.farmacia;
          estructuraXml[tipoComprobante].encabezado.usuario = req.body.ingreso.usuario;
          estructuraXml[tipoComprobante].encabezado.descripcion = req.body.ingreso.descripcion;
          estructuraXml[tipoComprobante].encabezado.numComprobante = req.body.ingreso.numeroComprobante;
          estructuraXml[tipoComprobante].encabezado.total = req.body.ingreso.total;
           
          var xml = builder
            .create(estructuraXml)
            .dec('1.0', 'UTF-8',{standalone:true})
            .end({ pretty: true });
           
            var path = require("path")
            var fullpath = path.resolve("./archivos")

            let aleatorio = Math.floor(Math.random() * (10000)) + 1
            const ruta = fullpath+"\\ingresos\\"+moment().format('YYYYYMMDD')+aleatorio+"-INGR"+req.body.ingreso.numeroComprobante+'.xml';

            var child = require('child_process').execFile;
            var paramFacturero = [
                ruta 
            ];
            var rutaFacturero = fullpath+"\\ingresos\\impresora\\AC_facturero.exe";
            fs.appendFile(ruta , xml, (err) => {
                if(err){
                    console.log(err);
                    res.status(500).json("Ocurrio un error..") 
                }else{
                    child(rutaFacturero, paramFacturero, function(err, data) {
                    
                        if(err){
                            console.log(err)
                            res.status(500).json("Error!")    
                        }else{
                              res.status(200).json("ok");
                                
                        }
                    }); 
                }
                
            })
        } catch (error) {
            console.log(error);
            res.status(500).json("Hubo algun error..")   
        }
    },
            
} 


