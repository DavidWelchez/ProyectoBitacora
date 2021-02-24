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

// router.get('/edit/:id', isLoggedIn,async (req, res) => {
//     var loginAdmin = false;
//     var loginGeneral = false;

//     rol = req.user.rol;
//     if(rol == "Admin") {
//         loginAdmin = true;
//         }
//         if(rol == "General") {
//             loginGeneral = true;
//             }
//     const { id } = req.params;
//     const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos ');
//     const factor = await pool.query('SELECT * FROM factorRiesgos WHERE id = ?', [id]);
  
//     res.render('factorRiesgo/edit', {
//         layout: "dashboard",
//         loginAdmin,
//         loginGeneral,
//         eventoRiesgos,
//         factor: factor[0]});
// });

// router.post('/edit/:id', async (req, res) => {
//     const { id } = req.params;
//     const { factor, eventoRiesgoId } = req.body;
//     const newefactorRiesgo = {
//         factor,
//         eventoRiesgoId
        
//     };
//     await pool.query('UPDATE factorRiesgos set ? WHERE id = ?', [newefactorRiesgo, id]);
//     req.flash('success', 'Evento de Riesgo actualizado');
//     res.redirect('/factorRiesgo');
// });


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






  
module.exports = router;