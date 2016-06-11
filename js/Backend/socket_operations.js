/**
 * Created by mudi on 11/06/16.
 */

function socket_operations(io){
    var users = {};
    var rooms = {};
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
}

module.exports.socket_operations = socket_operations;
