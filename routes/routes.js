const express = require('express');
const authRoute = require('./auth');
const postsRoute = require('./posts');

const app = express();
const router = express.Router();

app.use('/api/users', authRoute);
app.use('/api/posts', postsRoute);

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});


module.exports = router;