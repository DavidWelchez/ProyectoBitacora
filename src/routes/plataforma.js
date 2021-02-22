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
    req.flash('success', 'Plataforma guardada.');
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

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const plataforma = await pool.query('SELECT * FROM bitacoras WHERE plataformaId = ? ',[id]);
    if (plataforma[0]==null){
        const { id } = req.params;
        await pool.query('DELETE FROM plataformas WHERE ID = ?', [id]);
        req.flash('success', 'Plataforma eliminado');
        res.redirect('/plataforma');
    
}else{
    req.flash('message', 'ERROR, este campo no puede ser eliminado');
res.redirect('/plataforma');

}
  
});

router.get('/edit/:id', isLoggedIn,roles,async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
    const { id } = req.params;
    const incidente = await pool.query('SELECT * FROM incidentes ');
    const plataforma = await pool.query('SELECT * FROM plataformas WHERE id = ?', [id]);
    res.render('plataforma/edit', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        incidente,
        plataforma: plataforma[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;

    const { plataforma, incidenteId } = req.body;
    const neweplataforma = {
        plataforma,
        incidenteId
        
    };
    await pool.query('UPDATE plataformas set ? WHERE id = ?', [neweplataforma, id]);
    req.flash('success', 'Plataforma actualizado');
    res.redirect('/plataforma');
});

router.post('/buscar', isLoggedIn,roles, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }

     const { plataforma } = req.body;
    const plataformas = await pool.query('SELECT plataformas.id, plataformas.plataforma, incidentes.incidente  FROM plataformas, incidentes where plataformas.incidenteId=incidentes.id  and plataforma= ?',[plataforma] );
 
    res.render('plataforma/buscar', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        plataformas
    });
});

module.exports = router;