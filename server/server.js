const express = require('express');

const apiRouter = require('./router/api.js');
const router = require('./router/default.js');
const app =  express();

app.use(express.json());

// app.use(express.static('public'));

app.use('/api', apiRouter);

app.use('/', router);

app.listen(8069, () =>{
    console.log("Running at http://localhost:8069")
})
