import models from '../models';
import Egreso from '../models/egresos';


function paddy(num, padlen, padchar) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
}
async function aumentarStock(idarticulo,cantidad,fracciones){
    let {fraccionesTotales}=await models.Producto.findOne({_id:idarticulo});
    let {fraccionCaja}=await models.Producto.findOne({_id:idarticulo});
    let {stock}=await models.Producto.findOne({_id:idarticulo});
    if (parseInt(cantidad)>0){
        let nStock=parseInt(stock)+parseInt(cantidad);
        let nfracionesTotal = parseInt(fraccionesTotales)+(parseInt(fraccionCaja)*parseInt(cantidad));
        const reg=await models.Producto.findByIdAndUpdate({_id:idarticulo},{stock:nStock});
        const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal});
    }
    if(parseInt(cantidad)==0){

        let nfracionesTotal = parseInt(fraccionesTotales)+parseInt(fracciones);
        let div = nfracionesTotal/fraccionCaja

        const reg=await models.Producto.findByIdAndUpdate({_id:idarticulo},{stock:Math.trunc(div)});
        const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal});

    }
}
async function disminuirStock(idarticulo,cantidad,fracciones){ 
    let {fraccionCaja}=await models.Producto.findOne({_id:idarticulo});
    let {fraccionesTotales}=await models.Producto.findOne({_id:idarticulo});
    let {stock}=await models.Producto.findOne({_id:idarticulo});
    if (parseInt(cantidad)>0){
        let nStock=parseInt(stock)-parseInt(cantidad);
        let nfracionesTotal = parseInt(fraccionesTotales)-(parseInt(fraccionCaja)*parseInt(cantidad));
        const reg=await models.Producto.findByIdAndUpdate({_id:idarticulo},{stock:nStock});
        const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal});
    }
    if(parseInt(cantidad)==0){

        let nfracionesTotal = parseInt(fraccionesTotales)-parseInt(fracciones);
        let div = nfracionesTotal/fraccionCaja
        Math.trunc(div)
        const reg=await models.Producto.findByIdAndUpdate({_id:idarticulo},{stock:Math.trunc(div)});
        const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal});

    }
    
}

export default {
    emitir: async (req,res,next) =>{
        try {
            const reg = await models.Egresos.create(req.body);
            //Actualizar stock
            // let detalles=req.body.detalles;
            // detalles.map(function(x){
            //     disminuirStock(x._id,x.cantidad,x.fracciones);
            // });
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

            Egreso.findOne({_id:req.query._id}).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'persona',select:'inventarios'},
                {path:'codigoInventarioR', model:'persona',select:'inventarios'}
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
    },
    listFecha: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');

            let valor=req.query.valor;
            Egreso.find({createdAt:{"$gte": today.toDate(), "$lt":moment(today).endOf('day').toDate()}}).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'persona',select:'inventarios'},
                {path:'codigoInventarioR', model:'persona',select:'inventarios'}]).exec(function (err,Venta) {
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
            Egreso.find({$or:[{'numComprobante':new RegExp(valor,'i')}]}).populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}]).exec(function (err,Venta) {
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
            Egreso.find({$and:[{'codigoFarmacia':valor},{'codigoUsuario':valor2}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'persona',select:'inventarios'},
                {path:'codigoInventarioR', model:'persona',select:'inventarios'}])
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
    listOneF: async (req,res,next) => {
        try {
            const moment = require('moment')
            const today = moment().startOf('day');
            let valor=req.query.valor;
            let valor2=req.query.valor2;
            Egreso.find({$and:[{'codigoFarmacia':valor},{'codigoUsuario':valor2},{createdAt:{"$gte": today.toDate(), "$lt":moment(today).endOf('day').toDate()}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'persona',select:'inventarios'},
                {path:'codigoInventarioR', model:'persona',select:'inventarios'}]).exec(function (err,Venta) {
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
    activate: async (req,res,next) => {
        try {
            const reg = await models.Egresos.findByIdAndUpdate({_id:req.body._id},{estado:0});

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
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Egresos.findByIdAndUpdate({_id:req.body._id},{estado:1});
            //Actualizar stock
                let codigoInventarioR = reg.codigoInventarioR;
                let detalles=reg.detalles;
          
            detalles.map(function(x){
                disminuirStock(x._id,x.cantidad,x.fracciones);
                  models.Producto.find({$and:[{'codigoInventario':codigoInventarioR},{'codigoBarras':x.codigoBarras}]})
                  .populate([
                    {path:'codigoCategoria', model:'categoria',select:'descripcion'},
                    {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
                    {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                    {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
                    .exec(function (err,Venta) {
                        if(err)throw res.status(500).send({
                            message:'Ocurrió un error: '+err
                            });
                        if(Venta){
                        if(Venta.length==0)
                            {//SI NO EXISTE EL PRODUCTO EN LA FARMACIA A LA QUE SE ENVIA EL EGRESO, SE LO CREA
                               
                                models.Producto.find({$and:[{'_id':x._id}]})
                                .populate([
                                  {path:'codigoCategoria', model:'categoria',select:'descripcion'},
                                  {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
                                  {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
                                  {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
                                  .exec(function (err,Resultado) {
                                    if(err)throw res.status(500).send({
                                        message:'Ocurrió un error: '+err  
                                        });
                                     if(Resultado){
                                        
                                        let val=0
                                        if(parseInt(x.cantidad)>0){
                                            val=parseInt(x.cantidad)*parseInt(x.fracciones)
                                            console.log(val)
                                        }else{
                                            val=parseInt(x.fracciones)
                                            console.log(val)
                                        }
                                        Resultado.forEach(element=>{
                                            let arr = 
                                                {
                                                    "precioUni": element.precioUni,
                                                    "iva":  element.iva,
                                                    "codigoBarras":  element.codigoBarras,
                                                    "nombre":  element.nombre,
                                                    "nombreComercial":  element.nombreComercial,
                                                    "stock": x.cantidad,
                                                    "fraccionesTotales":  val,
                                                    "fraccionCaja":  element.fraccionCaja,
                                                    "fechaCaducidad":  element.fechaCaducidad,
                                                    "costoNeto": element.costoNeto,
                                                    "pvm":  element.pvm,
                                                    "pvp": element.pvp,
                                                    "descuento": element.descuento,
                                                    "codigoCategoria":  element.codigoCategoria,
                                                    "codigoLaboratorio": element.codigoLaboratorio,
                                                    "codigoInventario":  codigoInventarioR,
                                                    "codigoPresentacion":  element.codigoPresentacion,
                                                }
                                                models.Producto.create(arr,function(err,result) {
                                                    if(err)throw res.status(500).send({
                                                        message:'Ocurrió un error: '+err 
                                                        });
                                                    if(result){
                                                        res.status(200).json(reg); 
                                                    }    
                                                });    
                                        });
                                     }   
                                  });
                            }
                            else{//SI EXISTE EL PRODUCTO SE ACTUALIZA EL STOCK
                                
                               
                                  Venta.forEach(element => {
                                    aumentarStock(element._id,x.cantidad,x.fracciones)
                                       res.status(200).json(reg); 
                                  });
                        }
                    }  
                }) 
            });
        
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    contarVentas : async (req,res,next)=> {
        try {
            const reg = await models.Egresos.estimatedDocumentCount(function(err,count) {
                if (err) return handleError(err);
                 if(count){
                    
                   let contadorEntero = parseInt(count)+1
                    
                   
                     res.status(200).json(paddy(parseInt(contadorEntero),9))
                 }
                 
            });
           
           
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listporFechas: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            Egreso.find({$and:[{'codigoFarmacia':valor},{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ])
            .exec(function (err,ingreso) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(ingreso){
                 res.status(200).send(ingreso);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listporFechasAdmin: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            Egreso.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoInventarioE', model:'inventarios'},
                {path:'codigoInventarioR', model:'inventarios'}
            ])
            .exec(function (err,ingreso) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(ingreso){
                 res.status(200).send(ingreso);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }, 
    
    
}
