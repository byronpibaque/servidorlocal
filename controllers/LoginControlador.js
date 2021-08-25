import bcryptjs from 'bcryptjs';
import models from '../models';
import Login from '../models/login';
import token from '../services/token'
export default {
    add: async (req,res,next) =>{
        try {
            req.body.password=await bcryptjs.hash(req.body.password,10);
            const reg = await Login.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error'
            });
            next(e);
        }
    }, queryCode: async (req,res,next) => {
       

        try {
            let valor=req.query.valor;
           
            Login
            .find({'codigoUsuario':valor})
            .populate([
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'rol', model:'rol',select:'descripcion'},
               {path:'codigoUsuario', model:'usuarios',select:['nombres','rol']}])
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
    query: async (req,res,next) => {
        try {
        
           Login.findOne({_id:req.query._id}).populate([
            {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
            {path:'rol', model:'rol',select:'descripcion'},
           {path:'codigoUsuario', model:'usuarios',select:['nombres','rol']}]).exec(function (err,usuario) {
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
           Login.find({'email':new RegExp(valor,'i')}).populate([
            {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
            {path:'rol', model:'rol',select:'descripcion'},
           {path:'codigoUsuario', model:'usuarios',select:['nombres']}]).exec(function (err,usuario) {
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
             let pass = req.body.password;
             const reg0 = await Login.findOne({_id:req.body._id});
             if (pass!=reg0.password ) {
                req.body.password= await bcryptjs.hash(req.body.password,10);  
             }   
              
            const reg = await Login.findByIdAndUpdate({_id:req.body._id},
                {   
                    email:req.body.email,
                    password:req.body.password,
                    codigoUsuario:req.body.codigoUsuario,
                    codigoFarmacia:req.body.codigoFarmacia
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
            const reg = await Login.findByIdAndDelete({_id:req.body._id});
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
            const reg = await Login.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await Login.findByIdAndUpdate({_id:req.body._id},{estado:0});
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
        
            let user = await Login.findOne({email:req.body.email});
            if (user) {
                
                let match = await bcryptjs.compare(req.body.password, user.password);
                if (match){
                let tokenReturn = await token.encode(user._id,user.rol,user.email,user.codigoFarmacia,user.codigoUsuario);
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
