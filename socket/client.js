import io from 'socket.io-client';

// Adresse du serveur Socket.IO (remplacez par votre propre adresse)
const serverUrl = 'http://localhost:8080/activity';

// Connexion au serveur Socket.IO
const socket = io(serverUrl, {
	path: "/socket"
});

socket.emit('sendMessage', )