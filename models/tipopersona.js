import mongoose,{Schema} from 'mongoose';

const tipopersonaSchema = new Schema({
    descripcion:{type:String, maxlength:50,unique:true,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const TipoPersona = mongoose.model('tipopersona',tipopersonaSchema);

export default TipoPersona;