import models from '../models';

export default {
    exportarTotal: async (req,res,next) => {

        try {

            const excel = require('exceljs');
            const moment = require('moment')



            let codigoInventario=req.query.codigoInventario;
            let inventario=req.query.inventario
            
             models.Producto
             .find({$and:[
               //  {'codigoInventario':codigoInventario},
                 {'fraccionesTotales':{$ne:0}}
              ]})
             .populate([
              {path:'codigoCategoria', model:'categoria',select:'nombre'},
              {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
              {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
              {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
              .sort({'nombreComercial':1})
              .exec(function (err,producto) {
                 if(err)throw  res.status(500).send({
                                 message:'Ocurrió un error: '+err
                              });
                 if(producto){
                    var data = producto;

                    var valores = [];
                    var fecha = "";
                    for (let index = 0; index < data.length; index++) {

                        let fracciones_totales = data[index].fraccionesTotales;
                        let fracciones_caja = data[index].fraccionCaja;
                        let div = parseFloat(fracciones_totales)/parseFloat(fracciones_caja)
                        let cajas =  Math.floor(div)
                        let fracciones = Math.round((div-cajas)*fracciones_caja)

                        valores.push(
                          {
                          codigoBarras: data[index].codigoBarras,
                          nombreComercial: data[index].nombreComercial,
                          pvp:data[index].pvp,
                          precioUni:data[index].precioUni,
                          costo:data[index].costoNeto,
                          descuento:data[index].descuento,
                          cajas:cajas,
                          fracciones:fracciones,
                          fraccionesCaja: data[index].fraccionCaja,
                          fechaCaducidad: data[index].fechaCaducidad,
                          laboratorio: data[index].codigoLaboratorio.nombre,
                          categoria:data[index].codigoCategoria.nombre,
                          inventario:data[index].codigoInventario.descripcion
                        }
                        )

                    }

                            let workbook = new excel.Workbook(); //creating workbook
                            let worksheet = workbook.addWorksheet('Inventario'); //creating worksheet
                            worksheet.columns = [
                                { header: 'CODIGO DE BARRAS', key: 'codigoBarras', width: 20 },
                                { header: 'PRODUCTO', key: 'nombreComercial', width: 30 },
                                { header: 'PVP', key: 'pvp', width: 5 },
                                { header: 'P. Unit', key: 'precioUni', width: 5 },
                                { header: 'Costo', key: 'costo', width: 5 },
                                { header: 'Descto.', key: 'descuento', width: 5 },
                                { header: 'CAJAS', key: 'cajas', width: 5 },
                                { header: 'FRACCIONES', key:'fracciones', width:5},
                                { header: 'F x CAJA', key: 'fraccionesCaja', width: 5 },
                                { header: 'FECHA CADUCIDAD', key: 'fechaCaducidad', width: 20},
                                { header: 'LABORATORIO', key: 'laboratorio', width: 25},
                                { header: 'CATEGORIA', key: 'categoria', width: 25},
                                { header: 'INVENTARIO', key: 'inventario', width: 25},

                            ];
                            worksheet.addRows(valores);
                            var path = require("path")
                            var fullpath = path.resolve("./archivos")
                            // Write to File
                            workbook.xlsx.writeFile(fullpath+'\\ArchivosExportados\\INVENTARIO\\REPORTE_TOTAL - '+moment().format('DD MM YYYY')+".xlsx")
                            .then(function() {
                            res.status(200).send({
                                message:'generado'
                                    });
                            });
                 }

             })





        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {

        try {

            const excel = require('exceljs');
            const moment = require('moment')

            let start=req.query.fechainicio;
            let end=req.query.fechafin;
            let valor=req.query.valor;
            models.Venta.find({$and:[{estado:1},{'codigoFarmacia':valor},
            {createdAt:{$gte:new Date(start+"T12:00:00.000Z")}},
            {createdAt:{$lt:new Date(end+"T04:59:00.000Z")}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion -_id'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres -_id'},
                {path:'codgioPersona', model:'persona',select:'nombres numDocumento -_id'}
            ])
            .exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                        message:'Ocurrió un error: '+err
                            });
                if(Venta){
                    var data = Venta;

                    var valores = [];
                    var fecha = "";
                    for (let index = 0; index < data.length; index++) {
                        fecha = data[index].createdAt
                        let date = new Date(fecha)

                        valores.push(
                          {
                          estado: data[index].estado,
                          fecha: date.toDateString(),
                          formapago:data[index].formapago,
                          comprobante: data[index].numComprobante,
                          clave: data[index].claveAcceso,
                          impuesto: data[index].impuesto,
                          total: data[index].total,
                          usuario: data[index].codigoUsuario.nombres,
                          tipoComprobante: data[index].codigoTipoComprobante.descripcion,
                          numeroDocumento: data[index].codgioPersona.numDocumento,
                          persona: data[index].codgioPersona.nombres
                        }
                        )

                    }

                            let workbook = new excel.Workbook(); //creating workbook
                            let worksheet = workbook.addWorksheet('Reporte'); //creating worksheet
                            worksheet.columns = [
                                { header: 'Estado', key: 'estado', width: 10 },
                                { header: 'Fecha de emision', key: 'fecha', width: 20 },
                                { header: 'Forma pago', key: 'formapago', width: 20 },
                                { header: 'Comprobante', key: 'comprobante', width: 25 },
                                { header: 'CA/NA', key: 'clave', width: 50 },
                                { header: 'Impuesto', key: 'impuesto', width: 20},
                                { header: 'Total', key: 'total', width: 15, outlineLevel: 1},
                                { header: 'Tipo Comprobante', key: 'tipoComprobante', width: 15 },
                                { header: 'Usuario', key: 'usuario', width: 30 },
                                { header: 'Cliente', key: 'persona', width: 30, outlineLevel: 1},
                                { header: 'Documento', key: 'numeroDocumento', width: 25},
                            ];
                            worksheet.addRows(valores);
                            var path = require("path")
                            var fullpath = path.resolve("./archivos")
                            // Write to File
                            workbook.xlsx.writeFile(fullpath+'\\ArchivosExportados\\Excel\\REPORTE - '+moment().format('MMMM Do YYYY')+".xlsx")
                            .then(function() {
                            res.status(200).send({
                                message:'generado'
                                    });
                            });

                }
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listInventario: async (req,res,next) => {

        try {

            const excel = require('exceljs');
            const moment = require('moment')



            let codigoInventario=req.query.codigoInventario;
            let inventario=req.query.inventario
            
             models.Producto
             .find({$and:[
                 {'codigoInventario':codigoInventario},
              //   {'fraccionesTotales':{$ne:0}}
              ]})
             .populate([
              {path:'codigoCategoria', model:'categoria',select:'nombre'},
              {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
              {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
              {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
              .sort({'nombreComercial':1})
              .exec(function (err,producto) {
                 if(err)throw  res.status(500).send({
                                 message:'Ocurrió un error: '+err
                              });
                 if(producto){
                    var data = producto;

                    var valores = [];
                    var fecha = "";
                    for (let index = 0; index < data.length; index++) {

                        let fracciones_totales = data[index].fraccionesTotales;
                        let fracciones_caja = data[index].fraccionCaja;
                        let div = parseFloat(fracciones_totales)/parseFloat(fracciones_caja)
                        let cajas =  Math.floor(div)
                        let fracciones = Math.round((div-cajas)*fracciones_caja)

                        valores.push(
                          {
                          codigoBarras: data[index].codigoBarras,
                          nombreComercial: data[index].nombreComercial,
                          pvp:data[index].pvp,
                          precioUni:data[index].precioUni,
                          costo:data[index].costoNeto,
                          descuento:data[index].descuento,
                          cajas:cajas,
                          fracciones:fracciones,
                          fraccionesCaja: data[index].fraccionCaja,
                          fechaCaducidad: data[index].fechaCaducidad,
                          laboratorio: data[index].codigoLaboratorio.nombre,
                          categoria:data[index].codigoCategoria.nombre,
                          inventario:data[index].codigoInventario.descripcion
                        }
                        )

                    }

                            let workbook = new excel.Workbook(); //creating workbook
                            let worksheet = workbook.addWorksheet('Inventario'); //creating worksheet
                            worksheet.columns = [
                                { header: 'CODIGO DE BARRAS', key: 'codigoBarras', width: 20 },
                                { header: 'PRODUCTO', key: 'nombreComercial', width: 30 },
                                { header: 'PVP', key: 'pvp', width: 5 },
                                { header: 'P. Unit', key: 'precioUni', width: 5 },
                                { header: 'Costo', key: 'costo', width: 5 },
                                { header: 'Descto.', key: 'descuento', width: 5 },
                                { header: 'CAJAS', key: 'cajas', width: 5 },
                                { header: 'FRACCIONES', key:'fracciones', width:5},
                                { header: 'F x CAJA', key: 'fraccionesCaja', width: 5 },
                                { header: 'FECHA CADUCIDAD', key: 'fechaCaducidad', width: 20},
                                { header: 'LABORATORIO', key: 'laboratorio', width: 25},
                                { header: 'CATEGORIA', key: 'categoria', width: 25},
                                { header: 'INVENTARIO', key: 'inventario', width: 25},

                            ];
                            worksheet.addRows(valores);
                            var path = require("path")
                            var fullpath = path.resolve("./archivos")
                            // Write to File
                            workbook.xlsx.writeFile(fullpath+'\\ArchivosExportados\\INVENTARIO\\REPORTE - '+moment().format('DD MM YYYY')+".xlsx")
                            .then(function() {
                            res.status(200).send({
                                message:'generado'
                                    });
                            });
                 }

             })





        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }

}
