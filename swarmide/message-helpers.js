module.exports = {
  containsUserMention: function (messageText, userId) {
    var userTag = '<@${userId}>';
    return messageText && messageText.startsWith(userTag);
  }
};
