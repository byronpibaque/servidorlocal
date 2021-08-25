import mongoose,{Schema} from 'mongoose';
const ingresoSchema = new Schema({
    serieComprobante: { type:String,maxlength:10},
    numComprobante: { type:String,maxlength:10,required:true},
    impuesto:{type:Number, required:true},
   
    total:{ type:Number, required:true},
    detalles: [{
        _id:{
            type:String,
            required:true
        },
        producto:{
            type:String,
            required:true
        },
        cantidad:{
            type:Number,
            required:true
        },
        fracciones:{
            type:Number,
            required:true
        },
        costoNeto:{
            type:Number,
            required:true
        }
    }],
    descripcion: { type:String },
    codigoTipoComprobante:{type: Schema.ObjectId, ref: 'tipocomprobantes',required:true },
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codgioPersona:{ type: Schema.ObjectId, ref: 'personas',required:true },
    codigoFarmacia:{ type: Schema.ObjectId, ref: 'detallefarmacias'},
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const Ingreso = mongoose.model('ingresos',ingresoSchema);
export default Ingreso;