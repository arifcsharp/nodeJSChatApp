﻿
var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/chatapp.html');
});

var usernames = {};

io.sockets.on('connection', function (socket) {

	socket.on('sendchat', function (data) {
		io.sockets.emit('updatechat', socket.username, data);
	});

	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat', 'SERVER', 'you have connected');
		socket.broadcast.emit('updatechat', 'SERVER'
		   , username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', 'SERVER'
		   , socket.username + ' has disconnected');
    });
    socket.on('typing', function () {
        socket.broadcast.emit('typing', socket.username);
    })

    socket.on('imageUpload', (data, imgUrl) => {
        io.sockets.emit('imageUpload', socket.username, data, imgUrl);
    });
});

var port = 12345;
server.listen(port);
console.log('Listening on port: ' + port);
