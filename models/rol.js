import mongoose,{Schema} from 'mongoose';

const rolSchema = new Schema({
    descripcion:{type:String, maxlength:50,unique:true,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Rol = mongoose.model('rol',rolSchema);

export default Rol;