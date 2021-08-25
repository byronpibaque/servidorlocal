import mongoose, {Schema} from 'mongoose';
const farmaciaSchema = new Schema({
    descripcion: { type:String,maxlength:50,required:true},
    propietario: { type:String,maxlength:50,required:true},
    estado: { type:Number, default:1},
	createdAt: { type: Date, default: Date.now}
});

const Farmacias = mongoose.model('farmacias',farmaciaSchema);
export default Farmacias;