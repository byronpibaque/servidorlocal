import mongoose,{Schema} from 'mongoose';

const tipocomprobanteSchema = new Schema({
    descripcion:{type:String, maxlength:50,unique:true,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const TipoComprobante = mongoose.model('tipocomprobante',tipocomprobanteSchema);

export default TipoComprobante;