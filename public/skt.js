$(document).on('ready',function(){
	var socket = io.connect('http://localhost:3000');
	socket.on('mensaje',function (mensaje){
		alert(mensaje);
	})
});