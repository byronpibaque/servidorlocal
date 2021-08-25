import mongoose,{Schema} from 'mongoose';

const presentacionSchema = new Schema({
    descripcion:{type:String, maxlength:100,required:true,unique:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Presentacion = mongoose.model('presentacion',presentacionSchema);

export default Presentacion;