const express = require('express');
const app = express();

// weather api route: api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

// using ejs to embed js in html
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    // get history from database

    res.render('index', { name: 'bruno' });
});

app.get('/api/last_search', function (req, res) {
    // get history in database
});

app.post('/api/history', function (req, res) {
    // save history in database
});

app.listen(3000, function () {
    console.log('listening on port 3000! Access http://localhost:3000');
});