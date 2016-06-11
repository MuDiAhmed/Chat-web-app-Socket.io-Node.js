/**
 * Created by mudi on 11/06/16.
 */
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