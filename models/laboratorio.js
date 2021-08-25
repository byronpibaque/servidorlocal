import mongoose,{Schema} from 'mongoose';

const laboratorioSchema = new Schema({
    nombre:{type:String, maxlength:50,unique:true,required:true},
    abreviatura:{type:String, maxlength:5,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Laboratorio = mongoose.model('laboratorio',laboratorioSchema);

export default Laboratorio;