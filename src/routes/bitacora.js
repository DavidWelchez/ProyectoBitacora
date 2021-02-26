const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 
const { validationResult } = require("express-validator");
const shortid = require("shortid");
const bodyParser = require('body-parser');
      
// this.express=express();
//  this.express.use(bodyParser.json());
// this.express.use(bodyParser.urlencoded({
//   extended:true
// }));
//this.express.use(this.subirArchivo.upload.any());
// const upload = multer({storage: multer.memoryStorage() });
// //MULTER
// subirArchivo = (req, res, next) => {
//   // Verificar que no existen errores de validación
//   const errores = validationResult(req);
//   const messages = [];
//   console.log('siioo');
//   if (!errores.isEmpty) {
//     errores.array().map((error) => {
//         console.log('if1');
   
//       messages.push({ message: error.msg, alertType: "danger" });
//     });

//     req.flash("message", messages);
//     res.redirect("/bitacora");
//   } else {
//     // Subir el archivo mediante Multer
//     upload(req, res, function (error) {
//       if (error) {
//           console.log('if2');
//         // Errores de Multer
//         if (error instanceof multer.MulterError) {
//           if (error.code === "LIMIT_FILE_SIZE") {
//             req.flash("message", [
//               {
                  
//                 message:
//                   "El tamaño del archivo es superior al límite. Máximo 30 mb",
//                 alertType: "danger",
                
//               }, 
//             ]);console.log('if3');
//           } else {
//             req.flash("message", [
//               { message: error.message, alertType: "danger" },
//             ]);
//           }
//         } else {
//           // Errores creado por el usuario
//           req.flash("message", [
//             { message: error.message, alertType: "danger" },
//           ]);
//         }
//         // Redireccionar y mostrar el error
//         res.redirect("/bitacora");
//         return;
//       } 
//     });
//   }
// };

// Opciones de configuración para multer en productos
const configuracionMulter = {
  
  // Tamaño máximo del archivo en bytes
  limits: {
    fileSize: 30000000,
  },
  
  // Dónde se almacena el archivo
  storage: (fileStorage = multer.diskStorage({
      
    destination: (req, res, cb) => {
      console.log('sii');
      cb(null, `${__dirname}../../uploads`);
    },
    filename: (req, file, cb) => {
      // Construir el nombre del archivo
      // iphone.png --> image/png --> ["image", "png"]
      // iphone.jpg --> image/jpeg
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  // Verificar el tipo de archivo mediante el mime type
  // https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types

};

// Función que sube el archivo
const upload = multer(configuracionMulter).single("archivo");

router.get('/add', isLoggedIn, async (req, res) => {

    var loginAdmin = false;
    var loginGeneral = false;
    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
            const plataformas = await pool.query('SELECT * FROM plataformas ');
            const eventos = await pool.query('SELECT * FROM eventos ');
            const usuarios = await pool.query('SELECT * FROM users ');
            const proveedores = await pool.query('SELECT * FROM proveedors ');
            const factorRiesgos = await pool.query('SELECT * FROM factorRiesgos ');

    res.render('bitacora/add',{
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        plataformas,
        eventos,
        usuarios,
        proveedores,
        factorRiesgos
        

    });
});

router.post('/add',upload, async (req, res) => {
  console.log(req.file);
  
     if (req.file==null) {
      const { fechaDeIncidencia,horaDeIncidencia,plataformaId,eventoId,descripcion,userId,
        atendioid,proveedorId,fechaSolucion,horaSolucion,estado,factorRiesgoId
    } = req.body;
    
  console.log(fechaDeIncidencia);
    const newbitacora = {
        fechaDeIncidencia,
        horaDeIncidencia,
        plataformaId,
        eventoId,
        descripcion,
        userId,
        atendioid,
        proveedorId,
        fechaSolucion,
        horaSolucion,
        estado,
        factorRiesgoId,
        
        
    };
   
    await pool.query('INSERT INTO bitacoras set ?', [newbitacora]);
    req.flash('success', 'bitacora guardado ');
    res.redirect('/bitacora');
     }else{
      const {filename}=req.file;
      const archivo= filename;
     const { fechaDeIncidencia,horaDeIncidencia,plataformaId,eventoId,descripcion,userId,
         atendioid,proveedorId,fechaSolucion,horaSolucion,estado,factorRiesgoId
     } = req.body;
     
   console.log(fechaDeIncidencia);
     const newbitacora = {
         fechaDeIncidencia,
         horaDeIncidencia,
         plataformaId,
         eventoId,
         descripcion,
         userId,
         atendioid,
         proveedorId,
         fechaSolucion,
         horaSolucion,
         estado,
         factorRiesgoId,
         archivo
         
     };
    
     await pool.query('INSERT INTO bitacoras set ?', [newbitacora]);
     req.flash('success', 'bitacora guardado ');
     res.redirect('/bitacora');
     }
     
});

router.get('/', isLoggedIn, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
            const formatYmd= date=> date.toISOString().slice(0,10);
           
const bitacora = await pool.query(' SELECT bitacoras.id, bitacoras.fechaDeIncidencia,bitacoras.horaDeIncidencia,incidentes.incidente,plataformas.plataforma,eventos.evento,bitacoras.descripcion,u.fullname,ua.fullname as atendio,proveedors.proveedor,bitacoras.fechaSolucion, bitacoras.horaSolucion, bitacoras.estado,eventoRiesgos.EventoRiesgo,factorRiesgos.factor,bitacoras.archivo FROM bitacoras, users as u,users as ua, proveedors,plataformas, incidentes,factorRiesgos,eventos,eventoRiesgos where plataformas.incidenteId=incidentes.id and bitacoras.plataformaId=plataformas.id and bitacoras.eventoId=eventos.id and bitacoras.userId=u.id  and bitacoras.atendioid=ua.id and bitacoras.proveedorId=proveedors.id and factorRiesgos.eventoRiesgoId=eventoRiesgos.id and bitacoras.factorRiesgoId=factorRiesgos.id ');
      
bitacora.forEach(element => {
          
          element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
          element.fechaSolucion= formatYmd(element.fechaSolucion)
      });


res.render('bitacora/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        bitacora 
    });
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM bitacoras WHERE ID = ?', [id]);
    req.flash('success', 'Bitacora eliminada');
    res.redirect('/bitacora');
});

router.get('/edit/:id', isLoggedIn,async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
            const formatYmd= date=> date.toISOString().slice(0,10);
    const { id } = req.params;
    const plataformas = await pool.query('SELECT * FROM plataformas ');
    const eventos = await pool.query('SELECT * FROM eventos ');
    const usuarios = await pool.query('SELECT * FROM users ');
    const proveedores = await pool.query('SELECT * FROM proveedors ');
    const factorRiesgos = await pool.query('SELECT * FROM factorRiesgos ');
    const bitacora = await pool.query('SELECT * FROM bitacoras WHERE id = ?', [id]);
    const plataforma1 = await pool.query('SELECT * FROM plataformas WHERE id = ?', [bitacora[0].plataformaId]);
    const eventos1 = await pool.query('SELECT * FROM eventos WHERE id = ?', [bitacora[0].eventoId]);
    const usuarioR = await pool.query('SELECT * FROM users WHERE id = ?', [bitacora[0].userId]);
    const usuarioA = await pool.query('SELECT * FROM users WHERE id = ?', [bitacora[0].atendioid]);
    const proveedores1 = await pool.query('SELECT * FROM proveedors WHERE id = ?', [bitacora[0].proveedorId]);
    const factorRiesgos1 = await pool.query('SELECT * FROM factorRiesgos WHERE id = ?', [bitacora[0].factorRiesgoId]);
    bitacora.forEach(element => {
          
      element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
      element.fechaSolucion= formatYmd(element.fechaSolucion)
  });
    res.render('bitacora/edit', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        plataformas,
        eventos,
        usuarios,
        proveedores,
        factorRiesgos,
        plataforma1: plataforma1[0],
        eventos1: eventos1[0],
        usuarioR: usuarioR[0],
        usuarioA:usuarioA[0],
        proveedores1: proveedores1[0],
        factorRiesgos1: factorRiesgos1[0],
        bitacora: bitacora[0]});
});

router.post('/edit/:id',upload, async (req, res) => {

    
    if (req.file==null) {
      const { id } = req.params;
      const { fechaDeIncidencia,horaDeIncidencia,plataformaId,eventoId,descripcion,userId,
        atendioid,proveedorId,fechaSolucion,horaSolucion,estado,factorRiesgoId
    } = req.body;
    
 
    const newbitacora = {
        fechaDeIncidencia,
        horaDeIncidencia,
        plataformaId,
        eventoId,
        descripcion,
        userId,
        atendioid,
        proveedorId,
        fechaSolucion,
        horaSolucion,
        estado,
        factorRiesgoId,
        
        
    };
   
    await pool.query('UPDATE bitacoras set ? WHERE id = ?', [newbitacora, id]);
    req.flash('success', 'bitacora actualizada');
    res.redirect('/bitacora');}
    else{
      const {filename}=req.file;
      const archivo= filename;
      const { id } = req.params;
      const { fechaDeIncidencia,horaDeIncidencia,plataformaId,eventoId,descripcion,userId,
        atendioid,proveedorId,fechaSolucion,horaSolucion,estado,factorRiesgoId
    } = req.body;
    
  console.log(fechaDeIncidencia);
    const newbitacora = {
        fechaDeIncidencia,
        horaDeIncidencia,
        plataformaId,
        eventoId,
        descripcion,
        userId,
        atendioid,
        proveedorId,
        fechaSolucion,
        horaSolucion,
        estado,
        factorRiesgoId,
        archivo
        
    };
    await pool.query('UPDATE bitacoras set ? WHERE id = ?', [newbitacora, id]);
    req.flash('success', 'bitacora actualizada');
    res.redirect('/bitacora');




    }
});


router.post('/buscarfecha', isLoggedIn, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }

     const { fecha1,fecha2 } = req.body;
     const formatYmd= date=> date.toISOString().slice(0,10);
    const bitacorafecha = await pool.query('SELECT * FROM vistaBi where fechaSolucion  between ? and ? or  fechaDeIncidencia between ? and ?', [fecha1,fecha2,fecha1,fecha2]);
    bitacorafecha.forEach(element => {
          
        element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
        element.fechaSolucion= formatYmd(element.fechaSolucion)
    });
    res.render('bitacora/buscarfecha', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        bitacorafecha 
    });
});

var xl = require('excel4node');

var wb = new xl.Workbook();

var ws = wb.addWorksheet('Bitacora');

var style = wb.createStyle({
  font: {
    
    size: 12,
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -',
});




router.get('/doc', isLoggedIn, roles,async (req, res) => {
  var loginAdmin = false;
  var loginGeneral = false;

  rol = req.user.rol;
  if(rol == "Admin") {
      loginAdmin = true;
      }
      if(rol == "General") {
          loginGeneral = true;
          }
  
  res.render('bitacora/doc', { 
      
      layout: "dashboard",
      loginAdmin,
      loginGeneral,
     
  });
});

router.post('/doc', async (req, res) => {
  const formatYmd= date=> date.toISOString().slice(0,10);
  const { fecha1,fecha2 } = req.body;
  const bitacora = await pool.query('SELECT * FROM vistaBi where fechaSolucion  between ? and ? or  fechaDeIncidencia between ? and ?', [fecha1,fecha2,fecha1,fecha2]);
  bitacora.forEach(element => {
          
    element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
    element.fechaSolucion= formatYmd(element.fechaSolucion)
});

  ws.cell(1, 2)
  .string('Fecha de incidencia')
   .style(style);

   ws.cell(1, 3)
  .string('Hora de incidencia')
   .style(style);

   ws.cell(1, 4)
  .string('Tipo plataforma')
   .style(style);

   ws.cell(1, 5)
  .string('Tipo incidente')
   .style(style);
   
   ws.cell(1, 6)
  .string('Tipo de evento')
   .style(style);

   ws.cell(1, 7)
  .string('Descripción')
   .style(style);

   ws.cell(1, 8)
  .string('Empleado reportó')
   .style(style);

   ws.cell(1, 9)
  .string('Empleado atendió')
   .style(style);

   ws.cell(1, 10)
  .string('Proveedor')
   .style(style);

   ws.cell(1, 11)
  .string('Fecha de solución')
   .style(style);

   ws.cell(1, 12)
  .string('Hora de solución')
   .style(style);

   ws.cell(1, 13)
  .string('Estado')
   .style(style);

   ws.cell(1, 14)
  .string('Evento de riesgo')
   .style(style);

   ws.cell(1, 15)
  .string('Factor de riesgo')
   .style(style);



    bitacora.forEach(element => {
     
let a=1;
     
     
      ws.cell(bitacora.indexOf(element)+2, 2)
      .string(element.fechaDeIncidencia)
    .style(style);

    ws.cell(bitacora.indexOf(element)+2, 3)
      .string(element.horaDeIncidencia)
    .style(style);
  
    ws.cell(bitacora.indexOf(element)+2, 4)
      .string(element.incidente)
    .style(style);

    ws.cell(bitacora.indexOf(element)+2, 5)
    .string(element.plataforma)
  .style(style);

     ws.cell(bitacora.indexOf(element)+2, 6)
    .string(element.evento)
  .style(style);

  ws.cell(bitacora.indexOf(element)+2, 7)
  .string(element.descripcion)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 8)
.string(element.fullname)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 9)
.string(element.atendio)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 10)
.string(element.proveedor)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 11)
.string(element.fechaSolucion)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 12)
.string(element.horaSolucion)
.style(style);
  
ws.cell(bitacora.indexOf(element)+2, 13)
.string(element.estado)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 14)
.string(element.EventoRiesgo)
.style(style);

ws.cell(bitacora.indexOf(element)+2, 15)
.string(element.factor)
.style(style);


  

a++;

    });


 
  // ws.cell(1, 1)
  // .number(100)
  // .style(style);
  
  // // Set value of cell B1 to 200 as a number type styled with paramaters of style
  // ws.cell(1, 2)
  // .number(200)
  // .style(style);
  
  // // Set value of cell C1 to a formula styled with paramaters of style
  // ws.cell(1, 3)
  // .formula('A1 + B1')
  // .style(style);
  
  // // Set value of cell A2 to 'string' styled with paramaters of style
  // ws.cell(2, 1)
  // .string('string')
  // .style(style);
  
  // // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
  // ws.cell(3, 1)
  // .bool(true)
  // .style(style)
  // .style({font: {size: 14}});
  
  

  
  wb.write('Bitacora.xlsx', function(err, stats) {
    if (err) {
      console.error(err);
    } else {
      console.log(stats); // Prints out an instance of a node.js fs.Stats object
    }
  });
  req.flash('success', 'Archivo creado con exito');
  res.redirect('/bitacora/doc');


});


  
module.exports = router;