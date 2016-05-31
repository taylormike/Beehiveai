var express = require('express');
var http = require('http');
const RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var WebClient = require('@slack/client').WebClient;

const MessageHelpers = require('./message-helpers');
var rtm;
var web;
var app;
var pub; 
var content;

class Bot {
  // Public: Creates a new instance of the bot.
  //
  // token - An API token from the bot integration
  constructor(token) { 
    rtm = new RtmClient(token);
    web = new WebClient(token);
    app = express();
    pub = __dirname + '/public';
  }

  // Public: Brings this bot online and starts handling messages sent to it.
  login() {
   rtm.start();
   this.setupUI();
   this.respondToSnippet();
  }

  setupUI() {
   //this.app = express();
   //this.pub = __dirname + '/public';
   app.use(express.static(pub));
   app.set('views', __dirname + '/views');
   app.set('view engine', 'jade');
   app.use(function(err, req, res, next) {
     res.send(err.stack);
   });
   app.listen(3000);
   console.log('Express started on port 3000');
  }
  
  respondToSnippet() {
    rtm.on(RTM_EVENTS.MESSAGE, function (message) {
      console.log('Message!!!!!!!!!!!!!!!!!!!!!!!!');
      var user = rtm.dataStore.getUserById(message.user)
      var dm = rtm.dataStore.getDMByName(user.name);
      rtm.sendMessage('Code Shared: http://locahost:3000', dm.id);
    }); 

    rtm.on(RTM_EVENTS.FILE_SHARED, function (message) {
     console.log('File!!!!!!!!!!!!!!!!!!!!!!!!');
     console.log(message);
     web.files.info(message.file_id, null, function handleContentFileUpload(err, response) {
      content = response.content;
      app.get('/', function(req, res){
       res.render('users', {text: content});
      });
     }); 
   });
   
   // Make our db accessible to our router
  }
}
   
module.exports = Bot;
