const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn, } = require('../lib/auth');
const { roles, } = require('../lib/rol');


router.get('/add', isLoggedIn, roles, async (req, res) => {

    var loginAdmin = false;
    var loginGeneral = false;
    rol = req.user.rol;
    if (rol == "Admin") {
        loginAdmin = true;
    }
    if (rol == "General") {
        loginGeneral = true;
    }
    const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos ');

    res.render('factorRiesgo/add', {
        layout: "dashboard",
        loginAdmin,
        eventoRiesgos

    });
});

router.post('/add/', async (req, res) => {

    const { factor, eventoRiesgoId } = req.body;

    const newfactorRiesgo = {
        factor,
        eventoRiesgoId

    };
    console.log(newfactorRiesgo)
    await pool.query('INSERT INTO factorRiesgos set ?', [newfactorRiesgo]);
    req.flash('success', 'Factor de Riesgo guardado ');
    res.redirect('/factorRiesgo');
});

router.get('/', isLoggedIn, roles, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if (rol == "Admin") {
        loginAdmin = true;
    }
    if (rol == "General") {
        loginGeneral = true;
    }
    const factorRiesgos = await pool.query('SELECT factorRiesgos.id, factorRiesgos.factor, eventoRiesgos.EventoRiesgo FROM factorRiesgos, eventoRiesgos where factorRiesgos.eventoRiesgoId=eventoRiesgos.id');
    res.render('factorRiesgo/list', {

        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        factorRiesgos
    });
});


router.get('/delete/:id', isLoggedIn, roles, async (req, res) => {
    const { id } = req.params;
    const factorRiesgos = await pool.query('SELECT * FROM bitacoras WHERE factorRiesgoId = ? ', [id]);
    if (factorRiesgos[0] == null) {
        const { id } = req.params;
        await pool.query('DELETE FROM factorRiesgos WHERE ID = ?', [id]);
        req.flash('success', 'Factor de  Riesgo eliminado');
        res.redirect('/factorRiesgo');

    } else {
        req.flash('message', 'ERROR, este campo no puede ser eliminado');
        res.redirect('/factorRiesgo');

    }

});

router.get('/edit/:id', isLoggedIn, roles, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if (rol == "Admin") {
        loginAdmin = true;
    }
    if (rol == "General") {
        loginGeneral = true;
    }
    const { id } = req.params;
    const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos ');
    const factor = await pool.query('SELECT * FROM factorRiesgos WHERE id = ?', [id]);
    const eventoRiesgos1 = await pool.query('SELECT * FROM eventoRiesgos WHERE id = ?', [factor[0].eventoRiesgoId]);
    res.render('factorRiesgo/edit', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        eventoRiesgos,
        eventoRiesgos1: eventoRiesgos1[0],

        factor: factor[0]
    });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { factor, eventoRiesgoId } = req.body;
    const newefactorRiesgo = {
        factor,
        eventoRiesgoId

    };
    await pool.query('UPDATE factorRiesgos set ? WHERE id = ?', [newefactorRiesgo, id]);
    req.flash('success', 'Factor de Riesgo actualizado');
    res.redirect('/factorRiesgo');
});

router.post('/buscar', isLoggedIn, roles, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if (rol == "Admin") {
        loginAdmin = true;
    }
    if (rol == "General") {
        loginGeneral = true;
    }

    const { factor } = req.body;
    const factorR = await pool.query('SELECT factorRiesgos.id, factorRiesgos.factor, eventoRiesgos.EventoRiesgo FROM factorRiesgos, eventoRiesgos where factorRiesgos.eventoRiesgoId=eventoRiesgos.id and factor like ?', '%' + [factor] + '%',);

    res.render('factorRiesgo/buscar', {

        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        factorR
    });
});

module.exports = router;