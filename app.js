
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , app = express()
  , http = require('http').createServer(app)
  , io = require('socket.io')
  , io = io.listen(http)
  , MemoryStore = express.session.MemoryStore
  , sessionStore = new MemoryStore()
  , parseCookie = require('express/node_modules/connect').utils.parseSignedCookies
  , cookie = require('express/node_modules/cookie')
  , path = require('path');

io.configure(function (){
  io.set('authorization', function (handshakeData, callback) {
    console.log(handshakeData.headers);
    if (handshakeData.headers.cookie)
    {
      handshakeData.cookie = parseCookie(cookie.parse(handshakeData.headers.cookie),'M1Supp3RS3cr3TP@SsW0Rd');
      handshakeData.sessionID = handshakeData.cookie['express.sid'];
      console.log(handshakeData.cookie);
      sessionStore.get(handshakeData.sessionID, function (err, session) {
        if (err){ callback('fallo la obtencion de sesion!',false) };
        if (session){
          if (session.usuario){
            callback(null,true)
          } else {
            callback('el usuario no esta logeado', false)
          }
        }
      })
    }
  });
});

io.sockets.on('connection',function (socket){
  socket.emit('mensaje','bienvenidos!');
  console.log(socket);
})

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('M1Supp3RS3cr3TP@SsW0Rd'));
  app.use(express.session({
    store: sessionStore,
    secret: 'M1Supp3RS3cr3TP@SsW0Rd',
    key: 'express.sid'
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
//enviar el formulario de login
app.post('/login', routes.login);
//si el usuario ya existe
app.get('/errorUsuario', routes.errorUsuario);
//entrar al chat
app.get('/chat', routes.chat);
//salir del chat
app.post('/salir', routes.salir);
app.get('/users', user.list);

http.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
