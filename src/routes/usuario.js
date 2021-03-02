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
    const users = await pool.query('SELECT * FROM bitacoras WHERE userId = ? ',[id]);
    const atendio = await pool.query('SELECT * FROM bitacoras WHERE atendioid = ? ',[id]);
    if (users[0]==null){
        if (atendio[0]==null){
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE ID = ?', [id]);
        req.flash('success', 'Usuario eliminado');
    res.redirect('/usuario');
    
}else{
    req.flash('message', 'ERROR, este campo no puede ser eliminado');
res.redirect('/usuario');

}
}
else{
    req.flash('message', 'ERROR, este campo no puede ser eliminado');
res.redirect('/usuario');

}

  
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
    req.flash('success', 'Contraseña actualizada');
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



router.get('/perfil', isLoggedIn, async (req, res) => {
    var loginAdmin = false;
    var loginGeneral = false;

    rol = req.user.rol;
    if(rol == "Admin") {
        loginAdmin = true;
        }
        if(rol == "General") {
            loginGeneral = true;
            }
    const perfilusuario = req.user;
    res.render('usuario/perfil', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        perfilusuario 
    });
});



router.post('/editperfil/:id', async (req, res) => {
    const { id } = req.params;
    const { fullname } = req.body;
    const newusuario = {
        fullname,
        

        
    };
    await pool.query('UPDATE users set ? WHERE id = ?', [newusuario, id]);
    req.flash('success', 'Usuario actualizado');
    res.redirect('/usuario/perfil');
});




router.post('/editpassperfil/:id', async (req, res) => {
    const { id } = req.params;
    const { password,newpassword, confirmpassword} = req.body;

    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length > 0) {
      const user = rows[0];
      const validPassword = await helpers.matchPassword(password, user.password)
      if (validPassword ) {
          if (newpassword == confirmpassword) {
            const newpass= {
                password
                
            };
            newpass.password = await helpers.encryptPassword(newpassword);
            await pool.query('UPDATE users set ? WHERE id = ?', [newpass, id]);
            req.flash('success', 'Contraseña actualizada');
            res.redirect('/usuario/perfil'); 
          }else{
             req.flash('message', 'Contraseñas no coinciden');
             res.redirect('/usuario/perfil#contra'); 
          }
        
      } else {
         req.flash('message', 'Contraseña actual es incorrecta');
         res.redirect('/usuario/perfil#contra');       }
    } 


    
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

     const { fullname } = req.body;
    const usuario = await pool.query('SELECT * FROM users WHERE fullname  like ?','%' +[fullname]+'%',);

    res.render('usuario/buscar', { 
        
        layout: "dashboard",
        loginAdmin,
        loginGeneral,
        usuario 
    });
});




module.exports = router;