var socket = io.connect('http://localhost:3000');

$(document).on('ready',function(){
	socket.on('mensaje',function(mensaje){
		alert(mensaje);
	})
});