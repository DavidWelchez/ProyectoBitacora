const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn ,} = require('../lib/auth'); 
const { roles ,} = require('../lib/rol'); 
const helpers = require('../lib/helpers');


//const { roles } = require('../lib/auth');      



// router.get('/add', isLoggedIn,roles,async (req, res) => {

//     var loginAdmin = false;
//     var loginGeneral = false;

//     rol = req.user.rolId;
//     if(rol == "1") {
//         loginAdmin = true;
//         }
//         if(rol == "2") {
//             loginGeneral = true;
//             }
//             const eventoRiesgos = await pool.query('SELECT * FROM eventoRiesgos ');

//     res.render('factorRiesgo/add',{
//         layout: "dashboard",
//         loginAdmin,
//         eventoRiesgos

//     });
// });

// router.post('/add/', async (req, res) => {
  
//     const { factor,eventoRiesgoId } = req.body;

//     const newfactorRiesgo = {
//         factor,
//         eventoRiesgoId
        
//     };
//     console.log(newfactorRiesgo)
//     await pool.query('INSERT INTO factorRiesgos set ?', [newfactorRiesgo]);
//     req.flash('success', 'Evento de Riesgo guardado ');
//     res.redirect('/factorRiesgo');
// });

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
    const usuario = await pool.query('SELECT * FROM users');
    res.render('usuario/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        usuario 
    });
});

router.get('/delete/:id',isLoggedIn,roles, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);
    req.flash('success', 'Usuario eliminado');
    res.redirect('/usuario');
});

router.get('/editpass/:id', isLoggedIn,roles,async (req, res) => {
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
   
    const usuario = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  
    res.render('usuario/editpass', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        usuario: usuario[0]});
});

router.post('/editpass/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const newusuario = {
        password
        
    };
    newusuario.password = await helpers.encryptPassword(password);
    await pool.query('UPDATE users set ? WHERE id = ?', [newusuario, id]);
    req.flash('success', 'Contrasena actualizado');
    res.redirect('/usuario');
});

router.get('/edit/:id', isLoggedIn,roles,async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;
    var rolAdmin = false;
    var rolGeneral = false;




    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }

    const { id } = req.params;
    const usuario = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if(usuario[0].rol == "Admin") {
        rolAdmin = true;
        }
        if(usuario[0].rol == "General") {
            rolGeneral = true;
            }
    res.render('usuario/edit', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        rolAdmin,
        rolGeneral,
        usuario: usuario[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { fullname,rol } = req.body;
    const newusuario = {
        fullname,
        rol

        
    };
    await pool.query('UPDATE users set ? WHERE id = ?', [newusuario, id]);
    req.flash('success', 'Usuario actualizado');
    res.redirect('/usuario');
});

module.exports = router;