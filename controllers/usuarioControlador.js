import bcryptjs from 'bcryptjs';

import models from '../models';
import Usuario from '../models/usuarios';

import token from '../services/token'
export default {
    add: async (req,res,next) =>{
        try {
            //req.body.password=await bcryptjs.hash(req.body.password,10);
            const reg = await models.Usuario.create(req.body);
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
        
           Usuario.findOne({_id:req.query._id}).populate([
           {path:'tipodocumento', model:'tipodocumento',select:'descripcion'}]).exec(function (err,usuario) {
               if(err)  
               return res.status(500).send({
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
    list: async (req,res,next) => {
        try {
           let valor=req.query.valor;
           Usuario.find({'nombres':new RegExp(valor,'i')}).populate([
           {path:'tipodocumento', model:'tipodocumento',select:'descripcion'}]).exec(function (err,usuario) {
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
             
              
            const reg = await models.Usuario.findByIdAndUpdate({_id:req.body._id},
                {   numDocumento:req.body.numDocumento,
                    nombres:req.body.nombres,
                    direccion:req.body.direccion,
                    telefono:req.body.telefono,
                   
                    tipodocumento:req.body.tipodocumento,
                   
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
            const reg = await models.Usuario.findByIdAndDelete({_id:req.body._id});
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
            const reg = await models.Usuario.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Usuario.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    login:async(req,res,next)=>{
        try {
        
            let user = await models.Usuario.findOne({email:req.body.email});
            if (user) {
                
                let match = await bcryptjs.compare(req.body.password, user.password);
                if (match){
                let tokenReturn = await token.encode(user._id,user.rol,user.email);
                res.status(200).json({user,tokenReturn});
                
                }else{
                    res.status(404).send({
                        message:'Clave incorrecta, Verifique.'
                    });
                }
                
            }else{
                res.status(404).send({
                    message:'No existe el usuario, Registrate.'
                });
            }
            

        } catch (e) {
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}
