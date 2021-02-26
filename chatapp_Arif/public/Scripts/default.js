/// <reference path="jquery-3.3.1.min.js" />

var socket;
var fileName;
$(document).ready(function () {
    socket = io.connect('http://localhost:12345');
    socket.on('connect', User);
    socket.on('updatechat', messageProcess);
    socket.on('updateusers', updateUserList);
    socket.on('typing', feedback);
    socket.on('imageUpload', sendDataWithImage);

    $('#send').click(sendMessage);
    $('#message').keypress(processEnterPress);
    $('#message').on('keydown', processKeyDown);
    $('#fileUpload').on('change', uploadFile);
});



function User() {
    socket.emit('adduser', prompt("What's your name?"));
}

function messageProcess(username, data) {
    document.querySelector('#feedback').innerHTML = '';
    document.querySelector('#output').innerHTML += '<b>' + username + ': </b>' + data + '<br>';
}

function uploadFile(e){
    let file = e.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = (event) => {
        fileName = event.target.result
    };
    fileReader.readAsDataURL(file);
};




function sendDataWithImage(username, data, imgurl) {    
        document.querySelector('#feedback').innerHTML = '';
        let lable = document.createElement('label');
        let img = document.createElement('img');
        let text = document.createElement('p');

        text.innerHTML = data;
        lable.innerHTML = username;
        lable.setAttribute('id', 'userTitle');
        text.setAttribute('id', 'msg');
        img.setAttribute('id', 'userImg');
        
        img.src = imgurl;
        let br = document.createElement('br');

        document.querySelector('#output').appendChild(lable);
        document.querySelector('#output').appendChild(text);
        document.querySelector('#output').appendChild(img);
        document.querySelector('#output').appendChild(br);

        document.querySelector('#fileUpload').value = "";

        $('#feedback').html('');
}


function updateUserList(data) {
    $('#users').empty();
    $.each(data, function (key, value) {
        $('#users').append('<li>' + key + '</li>');
    });
}

function sendMessage() {
    var message = $('#message').val();
    if (message != "") {
        $('#message').val('');
        socket.emit('sendchat', message);
        $('#message').focus();
        $('#message').val('');


    } else if (fileName != "") {
        sendImage(message, fileName)
        fileName = "";
        $('#message').focus();
        $('#message').val('');

    } else {
        $('#message').val('');
        $('#message').focus();
    }
       
   
}
    


function sendImage(message, fileName) {
    socket.emit('imageUpload', message, fileName);
}
function processEnterPress(e) {
    if (e.which == 13) {
        sendMessage();
    }
}
function processKeyDown() {
        socket.emit('typing', '');
}

function feedback(data) {
    $('#feedback').html('<p>' + data + ' is typing a message</p>');
}
