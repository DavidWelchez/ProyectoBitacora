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
    req.flash('success', 'Empleado guardado ');
    res.redirect('/empleado');
});

router.get('/',  async (req, res) => {
    const empleados = await pool.query('SELECT * FROM empleados');
    res.render('empleado/list', { empleados });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM empleados WHERE ID = ?', [id]);
    req.flash('success', 'Empleado eliminado');
    res.redirect('/empleado');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const empleados = await pool.query('SELECT * FROM empleados WHERE id = ?', [id]);
  
    res.render('empleado/edit', {empleado: empleados[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { empleado } = req.body;
    const newEmpleado = {
        empleado
        
    };
    await pool.query('UPDATE empleados set ? WHERE id = ?', [newEmpleado, id]);
    req.flash('success', 'Empleado actualizado');
    res.redirect('/empleado');
});

module.exports = router;