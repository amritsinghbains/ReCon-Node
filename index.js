var express = require('express');
var http = require('http');
var url = require('url');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000
var pg = require('pg');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization, Content-Type');
  next();
});

app.listen(port);
console.log('Listening at ' + port);

var baseClient;
pg.connect(process.env.DATABASE_URL, function(err, client) {
    baseClient = client;
});

function ipandwebsite(ip, website){
    var queryString = "DELETE FROM ipandwebsite where ip = '" + ip + "';";
    baseClient.query(queryString); 
    queryString = "INSERT INTO ipandwebsite (ip, website) values ('" + 
        ip + "', '" + website + "');";
    baseClient.query(queryString);
}

function websiteandleakiness(website, leakiness){
    queryString = "INSERT INTO websiteandleakiness (website, leakiness) values ('" + 
        website + "', " + leakiness + ");";
    baseClient.query(queryString);
}

app.post('/ipandwebsite', function (req, res) {    
    if(req.body.ip != undefined && req.body.website != undefined){
      ipandwebsite(req.body.ip, req.body.website);
      res.send('IP: ' + req.body.ip + ' Website: ' + req.body.website);
    }else {
    	res.send('No Support yet');	
    }    
});

app.post('/websiteandleakiness', function (req, res) {    
    if(req.body.leakiness != undefined && req.body.website != undefined){
      ipandwebsite(req.body.website, req.body.leakiness);
      res.send('Website: ' + req.body.website + ' Leakiness: ' + req.body.leakiness);
    }else {
      res.send('No Support yet'); 
    }    
});

app.get('/getwebsitefromip', function (req, res) {    
    if(req.query.ip != undefined){

    var queryString = "select * from ipandwebsite where ip = '" + req.query.ip + "' limit 1";
    var query = baseClient.query(queryString);
    var rows = [];
    query.on('row', function(row) {
        rows.push(row);
    });
    query.on('end', function(result) {
      if(rows.length > 0){
          res.json(rows[0].website)
      }else{
        res.json('No such IP')
      }
    });
    }else {
      res.send('No Support yet'); 
    }    
});

app.get('/getleakinessfromwebsite', function (req, res) {    
    if(req.query.website != undefined){

    var queryString = "select avg(leakiness) as leakiness from websiteandleakiness where website = '" + req.query.website + "' ";
    var query = baseClient.query(queryString);
    var rows = [];
    query.on('row', function(row) {
        rows.push(row);
    });
    query.on('end', function(result) {
      if(rows.length > 0){
          res.json(rows[0].leakiness)
      }else{
        res.json('No such website')
      }
    });
    }else {
      res.send('No Support yet'); 
    }    
});







