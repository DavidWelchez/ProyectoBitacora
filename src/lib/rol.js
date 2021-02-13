module.exports ={
    roles(req, res, next) {
        const rol = req.user.rol
        if(rol==='Admin'){
         return next();
        }
        return res.redirect('/profile');
        
        }

}