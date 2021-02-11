module.exports ={
    roles(req, res, next) {
        const rol = req.user.rolId
        if(rol===1){
         return next();
        }
        return res.redirect('/profile');
        
        }

}