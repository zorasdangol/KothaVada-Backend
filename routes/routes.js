const express = require('express');

const router = express.Router();
//Middle ware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

router.use('/users', require('./auth'));
router.use('/rooms', require('./rooms'));
router.use('/rents', require('./rents'));

module.exports = router;