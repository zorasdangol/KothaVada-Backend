const express = require('express');
const { default: mongoose } = require('mongoose');
require('dotenv/config');
const router = require('./routes/routes');

const app = express();

//Middleware
app.use(express.json());

//Route Middlewares

app.use('/api', router);

//ROUTES
app.get('/', (req, res) => {
    res.send('We are on home');
})



//How to start listening to the server
app.listen(process.env.PORT || 3000, () => {
    console.log('Server up and running ');
});