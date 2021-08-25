import mongoose,{Schema} from 'mongoose';
const farmaciaSchema = new Schema({
    codigoFarmacias:{type: Schema.ObjectId, ref: 'farmacias',required:true },
    correo:{type:String},
    descripcion:{ type:String,maxlength:50,required:true,unique:true},
    num_establecimiento: {type:String,maxlength:3,required:true},
    ubicacion: {type:String,maxlength:100,required:true},
    codigoLider:{type: Schema.ObjectId, ref: 'usuarios' },
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoSupervisor:{type: Schema.ObjectId, ref: 'usuarios' },
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const Farmacia = mongoose.model('detallefarmacias',farmaciaSchema);
export default Farmacia;