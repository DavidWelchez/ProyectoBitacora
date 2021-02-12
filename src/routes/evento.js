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
            

    res.render('evento/add',{
        layout: "dashboard",
        loginAdmin

    });
});

router.post('/add', async (req, res) => {
    const { evento } = req.body;
    const newevento= {
        evento
        
    };
    await pool.query('INSERT INTO eventos set ?', [newevento]);
    req.flash('success', 'Evento  guardado ');
    res.redirect('/evento');
});

router.get('/', isLoggedIn, roles,async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rolId;
    if(rol == "1") {
        loginAdmin = true;
        }
        if(rol == "2") {
            loginGeneral = true;
            }
    const evento = await pool.query('SELECT * FROM eventos');
    res.render('evento/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        evento 
    });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM eventos WHERE ID = ?', [id]);
    req.flash('success', 'Evento eliminado');
    res.redirect('/evento');
});

router.get('/edit/:id', isLoggedIn,roles,async (req, res) => {
    const { id } = req.params;
    const evento = await pool.query('SELECT * FROM eventos WHERE id = ?', [id]);
  
    res.render('evento/edit', {
        layout: "dashboard",
        
        evento: evento[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { evento } = req.body;
    const newevento = {
        evento
        
    };
    await pool.query('UPDATE eventos set ? WHERE id = ?', [newevento, id]);
    req.flash('success', 'Evento actualizado');
    res.redirect('/evento');
});

module.exports = router;