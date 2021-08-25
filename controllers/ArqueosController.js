import models from '../models';

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Arqueos.create(req.body);
            res.status(200).json(reg);
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error al intentar agregar Arqueo.'
            });
            next(e);
        }
    },
    query: async (req,res,next) => {
        try {
            const reg=await  models.Arqueos.findOne({_id:req.query._id});
            if (!reg){
                res.status(404).send({
                    message: 'El registro no existe.'
                });
            } else{
                res.status(200).json(reg);
            }
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al buscar el registro de Rol.'
            });
            next(e);
        }
    },
    list: async (req,res,next) => {
        try {
            let valor=req.query.valor;
            const reg=await  models.Arqueos.find({$or:[{'seccion':new RegExp(valor,'i')}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}])
            .sort({'createdAt':-1});
            res.status(200).json(reg);
        } catch(e){ 
            res.status(500).send({
                message:'Ocurrió un error al intentar listar Arqueos.'
            });
            next(e);
        }
    },
    // update: async (req,res,next) => {
    //     try {         
    //         const reg = await  models.Arqueos.findByIdAndUpdate({_id:req.body._id},
    //             {descripcion:req.body.descripcion});
                    
    //         res.status(200).json(reg);
    //     } catch(e){
    //         res.status(500).send({
    //             message:'Ocurrió un error al actualizar el Rol.'
    //         });
    //         next(e);
    //     }
    // },
    // remove: async (req,res,next) => {
    //     try {
    //         const reg = await  models.Arqueos.Rol.findByIdAndDelete({_id:req.body._id});
    //         res.status(200).json(reg);
    //     } catch(e){
    //         res.status(500).send({
    //             message:'Ocurrió un error al intentar eliminar el Rol.'
    //         });
    //         next(e);
    //     }
    // },
    activate: async (req,res,next) => {
        try {
            const reg = await models.Arqueos.findByIdAndUpdate({_id:req.body._id},{estado:1});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar activar Arqueo.'
            });
            next(e);
        }
    },
    deactivate:async (req,res,next) => {
        try {
            const reg = await models.Arqueos.findByIdAndUpdate({_id:req.body._id},{estado:0});
            res.status(200).json(reg);
        } catch(e){
            res.status(500).send({
                message:'Ocurrió un error al intentar desactivar Arqueo.'
            });
            next(e);
        }
    },
    SumarTotales:async(req,res,next)=>{
        try {
            // var fechaInicial ="2020-08-03 07:00:00"
            // var fechaFinal ="2020-08-03 15:00:00"
            var fechaInicial =req.query.fi
            var fechaFinal =req.query.ff
            const moment = require('moment')
            var fecha =[] ;
            var total = [];            
            const reg=await  models.Venta.find
            ( 
                {
                        createdAt:
                            {
                                "$gte":fechaInicial,
                                "$lte":fechaFinal
                            }
                },
                    {"createdAt":1,"total":1,_id:0})
                .exec(function (err,Venta) {
                 if(err)throw  res.status(500).send({ 
                    message:'Ocurrió un error: '+err
                    });
                if(Venta){ 
                    for (let index = 0; index < Venta.length; index++) {
                      total.push(Venta[index].total)
                    }
                        let suma=  total.reduce((a,b)=>a+b,0)
                        res.status(200).send(suma.toString());
                }  
            }
            )
            
        } catch(e){ 
            res.status(500).send({
                message:'Ocurrió un error al intentar listar Arqueos.'
            });
            next(e);
        }
    },
    existeRegistro:async(req,res,next)=>{
        try {
            
            let cf=req.query.cf;
            let cu=req.query.cu;
            var fi =req.query.fi
            var ff =req.query.ff
  
            var seccion = req.query.sc
            const reg=await  models.Arqueos
            .find({
                $and:[
                    {
                        codigoUsuario:cu
                    },
                    {
                        codigoFarmacia:cf
                    },
                    {
                        seccion : seccion
                    },
                    {
                        createdAt:
                        {
                            "$gte":fi,
                            "$lte":ff
                        }
                    }
                ]
            })
            .exec(function (err,Existe) {
                if(err)throw  res.status(500).send({ 
                    message:'Ocurrió un error: '+err
                    });
                if(Object.entries(Existe).length==0){
                    res.status(200).send({ message:'no existe'}); 
                    
                }else{
                    res.status(200).send({ message:'existe'});  
                    
                }
            })
            
           
        } catch(e){ 
            res.status(500).send({
                message:'Ocurrió un error al intentar listar Arqueos.'
            });
            next(e);
        }
    },
    listporFechas: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            models.Arqueos.find({$and:[{'codigoFarmacia':valor},{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
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
            models.Arqueos.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'}
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
