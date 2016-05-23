const rx = require('rx');
const _ = require('underscore-plus');
const Slack = require('./slack-client');

const MessageHelpers = require('./message-helpers');


class Bot {
  // Public: Creates a new instance of the bot.
  //
  // token - An API token from the bot integration
  constructor(token) { 
    this.slack = new Slack(token, true, true);
  }

  // Public: Brings this bot online and starts handling messages sent to it.
  login() {
    rx.Observable.fromEvent(this.slack, 'open')
      .subscribe(() => this.onClientOpened());

    this.slack.login();
  }

  // Public: Edits a snippet posted in the chat.  
  editSnippet(content) {
    this.slack.filesEdit(content);
  } 


  // Private: Save which channels and groups this bot is in and log them.
  onClientOpened() {
    this.channels = _.keys(this.slack.channels)
      .map(k => this.slack.channels[k])
      .filter(c => c.is_member);

    this.groups = _.keys(this.slack.groups)
      .map(k => this.slack.groups[k])
      .filter(g => g.is_open && !g.is_archived);

    this.dms = _.keys(this.slack.dms)
      .map(k => this.slack.dms[k])
      .filter(dm => dm.is_open);

    console.log(`Welcome to Slack. You are ${this.slack.self.name} of ${this.slack.team.name}`);

    if (this.channels.length > 0) {
      console.log(`You are in: ${this.channels.map(c => c.name).join(', ')}`);
    } else {
      console.log('You are not in any channels.');
    }

    if (this.groups.length > 0) {
      console.log(`As well as: ${this.groups.map(g => g.name).join(', ')}`);
    }

    if (this.dms.length > 0) {
      console.log(`Your open DM's: ${this.dms.map(dm => dm.name).join(', ')}`);
    }
  }
}

module.exports = Bot;
