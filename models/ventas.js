import mongoose,{Schema} from 'mongoose';

const ventaSchema = new Schema({
    serieComprobante: { type:String,maxlength:10},
    numComprobante: { type:String,maxlength:25,required:true},
    codigoImpuesto:{type:String, max:10,required:true},
    impuesto:{ type:Number, required:true},
    total:{ type:Number, required:true},
    detalles: [{
        _id:{
            type:String,
            required:true
        },
        codigoInventario:{type: Schema.ObjectId, ref: 'inventarios',required:true},
        producto:{
            type:String,
            required:true
        },
       
        cantidad:{
            type:Number,
            required:true
        },
        fracciones:{
            type:Number,
            required:true 
        },
        precioVenta:{
            type:Number,
            required:true
        },
        precioUni:{
            type:Number,
            required:true
        },
        descuento:{
            type:Number,
            required:true
        },
		iva:{
            type:Number,
            required:true
        }
    }],
    codigoTipoComprobante:{type: Schema.ObjectId, ref: 'tipocomprobantes',required:true },
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codgioPersona:{ type: Schema.ObjectId, ref: 'personas',required:true },
    codigoFarmacia:{ type: Schema.ObjectId, ref: 'detallefarmacias'}, 
    formapago:{type:String, max:50,required:true},
    claveAcceso:{type:String, max:100},
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const Venta = mongoose.model('ventas',ventaSchema);
export default Venta;