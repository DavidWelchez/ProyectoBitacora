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
            

    res.render('incidente/add',{
        layout: "dashboard",
        loginAdmin

    });
});

router.post('/add', async (req, res) => {
    const { incidente } = req.body;
    const newincidente= {
        incidente
        
    };
    await pool.query('INSERT INTO incidentes set ?', [newincidente]);
    req.flash('success', 'Incidente  guardado ');
    res.redirect('/incidente');
});

router.get('/', isLoggedIn, roles,async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
    const incidente = await pool.query('SELECT * FROM incidentes');
    res.render('incidente/list', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        incidente 
    });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const incidente = await pool.query('SELECT * FROM plataformas WHERE incidenteId = ? ',[id]);
    if (incidente[0]==null){
        const { id } = req.params;
        await pool.query('DELETE FROM incidentes WHERE ID = ?', [id]);
        req.flash('success', 'Incidente eliminado');
        res.redirect('/incidente');
    
}else{
    req.flash('message', 'ERROR, este campo no puede ser eliminado');
res.redirect('/incidente');

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
    const incidente = await pool.query('SELECT * FROM incidentes WHERE id = ?', [id]);
  
    res.render('incidente/edit', {
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        
        incidente: incidente[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { incidente } = req.body;
    const newincidente = {
        incidente
        
    };
    await pool.query('UPDATE incidentes set ? WHERE id = ?', [newincidente, id]);
    req.flash('success', 'incidente actualizado');
    res.redirect('/incidente');
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

     const { incidente } = req.body;
    const incidentes = await pool.query('SELECT * FROM incidentes WHERE incidente like ?','%' +[incidente]+'%',);
    
    res.render('incidente/buscar', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        incidentes 
    });
});



module.exports = router;