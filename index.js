var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use("/css",express.static(__dirname + "/css"));
app.use("/js",express.static(__dirname + "/js"));
app.use("/partials",express.static(__dirname + "/partials"));
app.get('/', function(req, res){
  res.sendFile( __dirname + '/partials/index.html');
});

var socket_operations = require('./js/Backend/socket_operations.js').socket_operations(io);

http.listen(3000, function(){
  console.log('listening on *:3000');
});