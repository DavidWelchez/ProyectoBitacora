const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 


//const { roles } = require('../lib/auth');      



router.get('/add', isLoggedIn,roles,(req, res) => {

    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rolId;
    if(rol == "1") {
        loginAdmin = true;
        }
        if(rol == "2") {
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

router.get('/', isLoggedIn, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rolId;
    if(rol == "1") {
        loginAdmin = true;
        }
        if(rol == "2") {
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
    await pool.query('DELETE FROM eventoRiesgos WHERE ID = ?', [id]);
    req.flash('success', 'Evento Riesgo eliminado');
    res.redirect('/eventoRiesgo');
});

router.get('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const EventoRiesgo = await pool.query('SELECT * FROM eventoRiesgos WHERE id = ?', [id]);
  
    res.render('eventoRiesgo/edit', {
        layout: "dashboard",
        
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

module.exports = router;