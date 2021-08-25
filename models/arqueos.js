import mongoose,{Schema} from 'mongoose';

const arqueosSquema = new Schema({
    codigoUsuario:{type: Schema.ObjectId, ref: 'usuarios',required:true },
    codigoFarmacia:{type: Schema.ObjectId, ref:'detallefarmacias'},
    seccion:{type:String,maxlength:15},
    totalCaja:{type:Number,required:true},
    totalBK03:{type:Number,required:true},
    estado: {type:Number,default:1},
    createdAt:{type:Date,default:Date.now},
    
});

const Arqueos = mongoose.model('arqueos',arqueosSquema);

export default Arqueos;