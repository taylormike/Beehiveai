const RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

const rx = require('rx');
const _ = require('underscore-plus');

const MessageHelpers = require('./message-helpers');


class Bot {
  // Public: Creates a new instance of the bot.
  //
  // token - An API token from the bot integration
  constructor(token) { 
    this.rtm = new RtmClient(token, {logLevel: 'debug'});
  }

  // Public: Brings this bot online and starts handling messages sent to it.
  login() {
   this.rtm.start();
   this.respondToSnippet();
  }


  respondToSnippet() {
    this.rtm.on(RTM_EVENTS.MESSAGE, function (message) {
     console.log('Message!!!!!!!!!!!!!!!!!!!!!');
   });

    this.rtm.on(RTM_EVENTS.FILE_SHARED, function (message) {
     console.log('File!!!!!!!!!!!!!!!!!!!!!!!!');
   });
  }   

}

module.exports = Bot;
