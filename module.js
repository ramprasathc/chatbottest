var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('You\'re in reception');
});


app.get('/floor/:floornum/bedroom', function(req, res) {
    res.render('bedroom.ejs', {floor: req.params.floornum});
});

app.listen(8080);
