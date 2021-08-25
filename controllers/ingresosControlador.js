import models from '../models';
import Ingreso from '../models/ingresos';

async function aumentarStock(idarticulo,cantidad,fracciones){
    let {fraccionesTotales}=await models.Producto.findOne({_id:idarticulo});//FRACCIONES TOTALES DE PRODUCTOS
  
    let {fraccionCaja}= await models.Producto.findOne({_id:idarticulo});//Fracciones por caja

    let nuevafrac = cantidad*fraccionCaja;

    let nfracionesTotal = parseInt(fraccionesTotales)+parseInt(nuevafrac);

    const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal});}

async function disminuirStock(idarticulo,cantidad,fracciones){
    let {fraccionesTotales}=await models.Producto.findOne({_id:idarticulo});
 
    let nfracionesTotal = parseInt(fraccionesTotales)-parseInt(fracciones);
   
    const reg2=await models.Producto.findByIdAndUpdate({_id:idarticulo},{fraccionesTotales:nfracionesTotal});
    
}

export default {
    add: async (req,res,next) =>{
        try {
            const reg = await models.Ingreso.create(req.body);
            //Actualizar stock
            let detalles=req.body.detalles;
            detalles.map(function(x){
                aumentarStock(x._id,x.cantidad,x.fracciones);
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

            Ingreso.findOne({_id:req.query._id}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
            ])
                .exec(function (err,ingreso) {
                    if(err)  
                    return res.status(500).send({
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
    listporFechas: async (req,res,next) => {
        try { 
            let valor=req.query.valor;
            let finicio=req.query.fechainicio; 
            let ffin=req.query.fechafin;
            Ingreso.find({$and:[{'codigoFarmacia':valor},{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
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
            Ingreso.find({$and:[{createdAt:{"$gte":new Date(finicio), "$lt":new Date(ffin)}}]})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoPersona', model:'persona',select:'nombres'}
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
    list: async (req,res,next) => {
        try {
           
            let valor=req.query.valor;
            Ingreso.find({'codigoFarmacia':valor}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}]).exec(function (err,ingreso) {
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
    listtotal: async (req,res,next) => {
        try {
           
            let valor=req.query.valor;
            Ingreso.find({$or:[{'numComprobante':new RegExp(valor,'i')}]}).populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoFarmacia', model:'detallefarmacias',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codgioPersona', model:'persona',select:'nombres'}]).exec(function (err,ingreso) {
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
    /*
    update: async (req,res,next) => {
        try {
            const reg = await models.Categoria.findByIdAndUpdate({_id:req.body._id},{nombre:req.body.nombre,descripcion:req.body.descripcion});
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
            const reg = await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{estado:1});
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
            const reg = await models.Ingreso.findByIdAndUpdate({_id:req.body._id},{estado:0});
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
    grafico12Meses:async(req,res,next) =>{
        try {
            const reg=await models.Ingreso.aggregate(
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
            
            
            Ingreso.find({"createdAt": {"$gte": start, "$lt": end}})
            .sort({'createdAt':-1})
            .populate([
                {path:'codigoTipoComprobante', model:'tipocomprobante',select:'descripcion'},
                {path:'codigoUsuario', model:'usuarios',select:'nombres'},
                {path:'codigoPersona', model:'persona',select:'nombres'}])
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
    }
}
