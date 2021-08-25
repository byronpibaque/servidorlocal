import models from '../models';
import Venta from '../models/ventas';


function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}

async function aumentarStock(idarticulo, cantidad, fracciones) {//PARA ANULAR FACTURAS

    let { fraccionesTotales, fraccionCaja } = await models.Producto.findOne({ _id: idarticulo });//FRACCIONES TOTALES Y FRACCIONES POR CAJA EN ARTICULOS
   

  
        let nfracionesTotal = parseInt(fraccionesTotales) +
         ((parseInt(fraccionCaja) * parseInt(cantidad))+parseInt(fracciones))
       
        const reg = await models.Producto.findByIdAndUpdate(
            { _id: idarticulo },
            {
         
                fraccionesTotales:nfracionesTotal

            });
   


}

async function disminuirStock(idarticulo, cantidad, fracciones) {//PARA GENERAR VENTA

    let { fraccionesTotales, fraccionCaja } = await models.Producto.findOne({ _id: idarticulo });
   
        let nfracionesTotal = parseInt(fraccionesTotales) -
        (((parseInt(fraccionCaja) * parseInt(cantidad)) + parseInt(fracciones)))
       

        const reg = await models.Producto.findByIdAndUpdate(
            { _id: idarticulo },
            {
                  fraccionesTotales: nfracionesTotal
            });
    
}



export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Venta.create(req.body);
            //Actualizar stock
            let detalles=req.body.detalles;
            detalles.map(function(x){
                disminuirStock(x._id,x.cantidad,x.fracciones);
            });
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {

            Venta.findOne({_id:req.query._id}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}
            ])
                .exec(function (err,Venta) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                    if(Venta){
                     res.status(200).send(Venta);    
                    }
                    
                })  

            
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },listFecha: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');

            let valor=req.query.valor;
            Venta.find({createdAt:{"$gte": today.toDate(), "$lt":moment(today).endOf('day').toDate()}}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona'}]).exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
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
           
            let valor=req.query.valor;
            Venta.find({$or:[{'numComprobante':new RegExp(valor,'i')}]}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona'}])
                .exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            }) 
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listOne: async (req,res,next) => {
        try {
           
            let valor=req.query.valor;
            let valor2=req.query.valor2;
            Venta.find({$and:[{'codigoFarmacia':valor},{'codigoUsuario':valor2}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona'}]).exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listOneF: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');
            let valor=req.query.valor;
            let valor2=req.query.valor2;
            Venta.find({$and:[{'codigoFarmacia':valor},{'codigoUsuario':valor2},{createdAt:{"$gte": today.toDate(), "$lt":moment(today).endOf('day').toDate()}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona'}]).exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }  
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    update: async (req,res,next) => {
        try {
            const reg = await models.Venta.updateOne({$and:[{numComprobante:req.query.numComprobante},{codigoFarmacia:req.query.codigoFarmacia}]},
                {claveAcceso:req.query.clave});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }, /*
    remove: async (req,res,next) => {
        try {
            const reg = await models.Categoria.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    */
    activate: async (req,res,next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({_id:req.body._id},{estado:1});
            //Actualizar stock
            let detalles=reg.detalles;
            detalles.map(function(x){
                disminuirStock(x._id,x.cantidad,x.fracciones);
            });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Venta.findByIdAndUpdate({_id:req.body._id},{estado:0});
            //Actualizar stock
            let detalles=reg.detalles;
            detalles.map(function(x){
                aumentarStock(x._id,x.cantidad,x.fracciones);
            });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    grafico12Meses:async(req,res,next) =>{
        try {
            const reg=await models.Venta.aggregate(
                [
                    {
                        $group:{
                            _id:{
                                mes:{$month:"$createdAt"},
                                year:{$year: "$createdAt"}
                            },
                            total:{$sum:"$total"},
                            numero:{$sum:1}
                        }
                    },
                    {
                        $sort:{
                            "_id.year":-1,"_id.mes":-1
                        }
                    }
                ]
            ).limit(12);
            res.status(200).json(reg);
        } catch(e){
                res.status(500).send({
                    message:'Ocurrió un error'
                });
                next(e);
         }
    },
    consultaFechas: async (req,res,next) => {
        try {
            let start=req.query.start;
            let end=req.query.end;
            
            
            Venta.find({"createdAt": {"$gte": start, "$lt": end}})
            .sort({'createdAt':-1})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'}])
            .exec(function (err,Venta) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(Venta){
                 res.status(200).send(Venta);    
                }
                
            })
           
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    contarVentas : async (req,res,next)=> {
        try {
            const reg = await models.Venta.countDocuments({codigoFarmacia:req.query.codigoFarmacia},function (err,count) {
                if (err){
                    console.log(err)
                }else{
                    let contadorEntero =parseInt(count)+ 99999
                    res.status(200).json(paddy(parseInt(contadorEntero),9))
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
