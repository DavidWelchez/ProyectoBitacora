const express = require('express');
const router = express.Router();

const pool = require('../database');
//const { isLoggedIn } = require('../lib/auth');

router.get('/add', (req, res) => {
    res.render('empleado/add');
});

router.post('/add', async (req, res) => {
    const { empleado } = req.body;
    const newEmpleado = {
        empleado
        
    };
    await pool.query('INSERT INTO empleados set ?', [newEmpleado]);
    //req.flash('success', 'Link Saved Successfully');
    res.redirect('/empleado');
});

router.get('/',  async (req, res) => {
    const empleados = await pool.query('SELECT * FROM empleados');
    res.render('empleado/list', { empleados });
});
/*
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});*/

module.exports = router;