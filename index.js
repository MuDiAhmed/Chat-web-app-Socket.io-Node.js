var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var users = {};
var rooms = {};
app.use("/css",express.static(__dirname + "/css"));
app.use("/js",express.static(__dirname + "/js"));
app.get('/', function(req, res){
  console.log(path.join(__dirname, '../', 'index.htm'));
  //res.sendFile(path.join(__dirname, '../', 'index.htm'));
  res.sendFile( __dirname + '/index.htm');
});

io.on('connection',function(socket){
  //socket.set('nickname','User:'+socket.id);
  //io.emit('user connect', /*socket.get('nickname')*/);
  //console.log('a user has connected ');
  socket.nickname='user'+socket.id;
  if(users[socket.id]===undefined){
    users[socket.id]=socket.nickname;
    io.emit('user connect',users);
    io.emit('rooms',rooms);
  }
  socket.on('disconnect', function(){
    delete users[socket.id];
    io.emit('user connect',users);
    //console.log('user disconnected');
    //io.emit('chat message', 'user disconnected');
  });

  socket.on('chat message', function(msg){
    //console.log('message: ' + msg);
    socket.broadcast.emit('chat message',socket.nickname+' : '+msg);
    //io.emit('chat message', socket.id+' '+msg);
  });

  socket.on('nickname',function(nickname){
    users[socket.id]=nickname;
    io.emit('user connect',users);
    socket.nickname=nickname;
  });

  socket.on('typing',function(boolean){
    //console.log(boolean);
    socket.broadcast.emit('typing',{typing:boolean,id:socket.id,nickname:socket.nickname});
  });

  socket.on('create', function(room){
    console.log(room);
    //console.log(socket.rooms);
    rooms[room]=room;
    io.emit('rooms',rooms);
  });
  socket.on('join room',function(room){
    socket.join(room);
  });

  socket.on('chat room',function(data){
    console.log(data);
    io.to(data.room).emit('room message',data);
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});