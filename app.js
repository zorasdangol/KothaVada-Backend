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

//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log('connected to db')
    }
})


//How to start listening to the server
app.listen(3000, () => {
    console.log('Server up and running ');
});