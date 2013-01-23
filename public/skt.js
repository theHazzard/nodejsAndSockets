var socket = io.connect('http://localhost:3000');
$(document).on('ready',function(){
	socket.on('mensaje',function (mensaje){
		alert(mensaje);
	})
	socket.on('nuevoUsuario',function (usuario){
		$('#chat').append('<article class="nusu"><section class="mensaje"> se conecto el usuario '+usuario+'</section></article>');
	   	$('#chat').animate({ scrollTop: 60000 }, 'slow');
	});
	socket.on('nMensaje',function (mensaje){
		$('#chat').append('<article class="msg"><section class="nombre">'+mensaje.nombre+'</section><section class="mensaje">'+mensaje.mensaje+'</section></article>');
	   	$('#chat').animate({ scrollTop: 60000 }, 'slow');
	});
	$('#chatInput').keypress(function (e) {
	    if(e.which == 13) {
	    	var message = $('#chatInput').val();
	    	socket.emit('mensaje',message);
	    	$('#chatInput').val("");
		}
	});
});

