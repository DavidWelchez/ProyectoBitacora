
const express = require('express');
const router = express.Router();
const { isLoggedIn,isnotLoggedIn } = require('../lib/auth');

router.get('/',isnotLoggedIn, async (req, res) => {
    res.render('index');
});

module.exports = router;