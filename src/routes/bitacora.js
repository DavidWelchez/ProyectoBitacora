const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 
      



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

router.post('/add/', async (req, res) => {
  
    const { fechaDeIncidencia,horaDeIncidencia,plataformaId,eventoId,descripcion,userId,
        atendioid,proveedorId,fechaSolucion,horaSolucion,estado,factorRiesgoId,
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
        factorRiesgoId
        
    };
   
    await pool.query('INSERT INTO bitacoras set ?', [newbitacora]);
    req.flash('success', 'bitacora guardado ');
    res.redirect('/bitacora');
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
    const bitacora = await pool.query(' SELECT bitacoras.id, bitacoras.fechaDeIncidencia,bitacoras.horaDeIncidencia,incidentes.incidente,plataformas.plataforma,eventos.evento,bitacoras.descripcion,u.fullname,ua.fullname as atendio,proveedors.proveedor,bitacoras.fechaSolucion, bitacoras.horaSolucion, bitacoras.estado,eventoRiesgos.EventoRiesgo,factorRiesgos.factor FROM bitacoras, users as u,users as ua, proveedors,plataformas, incidentes,factorRiesgos,eventos,eventoRiesgos where plataformas.incidenteId=incidentes.id and bitacoras.plataformaId=plataformas.id and bitacoras.eventoId=eventos.id and bitacoras.userId=u.id  and bitacoras.atendioid=ua.id and bitacoras.proveedorId=proveedors.id and factorRiesgos.eventoRiesgoId=eventoRiesgos.id and bitacoras.factorRiesgoId=factorRiesgos.id ');
    res.render('bitacora/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        bitacora 
    });
});

// router.get('/delete/:id',isLoggedIn, async (req, res) => {
//     const { id } = req.params;
//     await pool.query('DELETE FROM factorRiesgos WHERE ID = ?', [id]);
//     req.flash('success', 'Factor de  Riesgo eliminado');
//     res.redirect('/factorRiesgo');
// });

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

module.exports = router;