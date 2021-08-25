import express from 'express';

import morgan from 'morgan';

import cors from 'cors';

import path from 'path';

import mongoose from 'mongoose';

import router from './routes';


//Conexión a la base de datos MongoDB
mongoose.Promise=global.Promise;
// const dbUrl = 'mongodb://localhost:27017/dbSistemas';
const dbUrl = 'mongodb+srv://byron:Byron9009@sistemaventas-crznc.mongodb.net/puntoventa?retryWrites=true&w=majority';
mongoose.connect(dbUrl, {useCreateIndex:true, useNewUrlParser: true,useUnifiedTopology: true})
.then(mongoose => console.log('Se ha logrado conectar con la base de datos en MONGODB..'))
.catch(err => console.log(err));


const app=express();
app.use(morgan('dev'));
app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
var bodyParser = require('body-parser');
app.use( bodyParser.json({limit: '50mb'}) );
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));
app.use(express.static(path.join(__dirname,'public')))



app.use('/api',router);
app.set('port',process.env.PORT || 25000);

app.listen(app.get('port'),()=>{
    console.log('Se ha levantado el servidor de facturacion electronica en el puerto: ' + app.get('port')+"\nPor favor no cerrar esta ventana...");
}); 