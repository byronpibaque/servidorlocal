import mongoose,{Schema} from 'mongoose';
const personaSchema = new Schema({
    numDocumento: {type: String,maxlength:13},
    nombres:{type:String,maxlength:100,unique:true,required:true},
    direccion: { type:String, maxlength:70},
    telefono: { type:String, maxlength:10},
    email: { type:String, maxlength:50, unique:true},
    estado:{type:Number,default:1},
    tipodocumento: {type: Schema.ObjectId, ref:'tipodocumentos'},
    tipopersona: {type: Schema.ObjectId, ref:'tipopersonas'},
    createdAt:{type:Date,default:Date.now}
});
const Persona = mongoose.model('persona',personaSchema);
export default Persona;