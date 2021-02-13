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

    res.render('proveedor/add',{
        layout: "dashboard",
        loginAdmin

    });
});

router.post('/add', async (req, res) => {
    const { proveedor } = req.body;
    const newproveedor= {
        proveedor
        
    };
    await pool.query('INSERT INTO proveedors set ?', [newproveedor]);
    req.flash('success', 'Proveedor  guardado ');
    res.redirect('/proveedor');
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
    const proveedor = await pool.query('SELECT * FROM proveedors');
    res.render('proveedor/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        proveedor 
    });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM proveedors WHERE ID = ?', [id]);
    req.flash('success', 'Proveedor eliminado');
    res.redirect('/proveedor');
});

router.get('/edit/:id', isLoggedIn,roles,async (req, res) => {
    const { id } = req.params;
    const proveedor = await pool.query('SELECT * FROM proveedors WHERE id = ?', [id]);
  
    res.render('proveedor/edit', {
        layout: "dashboard",
        
        proveedor: proveedor[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { proveedor } = req.body;
    const newproveedor = {
        proveedor
        
    };
    await pool.query('UPDATE proveedors set ? WHERE id = ?', [newproveedor, id]);
    req.flash('success', 'Proveedor actualizado');
    res.redirect('/proveedor');
});

module.exports = router;