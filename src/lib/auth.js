const { serializeUser } = require("passport");

module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }

};

// module.exports ={
//     roles(req, res, next) {
//         const rol = req.user.rolId
//         if(rol===1){
//          return next();
//         }
//         return res.redirect('/profile');
        
//         }



// }

