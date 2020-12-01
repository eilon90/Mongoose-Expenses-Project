const express = require('express');
const app = express();
const api = require('./server/routes/api');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/expensesDB', {useNewUrlParser: true});

app.use('/', api);

const port = 3000;
app.listen(port, function() {
    console.log(`Running on port ${port}`);
})