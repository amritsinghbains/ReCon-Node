var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
  next();
});

app.listen(port);
console.log('Listening at ' + port);

var data = [];

app.get('/set', function (req, res) {    
    if(req.query.ip != undefined && req.query.value != undefined){
      data[req.query.ip] = req.query.value;
      console.log('SET: ' + req.query.ip)
      res.send('IP: ' + req.query.ip + ' Value: ' + req.query.value);
    }else {
    	res.send('No Support yet');	
    }    
});

app.get('/get', function (req, res) {    
    if(req.query.ip != undefined){
      console.log('GET: ' + req.query.ip)
      res.send(data[req.query.ip]);
    }else {
      res.send('No Support yet'); 
    }    
});







