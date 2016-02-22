/**
 * Created by MuDi Ahmed on 22/02/2016.
 */
var socket = io();
var mymessages=false;
var first_message=true;
var mymessages_counter=0;
var other_counter=0;
$(document).ready(function(){
    $('#chat_form').submit(function(){
        socket.emit('chat message', $('#m').val());
        if(mymessages){
            $('#my'+mymessages_counter).append($('<li>').text($('#m').val()));
        }else{
            $('#messages').append('<ul class="user_messages" id="my'+mymessages_counter+'"></ul>')
            $('#my'+mymessages_counter).append($('<li>').text($('#m').val()));
            mymessages=true;
            other_counter++;
        }

        $('#m').val('');
        return false;
    });
    $('#nickname_form').submit(function(){
        socket.emit('nickname', $('#nickname').val());
        $('#nickname').val('');
        return false;
    });

    /*******
     * typing functionality
     *
     * *******/
    var typing=false,
        timeOutID;
    function typingTimeOut(){
        typing=false;
        socket.emit('typing',false);
    }
    $('#m').keypress(function(event){
        if(event.which!==13){//key is enter
            if(typing===false&&$('#m').is(':focus')){
                typing=true;
                socket.emit('typing',true);
                timeOutID=setTimeout(typingTimeOut,5000);
            }else{
                clearTimeout(timeOutID);
                timeOutID=setTimeout(typingTimeOut,5000);
            }
        }else{
            clearTimeout(timeOutID);
            timeOutID=setTimeout(typingTimeOut,0);
        }
    });
    $('.create_room_form').on('submit',function(){
//				console.log($('.create_room_form input').val());
        socket.emit('create',$('.create_room_form input').val());
        console.log(socket.rooms);
        return false;
    });
    $(document).on('click','.rooms_list li',function(){
        console.log(this.className);
        socket.emit('join room',this.className);
        $('.rooms_chat_wrapper').append('<div class="room_chat" id="'+this.className+'"><ul></ul><form><input type="text"></form></div>');
    });
    $(document).on('submit','.rooms_chat_wrapper .room_chat form',function(){
        console.log($(this).find('input').val());
        console.log($(this).parent().attr('id'));
        socket.emit('chat room',{
            room:$(this).parent().attr('id'),
            message:$(this).find('input').val()
        });
        return false;
    })
});
socket.on('typing',function(data){
    if(data.typing){
        console.log('add',data.id);
        $('#messages').append('<li id="typing" >user '+data.nickname+' is typing</li>');
    }else{
        console.log('remove',data.id);
        console.log(data.typing);
        $('#typing').remove();
    }
});
/*******end of typing functionality ********/
socket.on('chat message', function(msg){
    if(first_message){
        $('#messages').append('<ul class="other_messages" id="other'+other_counter+'"></ul>');
        $('#other'+other_counter).append($('<li>').text(msg));
        first_message=false;
        mymessages=false;
        mymessages_counter++;
    }else{
        if(mymessages){
            $('#messages').append('<ul class="other_messages" id="other'+other_counter+'"></ul>');
            $('#other'+other_counter).append($('<li>').text(msg));
            mymessages=false;
            mymessages_counter++;
        }else{
            $('#other'+other_counter).append($('<li>').text(msg));
        }
    }
//			$('#messages').append($('<li class="other_messages">').text(msg));
});
socket.on('user connect',function(users){
    console.log(users);
    $('#users_list').text('');
    for(var user in users){
        $('#users_list').append($('<li>').text(users[user]));
    }
});
socket.on('rooms',function(rooms){
    console.log(rooms);
    $('.rooms_list').text('');
    for(var room in rooms){
        $('.rooms_list').append($('<li class="'+room+'"></li>').text(room));
    }
});
socket.on('room message',function(data){
    console.log('room chat');
    $('#'+data.room).append($('<li>').text(data.message));
})