import mongoose,{Schema} from 'mongoose';

const tipodocumentoSchema = new Schema({
    descripcion:{type:String, maxlength:50,unique:true,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const TipoDocumento = mongoose.model('tipodocumento',tipodocumentoSchema);

export default TipoDocumento;