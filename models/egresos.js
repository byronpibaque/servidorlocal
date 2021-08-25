import mongoose,{Schema} from 'mongoose';

const egresoSchema = new Schema({
    descripcion:{type:String},
    numComprobante: { type:String,maxlength:25,required:true},
    detalles: [{
        _id:{type:String,required:true},
        codigoBarras:{type:String,required:true},
        producto:{type:String,required:true},
        cantidad:{type:Number,required:true},
        fracciones:{type:Number,required:true },
       
    }],
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoInventarioE:{type: Schema.ObjectId, ref: 'inventarios' },//emite
    codigoInventarioR:{type: Schema.ObjectId, ref: 'inventarios' },//recibe
   
    estado: { type:Number, default:0},
    createdAt: { type: Date, default: Date.now }
});
const Egreso = mongoose.model('egresos',egresoSchema);
export default Egreso;