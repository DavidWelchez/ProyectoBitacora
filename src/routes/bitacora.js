const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 
const { validationResult } = require("express-validator");
const shortid = require("shortid");
const bodyParser = require('body-parser');
      

// Opciones de configuración para multer 
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
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
 
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
      console.log(req.file);
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
  if (rol == "Admin") {
    loginAdmin = true;
  }
  if (rol == "General") {
    loginGeneral = true;
  }
  const formatYmd = date => date.toISOString().slice(0, 10);

  const bitacora = await pool.query(' SELECT bitacoras.id, bitacoras.fechaDeIncidencia,bitacoras.horaDeIncidencia,incidentes.incidente,plataformas.plataforma,eventos.evento,bitacoras.descripcion,u.fullname,ua.fullname as atendio,proveedors.proveedor,bitacoras.fechaSolucion, bitacoras.horaSolucion, bitacoras.estado,eventoRiesgos.EventoRiesgo,factorRiesgos.factor,bitacoras.archivo FROM bitacoras, users as u,users as ua, proveedors,plataformas, incidentes,factorRiesgos,eventos,eventoRiesgos where plataformas.incidenteId=incidentes.id and bitacoras.plataformaId=plataformas.id and bitacoras.eventoId=eventos.id and bitacoras.userId=u.id  and bitacoras.atendioid=ua.id and bitacoras.proveedorId=proveedors.id and factorRiesgos.eventoRiesgoId=eventoRiesgos.id and bitacoras.factorRiesgoId=factorRiesgos.id order by id desc');

  bitacora.forEach(element => {

    element.fechaDeIncidencia = formatYmd(element.fechaDeIncidencia)
    element.fechaSolucion = formatYmd(element.fechaSolucion)
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
    const bitacorafecha = await pool.query('SELECT * FROM vistaBi where fechaSolucion  between ? and ? or  fechaDeIncidencia between ? and ? order by fechaSolucion', [fecha1,fecha2,fecha1,fecha2]);
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
const path = require("path");
var xl = require('excel4node');
var pdfMake = require('pdfmake');
const pdf = require('html-pdf');
   
var wb = new xl.Workbook();

var ws = wb.addWorksheet('Bitacora');

var style = wb.createStyle({
  font: {
    
    size: 12,
  },
  cell:{
    fillColor: '#11bf0b',
  },
  numberFormat: '##0; (##0); -',
});
var style2 = wb.createStyle({
  font: {
    size: 12,
  },
  
    Color: '#11bf0b',

  numberFormat: '##0; (##0); -',
});
/*pdf*/

src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/pdfmake.min.js" ;integrity="sha512-HLbtvcctT6uyv5bExN/qekjQvFIl46bwjEq6PBvFogNfZ0YGVE+N3w6L+hGaJsGPWnMcAQ2qK8Itt43mGzGy8Q==" ;crossorigin="anonymous";
 src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/vfs_fonts.js" ;integrity="sha512-vv3EN6dNaQeEWDcxrKPFYSFba/kgm//IUnvLPMPadaUf5+ylZyx4cKxuc4HdBf0PPAlM7560DV63ZcolRJFPqA=="; crossorigin="anonymous" ;
    




router.get('/doc', isLoggedIn, async (req, res) => {
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
  const bitacora = await pool.query('SELECT * FROM vistaBi where fechaSolucion  between ? and ? or  fechaDeIncidencia between ? and ? order by fechaSolucion', [fecha1,fecha2,fecha1,fecha2]);
  bitacora.forEach(element => {
          
    element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
    element.fechaSolucion= formatYmd(element.fechaSolucion)
});
ws.cell(1, 6)
.string('BITÁCORA DE DEPARTAMENTO DE TECNOLOGÍA.')
 .style(style2);
 ws.cell(2, 7)
.string('Departamento Informática.')
 .style(style2);
ws.cell(4, 1)
.string('No.')
 .style(style);
  ws.cell(4, 2)
  .string('Fecha de incidencia')
   .style(style);

   ws.cell(4, 3)
  .string('Hora de incidencia')
   .style(style);

   ws.cell(4, 4)
  .string('Tipo plataforma')
   .style(style);

   ws.cell(4, 5)
  .string('Tipo incidente')
   .style(style);
   
   ws.cell(4, 6)
  .string('Tipo de evento')
   .style(style);

   ws.cell(4, 7)
  .string('Descripción')
   .style(style);

   ws.cell(4, 8)
  .string('Empleado reportó')
   .style(style);

   ws.cell(4, 9)
  .string('Empleado atendió')
   .style(style);

   ws.cell(4, 10)
  .string('Proveedor')
   .style(style);

   ws.cell(4, 11)
  .string('Fecha de solución')
   .style(style);

   ws.cell(4, 12)
  .string('Hora de solución')
   .style(style);

   ws.cell(4, 13)
  .string('Estado')
   .style(style);

   ws.cell(4, 14)
  .string('Evento de riesgo')
   .style(style);

   ws.cell(4, 15)
  .string('Factor de riesgo')
   .style(style);


    bitacora.forEach(element => {
      ws.cell(bitacora.indexOf(element)+5, 1)
      .number(bitacora.indexOf(element)+1)
    .style(style);

      ws.cell(bitacora.indexOf(element)+5, 2)
      .string(element.fechaDeIncidencia)
    .style(style);

    ws.cell(bitacora.indexOf(element)+5, 3)
      .string(element.horaDeIncidencia)
    .style(style);
  
    ws.cell(bitacora.indexOf(element)+5, 4)
      .string(element.incidente)
    .style(style);

    ws.cell(bitacora.indexOf(element)+5, 5)
    .string(element.plataforma)
  .style(style);

     ws.cell(bitacora.indexOf(element)+5, 6)
    .string(element.evento)
  .style(style);

  ws.cell(bitacora.indexOf(element)+5, 7)
  .string(element.descripcion)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 8)
.string(element.fullname)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 9)
.string(element.atendio)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 10)
.string(element.proveedor)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 11)
.string(element.fechaSolucion)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 12)
.string(element.horaSolucion)
.style(style);
  
ws.cell(bitacora.indexOf(element)+5, 13)
.string(element.estado)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 14)
.string(element.EventoRiesgo)
.style(style);

ws.cell(bitacora.indexOf(element)+5, 15)
.string(element.factor)
.style(style);

    });
   
  wb.write(path.join(__dirname, "../uploads/Bitacora.xlsx"));
  req.flash('success', 'Archivo creado con exito');
  res.redirect('/bitacora/doc');
});

router.get('/pdf', isLoggedIn, async (req, res) => {
  var loginAdmin = false;
  var loginGeneral = false;

  rol = req.user.rol;
  if(rol == "Admin") {
      loginAdmin = true;
      }
      if(rol == "General") {
          loginGeneral = true;
          }
  
  res.render('bitacora/pdf', { 
    layout: "dashboard",
    loginAdmin,
    loginGeneral,
      
     
  });
});

router.post('/pdfList', isLoggedIn, async (req, res) => {
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
  const bitacorapdf = await pool.query('SELECT * FROM vistaBi where fechaSolucion  between ? and ? or  fechaDeIncidencia between ? and ? order by fechaSolucion', [fecha1,fecha2,fecha1,fecha2]);
  bitacorapdf.forEach(element => {
        
      element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
      element.fechaSolucion= formatYmd(element.fechaSolucion)
  });
  res.render('bitacora/pdfList', { 
      
      layout: "pdf",
      loginAdmin,
      loginGeneral,
      bitacorapdf 
  });
});


router.get('/menu', isLoggedIn, async (req, res) => {
  var loginAdmin = false;
  var loginGeneral = false;

  rol = req.user.rol;
  if(rol == "Admin") {
      loginAdmin = true;
      }
      if(rol == "General") {
          loginGeneral = true;
          }
  
  res.render('bitacora/menu', { 
    layout: "dashboard",
    loginAdmin,
    loginGeneral,
      
     
  });
});
module.exports = router;