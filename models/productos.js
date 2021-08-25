import mongoose,{Schema} from 'mongoose';
const productoSchema = new Schema({
    
    codigoBarras:{type:String,maxlength:50},
    nombre:{ type:String,maxlength:100},
    nombreComercial:{ type:String,maxlength:100},
    stock: {type:Number},
    fraccionesTotales: {type:Number},
    fraccionCaja: {type:Number},
    fechaCaducidad:{type:String,maxlength:50},
    costoNeto:{type:Number},
    pvp:{type:Number},
    precioUni:{type:Number,default:0},
    descuento:{type:Number},
    iva:{type:Number,default:0},
    codigoCategoria:{type: Schema.ObjectId, ref: 'categorias' },
    codigoLaboratorio:{type: Schema.ObjectId, ref: 'laboratorios'},
    codigoPresentacion:{type: Schema.ObjectId, ref: 'presentacions'},
    codigoInventario:{type: Schema.ObjectId, ref: 'inventarios' },
    estado: { type:Number, default:1},
    createdAt: { type: Date, default: Date.now }
});
const Producto = mongoose.model('productos',productoSchema);
export default Producto;