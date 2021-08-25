import mongoose,{Schema} from 'mongoose';
const LoginSchema = new Schema({
    email: {type: String,maxlength:100},
    password: {type:String, maxlength:64},
    estado:{type:Number,default:1},
    codigoFarmacia: {type: Schema.ObjectId, ref:'detallefarmacias'},
    codigoUsuario: {type: Schema.ObjectId, ref:'usuarios'},
    rol :{type: Schema.ObjectId, ref:'rols'},
    createdAt:{type:Date,default:Date.now}
});
const Login = mongoose.model('login',LoginSchema);
export default Login; 