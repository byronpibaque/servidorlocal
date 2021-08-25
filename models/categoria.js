import mongoose,{Schema} from 'mongoose';

const categoriaSchema = new Schema({
    nombre:{type:String, maxlength:50,unique:true,required:true},
    descripcion:{type:String, maxlength:100,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});

const Categoria = mongoose.model('categoria',categoriaSchema);

export default Categoria;