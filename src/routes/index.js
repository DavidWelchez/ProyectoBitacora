
const express = require('express');
const router = express.Router();
const { isLoggedIn,isnotLoggedIn } = require('../lib/auth');

router.get('/', async (req, res) => {
    res.render('index');
});

module.exports = router;