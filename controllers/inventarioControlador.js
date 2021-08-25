import models from '../models';
import Inventario from '../models/inventario';

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Inventario.create(req.body);
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
         
            Inventario.findOne({detalleFarmacia:{_id:req.query._id}})
            .populate([   
           {path:'detalleFarmacia', model:'detallefarmacias'}])
           .exec(function (err,inventario) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            }); 
               if(inventario){
                res.status(200).send(inventario);    
               }
               
           })       
      
         
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    queryInv: async (req,res,next) => {
        try {
         
            Inventario.findOne({_id:req.query._id})
            .populate([   
           {path:'detalleFarmacia', model:'detallefarmacias'}])
           .exec(function (err,inventario) {
               if(err)  
               return res.status(500).send({
                               message:'Ocurrió un error: '+err
                            }); 
               if(inventario){
                res.status(200).send(inventario);    
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
           Inventario.find({$or:[{'descripcion':new RegExp(valor,'i')}]})
           .populate([{path:'detalleFarmacia', model:'detallefarmacias',select:'descripcion'}])
           .exec(function (err,usuario) {
               if(err)throw  res.status(500).send({
                               message:'Ocurrió un error: '+err
                            });
               if(usuario){
                res.status(200).send(usuario);    
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
            const reg = await models.Inventario.findByIdAndUpdate({_id:req.body._id},
                {   
                    descripcion:req.body.descripcion,
                    detalleFarmacia:req.body.detalleFarmacia,
                    
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
            const reg = await models.Inventario.findByIdAndDelete({_id:req.body._id});
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
            const reg = await models.Inventario.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Inventario.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}
