const express = require('express');
const router = express.Router();
const pool = require('../database');
const multer = require('multer');
const cors = require('cors');
const shortid = require("shortid");
router.use(cors());
router.use(express.json());

// Opciones de configuración para multer 
const configuracionMulter = {
  
  // Tamaño máximo del archivo en bytes
  limits: {
    fileSize: 30000000,
  },
  
  // Dónde se almacena el archivo
  storage: (fileStorage = multer.diskStorage({
      
    destination: (req, res, cb) => {
     
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
 
};

// Función que sube el archivo
var upload = multer(configuracionMulter).single("archivo");

//MULTER
exports.subirImagen = (req, res, next) => {
  // Verificar que no existen errores de validación
  const errores = validationResult(req);
  const messages = [];

  if (!errores.isEmpty) {
    errores.array().map((error) => {
      messages.push({ message: error.msg, alertType: "danger" });
    });

    req.flash("messages", messages);
    res.redirect("/miperfil");
  } else {
    // Subir el archivo mediante Multer
    upload(req, res, function (error) {
 
    });
  }
};



router.get('/list' , async (req, res) => {
  const formatYmd= date=> date.toISOString().slice(0,10);
    
  const bitacora = await pool.query(' SELECT bitacoras.id, bitacoras.fechaDeIncidencia,bitacoras.horaDeIncidencia,incidentes.incidente,plataformas.plataforma,eventos.evento,bitacoras.descripcion,u.fullname,ua.fullname as atendio,proveedors.proveedor,bitacoras.fechaSolucion, bitacoras.horaSolucion, bitacoras.estado,eventoRiesgos.EventoRiesgo,factorRiesgos.factor,bitacoras.archivo FROM bitacoras, users as u,users as ua, proveedors,plataformas, incidentes,factorRiesgos,eventos,eventoRiesgos where plataformas.incidenteId=incidentes.id and bitacoras.plataformaId=plataformas.id and bitacoras.eventoId=eventos.id and bitacoras.userId=u.id  and bitacoras.atendioid=ua.id and bitacoras.proveedorId=proveedors.id and factorRiesgos.eventoRiesgoId=eventoRiesgos.id and bitacoras.factorRiesgoId=factorRiesgos.id  order by id desc');
      
bitacora.forEach(element => {
          
          element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
          element.fechaSolucion= formatYmd(element.fechaSolucion)
      });

  
      res.json(bitacora)
  
});

router.get('/listPlataforma' , async (req, res) => {
  const plataformas = await pool.query('SELECT * FROM plataformas ');
      res.json(plataformas)
  
});

router.get('/listEventos' , async (req, res) => {
  const eventos = await pool.query('SELECT * FROM eventos ');
      res.json(eventos)
  
});
router.get('/listUsuarios' , async (req, res) => {
  const usuarios = await pool.query('SELECT * FROM users ');
      res.json(usuarios)
  
});
router.get('/listProveedores' , async (req, res) => {
  const proveedores = await pool.query('SELECT * FROM proveedors ');
      res.json(proveedores)
  
});
router.get('/listFactorRiesgos' , async (req, res) => {
  const factorRiesgos = await pool.query('SELECT * FROM factorRiesgos ');
      res.json(factorRiesgos)
  
});


router.post('/addBitacora' , (req, res) => {
  
    const obj = req.body

    //  req.file=obj.archivo

    // upload(req, res, function (error) {
    //     console.log(req.file)
    // });
    // console.log(obj.archivo.name);
    // console.log(upload);
    // // const {filename}=req.file;
    // //   const archivo= uri;


    const query = "INSERT INTO bitacoras SET ?";  
   pool.query(query, obj, function(error, results, fields){
       res.json(results.insertId)
    });
});

/** */
router.get('/edit/:bitacoraid', async (req, res) => {
  const formatYmd= date=> date.toISOString().slice(0,10);
  const { bitacoraid } = req.params;
  const bitacora = await pool.query('SELECT * FROM bitacoras WHERE id = ?', [bitacoraid]);      
bitacora.forEach(element => {
          
          element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
          element.fechaSolucion= formatYmd(element.fechaSolucion)
      });

  
      res.json(bitacora)
  
});



router.post('/edit/:bitacoraid' ,(req, res) => {
  const obj = req.body
  const { bitacoraid } = req.params;
 const query =('UPDATE bitacoras set ? WHERE id = ?');
  //const query = "INSERT INTO bitacoras SET ?";  
  pool.query (query, [obj, bitacoraid], function(error, results, fields){
     res.json(results.insertId)
  });
});

router.post('/delete/:bitacoraid', async (req, res) => {
  const { bitacoraid } = req.params;
  await pool.query('DELETE FROM bitacoras WHERE ID = ?', [bitacoraid]);
 

  
  
});


module.exports = router;