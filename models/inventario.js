import mongoose,{Schema} from 'mongoose';

const inventarioSchema = new Schema({
    descripcion:{type:String, maxlength:100,required:true,unique:true},
    detalleFarmacia: {type: Schema.ObjectId, ref:'detallefarmacias', required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
});
 
const Inventario = mongoose.model('inventarios',inventarioSchema);

export default Inventario;