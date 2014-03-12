var Twit = require('twit');
var config = require('../../../config/secrets').twitter;
var ContentService = require('../content-service');
var util = require('util');

var TwitterContentService = function(options) {
  this.twit = new Twit(config);
  if (typeof options === 'string') {
    this.filter = options;
  } else {
    this.filter = options.filter;
  }
  this.type = 'twitter';
  this._isStreaming = false;
};

util.inherits(TwitterContentService, ContentService);

// Set/change filter stream
TwitterContentService.prototype.setFilterStream = function(filter) {
  if (typeof filter === 'string') {
    this.filter = filter;
  }
};

// Start/resume streaming of filtered data
TwitterContentService.prototype.start = function() {
  if (this.stream) {
    this.stream.start();
  } else {
    this.streamName = 'statuses/filter';
    this.stream = this.twit.stream(this.streamName, {track: this.filter});
  }
  this._isStreaming = true;
};

// Stop the stream
TwitterContentService.prototype.stop = function() {
  if (this.stream) {
    this.stream.stop();
  }
  this._isStreaming = false;
};

// Wrapper for stream event listener
TwitterContentService.prototype.on = function(event, callback) {
  // Create and start stream if not yet created
  if (!this.stream) {
    this.start();
  }
  event = event === 'data' ? 'tweet' : event;
  // Listen to stream event and return it to allow chaining
  return this.stream.on(event, callback);
};

module.exports = TwitterContentService;
