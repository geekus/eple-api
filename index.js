const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('json spaces', 2);
app.set('x-powered-by', false);
app.set('etag', 'strong');

app.use(bodyParser.json());

app.all('/', function (req, res) {
  res.json({message: 'Hello, World!'});
});

app.use('/slack', require('./slack'));

app.listen(8080, function () {
  console.log('API listening on port 8080.');
});
