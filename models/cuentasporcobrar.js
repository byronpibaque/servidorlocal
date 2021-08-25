import mongoose,{Schema} from 'mongoose';
const ctasCobrar = new Schema({
    codigoVenta:{type: Schema.ObjectId, ref: 'ventas',required:true },
    numComprobante:{ type:String,maxlength:50},
    descripcion:{ type:String,maxlength:50},
    plazo: {type:String,maxlength:5,required:true},
    tiempo: {type:String,maxlength:5,required:true},
    total:{ type:Number, required:true},
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoPersona:{ type: Schema.ObjectId, ref: 'personas',required:true },
    codigoFarmacia:{ type: Schema.ObjectId, ref: 'detallefarmacias'}, 
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const Farmacia = mongoose.model('cuentasporcobrar',ctasCobrar);
export default Farmacia;