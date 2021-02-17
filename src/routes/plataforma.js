const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 


//const { roles } = require('../lib/auth');      



router.get('/add', isLoggedIn,roles,async (req, res) => {

    var loginAdmin = false;
    var loginGeneral = false;
    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
            const incidentes = await pool.query('SELECT * FROM incidentes ');

    res.render('plataforma/add',{
        layout: "dashboard",
        loginAdmin,
        incidentes

    });
});

router.post('/add/', async (req, res) => {
  
    const { plataforma,incidenteId } = req.body;

    const newplataforma = {
        plataforma,
        incidenteId
        
    };
    
    await pool.query('INSERT INTO plataformas set ?', [newplataforma]);
    req.flash('success', 'Platafora guardado ');
    res.redirect('/plataforma');
});

router.get('/', isLoggedIn,roles, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
    const plataforma = await pool.query('SELECT plataformas.id, plataformas.plataforma, incidentes.incidente  FROM plataformas, incidentes where plataformas.incidenteId=incidentes.id');
    res.render('plataforma/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        plataforma
    });
});

// router.get('/delete/:id',isLoggedIn,roles, async (req, res) => {
//     const { id } = req.params;
//     await pool.query('DELETE FROM factorRiesgos WHERE ID = ?', [id]);
//     req.flash('success', 'Factor de  Riesgo eliminado');
//     res.redirect('/factorRiesgo');
// });

// router.get('/edit/:id', isLoggedIn,roles,async (req, res) => {
//     const { id } = req.params;
//     const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos ');
//     const factor = await pool.query('SELECT * FROM factorRiesgos WHERE id = ?', [id]);
  
//     res.render('factorRiesgo/edit', {
//         layout: "dashboard",
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