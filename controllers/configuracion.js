import models from '../models';
import fs from 'fs'
export default {
    obtenerip: async (req,res,next) =>{
        try {
            var path = require("path")
            var fullpath = path.resolve("./archivos")
            const ruta = fullpath+"\\configuracion\\ip.txt"
            
            fs.readFile(ruta, 'utf8', (error, datos) => {
                if (error) throw error;
           
                res.status(200).json(datos);
            });
        } catch (e){
            res.status(500).send({
                message:'Ocurrió un error '+e
            });
            next(e);
        } 
        
    },
    
}
