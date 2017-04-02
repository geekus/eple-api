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

app.use((req, res, next) => {
  res.status(404).json({message: 'Could not find that, sorry.'});
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({message: 'Something went wrong.'});
});

// Run server if not in context of test or export as module
if (!module.parent) {
  app.listen(8080, function () {
    console.log('API listening on port 8080.');
  });
} else {
  module.exports = app;
}
