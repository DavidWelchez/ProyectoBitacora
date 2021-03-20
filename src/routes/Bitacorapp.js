const express = require('express');
const router = express.Router();
const pool = require('../database');

const cors = require('cors');

router.use(cors());
router.use(express.json());



router.get('/list' , async (req, res) => {
  const formatYmd= date=> date.toISOString().slice(0,10);
    
  const bitacora = await pool.query(' SELECT bitacoras.id, bitacoras.fechaDeIncidencia,bitacoras.horaDeIncidencia,incidentes.incidente,plataformas.plataforma,eventos.evento,bitacoras.descripcion,u.fullname,ua.fullname as atendio,proveedors.proveedor,bitacoras.fechaSolucion, bitacoras.horaSolucion, bitacoras.estado,eventoRiesgos.EventoRiesgo,factorRiesgos.factor,bitacoras.archivo FROM bitacoras, users as u,users as ua, proveedors,plataformas, incidentes,factorRiesgos,eventos,eventoRiesgos where plataformas.incidenteId=incidentes.id and bitacoras.plataformaId=plataformas.id and bitacoras.eventoId=eventos.id and bitacoras.userId=u.id  and bitacoras.atendioid=ua.id and bitacoras.proveedorId=proveedors.id and factorRiesgos.eventoRiesgoId=eventoRiesgos.id and bitacoras.factorRiesgoId=factorRiesgos.id ');
      
bitacora.forEach(element => {
          
          element.fechaDeIncidencia= formatYmd(element.fechaDeIncidencia)
          element.fechaSolucion= formatYmd(element.fechaSolucion)
      });

  
      res.json(bitacora)
  
});

router.get('/addPlataforma' , async (req, res) => {
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
    const query = "INSERT INTO bitacoras SET ?";  
    pool.query(query, obj, function(error, results, fields){
       res.json(results.insertId)
    });
});





module.exports = router;