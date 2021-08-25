import mongoose,{Schema} from 'mongoose';
const usuarioSchema = new Schema({
    numDocumento: {type: String,maxlength:13},
    nombres:{type:String,maxlength:100,unique:true,required:true},
    direccion: { type:String, maxlength:70},
    telefono: { type:String, maxlength:10},
    estado:{type:Number,default:1},
    tipodocumento: {type: Schema.ObjectId, ref:'tipodocumentos'},
    createdAt:{type:Date,default:Date.now}
});
const Usuario = mongoose.model('usuarios',usuarioSchema);

export default Usuario;