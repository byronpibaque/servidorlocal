import models from '../models';
import Producto from '../models/productos';
async function ObtenerInventario(codigoFarmacia){
    let {_id}=await models.Inventario.findOne({detalleFarmacia:ObjectId(codigoFarmacia)});
    
    return _id;
    
}
export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Producto.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    queryA: async (req,res,next) => {
        try {
        
            Producto.findOne({_id:req.query._id}).populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}]).exec(function (err,producto) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
               }
               
           })       
      
         
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
        
            Producto.findOne({codigoBarras:req.query.codigoBarras}).populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}]).exec(function (err,producto) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
               }
               
           })       
      
         
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    queryB: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Producto.findOne({$and:[{'codigoInventario':valor},{codigoBarras:req.query.codigoBarras}]})
            .populate([
           {path:'codigoCategoria', model:'categoria',select:'descripcion'},
           {path:'codigoLaboratorio', model:'laboratorio',select:'descripcion'},
           {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
           {path:'codigoInventario', model:'inventarios',select:'descripcion'}]).exec(function (err,producto) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
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
           let producto = req.query.producto;
           Producto
           .find({$and:[{'codigoInventario':valor},{$or:[{'nombre':new RegExp(producto,'i')},
           {'nombreComercial':new RegExp(producto,'i')}]}]})
           .populate
           ([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}
           ])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
               }
               
           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listB: async (req,res,next) => {
        try {
           let valor=req.query.valor;
          
           Producto
           .find({'codigoInventario':valor})
           .populate([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}])
            .exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
               }
               
           })

        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listtotalProductos: async (req,res,next) => {
        try { 
           let valor=req.query.valor; 
           Producto.find({$or:[{'nombre':new RegExp(valor,'i')},
           {'nombreComercial':new RegExp(valor,'i')}]}).populate([
            {path:'codigoCategoria', model:'categoria',select:'nombre'},
            {path:'codigoLaboratorio', model:'laboratorio',select:['nombre','abreviatura']},
            {path:'codigoPresentacion', model:'presentacion',select:'descripcion'},
            {path:'codigoInventario', model:'inventarios',select:'descripcion'}]).exec(function (err,producto) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(producto){
                res.status(200).send(producto);    
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
            const reg = await models.Producto.findByIdAndUpdate({_id:req.body._id},
                {  

                    codigoBarras:req.body.codigoBarras,
                    nombre:req.body.nombre,
                    nombreComercial:req.body.nombreComercial,
                    stock:req.body.stock,
                    fraccionesTotales:req.body.fraccionesTotales,
                    fraccionCaja: req.body.fraccionCaja,
                    fechaCaducidad:req.body.fechaCaducidad,
                    costoNeto:req.body.costoNeto,
                    pvm:req.body.pvm,
                    pvp:req.body.pvp,
                    precioUni:req.body.precioUni,
                    descuento:req.body.descuento,
                    iva:req.body.iva,
                    codigoCategoria:req.body.codigoCategoria,
                    codigoLaboratorio:req.body.codigoLaboratorio,
                    codigoInventario:req.body.codigoInventario,
                    codigoPresentacion:req.body.codigoPresentacion
                                   });
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    remove: async (req,res,next) => {
        try {
            const reg = await models.Producto.findByIdAndDelete({_id:req.body._id});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Producto.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Producto.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}
