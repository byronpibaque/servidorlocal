import jwt from 'jsonwebtoken';
import Login from '../models/login'

async function checkToken(token){
    let __id = null;
    try{
        const {_id}= await jwt.decode(token);
        __id = _id;
    } catch (e){
        return false;
    }
    const user = await Login.findOne({_id:__id,estado:1});
    if (user){
        const token = jwt.sign({_id:__id},'clavesecretaparagenerartoken',{expiresIn:'1d'});
        return {token,rol:user.rol,codigoFarmacia:user.codigoFarmacia,codigoUsuario:user.codigoUsuario};
    } else {
        return false;
    }
}

export default {
    encode: async (_id,rol,email,codigoFarmacia,codigoUsuario) => {
        const token = jwt.sign({_id:_id,codigoFarmacia:codigoFarmacia,codigoUsuario:codigoUsuario,rol:rol,email:email},'clavesecretaparagenerartoken',{expiresIn: '1d'});
        return token;
    },
    decode: async (token) => {
        try {
            const {_id} = await jwt.verify(token,'clavesecretaparagenerartoken');
            const user = await Login.findOne({_id,estado:1});
            if (user){
                return user;
            } else{
                return false;
            }
        } catch (e){
            const newToken = await checkToken(token);
            return newToken;
        }
    }
}