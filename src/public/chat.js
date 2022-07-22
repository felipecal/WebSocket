const username = localStorage.getItem('username');
var feedback = document.getElementById('feedback');
var socket = io();
var form = document.getElementById('form');
var input = document.getElementById('input');
let timerOfWriting;

socket.on("connect", () => {
    socket.emit('front_connection', username);
});
input.addEventListener('keypress', function () {
    if (!!timerOfWriting) {
        clearTimeout(timerOfWriting);
        timerOfWriting = null;
    }
    socket.emit('start-typing', username);
    timerOfWriting = setTimeout(() => {
        socket.emit('stop-typing', '')
    }, 3000);
})
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        if (!!timerOfWriting) {
            clearTimeout(timerOfWriting);
            timerOfWriting = null;
            socket.emit('stop-typing', '')
        }
        socket.emit('chat_message', input.value);
        input.value = '';
    }
});

socket.on('notify_message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('start-typing', function (name) {
    feedback.innerHTML = '<p><em>' + name + ' is typing a message...';
})
socket.on('stop-typing', function() {
    feedback.innerHTML = '';
})