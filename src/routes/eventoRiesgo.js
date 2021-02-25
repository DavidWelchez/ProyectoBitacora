const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 


//const { roles } = require('../lib/auth');      



router.get('/add', isLoggedIn,roles,(req, res) => {

    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
            

    res.render('eventoRiesgo/add',{
        layout: "dashboard",
        loginAdmin

    });
});

router.post('/add', async (req, res) => {
    const { EventoRiesgo } = req.body;
    const newEventoRiesgo = {
        EventoRiesgo
        
    };
    await pool.query('INSERT INTO eventoRiesgos set ?', [newEventoRiesgo]);
    req.flash('success', 'Evento de Riesgo guardado ');
    res.redirect('/eventoRiesgo');
});

router.get('/', isLoggedIn, roles, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
    const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos');
    res.render('eventoRiesgo/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        eventoRiesgos 
    });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const eventoR = await pool.query('SELECT * FROM factorRiesgos WHERE eventoRiesgoId = ? ',[id]);
    if (eventoR[0]==null){
        const { id } = req.params;
        await pool.query('DELETE FROM eventoRiesgos WHERE ID = ?', [id]);
        req.flash('success', 'Evento de Riesgo eliminado');
        res.redirect('/eventoRiesgo');
    
}else{
    req.flash('message', 'ERROR, este campo no puede ser eliminado');
res.redirect('/eventoRiesgo');

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
    const EventoRiesgo = await pool.query('SELECT * FROM eventoRiesgos WHERE id = ?', [id]);
  
    res.render('eventoRiesgo/edit', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        EventoRiesgo: EventoRiesgo[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { EventoRiesgo } = req.body;
    const neweventoRiesgo = {
        EventoRiesgo
        
    };
    await pool.query('UPDATE eventoRiesgos set ? WHERE id = ?', [neweventoRiesgo, id]);
    req.flash('success', 'Evento de Riesgo actualizado');
    res.redirect('/eventoRiesgo');
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

     const { EventoRiesgo } = req.body;
    const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos WHERE EventoRiesgo like ?','%' +[EventoRiesgo]+'%',);
    
    res.render('eventoRiesgo/buscar', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        eventoRiesgos 
    });
});

module.exports = router;