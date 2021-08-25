var nodemailer = require('nodemailer');
// email sender function
exports.sendEmail = function(req, res){
    const {email,mensaje,asunto,claveAcceso,rutaXml,rutaPdf} = req.body;
// Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'tuahorrogi@gmail.com',
            pass: 'Byron9009'
        }
    }); 
    // Definimos el email
    var mailOptions = {
        from: 'tuahorrogi@gmail.com',
        to: email,
        subject: asunto,
        text: mensaje,
        attachments: [
            {
                //archivo XML
                filename:claveAcceso+'.xml',
                path:rutaXml
            },
            {
                filename:claveAcceso+'.pdf',
                path:rutaPdf 
            }
        ]
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
           
            res.send(500, error.message);
        } else {
           
            res.status(200).jsonp('Enviado');  
        }
    });
};
    
exports.enviar = function(req, res){
    var nodeoutlook = require('nodejs-nodemailer-outlook');
    nodeoutlook.sendEmail({
      auth: {
          user: "bk03@outlook.es",
          pass: "Byron9009"
      },
      from: 'bk03@outlook.es',
      to: 'bepibaque@gmail.com',
      subject: 'BK03 - SISTEMA DE FACTURACIÓN!',
    //   html: '<b>Gracias por su compra!</b>',
      text: 'Documento electrónico.',
    //   replyTo: 'receiverXXX@gmail.com',
    //   attachments: [
    //         {   // filename and content type is derived from path
    //             filename: '',
    //             path: ''
    //         }
    //     ],
      onError: (e) => res.status(500).send(e),
      onSuccess: (i) => res.status(200).send("OK")
  }  );
};