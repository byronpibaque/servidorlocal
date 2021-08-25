import models from '../models';
import Persona from '../models/persona';

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Persona.create(req.body);
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
            Persona.findOne({_id:req.query._id}).populate([
                {path:'tipodocumento', model:'tipodocumento',select:'descripcion'},
                {path:'tipopersona', model:'tipopersona',select:'descripcion'}]).exec(function (err,persona) {
                    if(err)  
                    return res.status(500).send({
                                    message:'Ocurrió un error: '+err
                                 });
                    if(persona){
                     res.status(200).send(persona);    
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
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}]}).populate([
            {path:'tipodocumento', model:'tipodocumento',select:'descripcion'},
            {path:'tipopersona', model:'tipopersona',select:'descripcion'}]).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
                }
                
            })
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listClientes: async (req,res,next) => {
        try {

            let valor=req.query.valor;
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}],'tipopersona':"5ee385fb23f8e71e10e3ae94"}).populate([
            {path:'tipodocumento', model:'tipodocumento',select:'descripcion'},
            {path:'tipopersona', model:'tipopersona',select:'descripcion'}]).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
                }
                
            })
  
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    },
    listProveedores: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            Persona.find({$or:[{'nombres':new RegExp(valor,'i')},
            {'email':new RegExp(valor,'i')}],'tipopersona':"5ee3860323f8e71e10e3ae95"}).populate([
            {path:'tipodocumento', model:'tipodocumento',select:'descripcion'},
            {path:'tipopersona', model:'tipopersona',select:'descripcion'}]).exec(function (err,persona) {
                if(err)throw  res.status(500).send({
                                message:'Ocurrió un error: '+err
                             });
                if(persona){
                 res.status(200).send(persona);    
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
            const reg = await models.Persona.findByIdAndUpdate({_id:req.body._id},
                {   numDocumento:req.body.numDocumento,
                    nombres:req.body.nombres,
                    direccion:req.body.direccion,
                    telefono:req.body.telefono,
                    email:req.body.email,
                    tipodocumento:req.body.tipodocumento,
                    tipopersona:req.body.tipopersona
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
            const reg = await models.Persona.findByIdAndDelete({_id:req.body._id});
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
            const reg = await models.Persona.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Persona.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }
}
