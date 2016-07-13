var RtmClient = require('@slack/client').RtmClient
  , RTM_EVENTS = require('@slack/client').RTM_EVENTS
  , WebClient = require('@slack/client').WebClient
  , MessageHelpers = require('./message-helpers');

var content;
try {
  var fs = require('fs');
  var pathToken = process.env.CHAT_BOT_TOKEN;
  var token = pathToken || fs.readFileSync('token.txt', 'utf8').trim();
} catch (error) {
  console.log("Your API token should be placed in a 'token.txt' file, which is missing.");
  return;
}

var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port:8080})
  , rtm = new RtmClient(token)
  , web = new WebClient(token)
  , express = require('express')
  , app = express()
  , port = 3000;

rtm.start();

pub = __dirname + '/public';
app.use(express.static(pub));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(function(err, req, res, next) {
  res.send(err.stack);
});

wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', function(message) {
    content = message;
    wss.broadcast(message);
  });
});

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  var user = rtm.dataStore.getUserById(message.user)
  var dm = rtm.dataStore.getDMByName(user.name);
  rtm.sendMessage('Code Shared: http://localhost:3000', dm.id);
}); 

rtm.on(RTM_EVENTS.FILE_SHARED, function (message) {
  web.files.info(message.file_id, null, function handleContentFileUpload(err, response) {
    content = response.content;
  }); 
});

app.get('/', function(req, res){
    res.render('editor', {text: content});
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
