const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const cityController = require('./controllers/cityController');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs'); // using ejs to embed js in html

// routes
app.get('/', cityController.index);
app.get('/api/city/recent', cityController.recent_cities);
app.get('/api/city/searched', cityController.most_searched_cities);
app.post('/api/city', cityController.add_city);

app.listen(3000, function () {
    console.log('listening on port 3000! Access http://localhost:3000');
});