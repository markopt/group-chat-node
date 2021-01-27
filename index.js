const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.render('index.ejs');
});


var SplitFactory = require('@splitsoftware/splitio').SplitFactory;
var factory = SplitFactory({
  core: {
    authorizationKey: 'pq0ae329mjce4lp2amcmn9dbhb39dutk0hi'
  }
});
var client = factory.client();
var userId = 'test_user'

client.on(client.Event.SDK_READY, function() {
  var treatment = client.getTreatment(userId, 'chat-message');
  if (treatment == 'on') {
      console.log('Treatment on for User: ' + userId);
  } else if (treatment == 'off') {
      console.log('Treatment off for User: ' + userId);
  }
});


io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});


