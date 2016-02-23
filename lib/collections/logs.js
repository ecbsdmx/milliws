Logs = new Mongo.Collection('logs');

// Helper methods for logging.
Meteor.methods({
  messageLogDebug: function(message, module, status) {
    // @see http://docs.meteor.com/#/full/method_connection
    var context = this.connection === null ? "server" : "client";
    logInsert("DEBUG", context, message, module, status);
  },
  messageLogInfo: function(message, module, status) {
    var context = this.connection === null ? "server" : "client";
    logInsert("INFO", context, message, module, status);
  },
  messageLogWarn: function(message, module, status) {
    var context = this.connection === null ? "server" : "client";
    logInsert("WARN", context, message, module, status);
  },
  messageLogError: function(message, module, status) {
    var context = this.connection === null ? "server" : "client";
    logInsert("ERROR", context, message, module, status);
  }
});

/**
 * Insert a log entry in the logmessage collection.
 *
 * @param  String level   One of : DEBUG, INFO, WARN, ERROR
 * @param  String context One of client, server. Automatically set by the helper methods.
 * @param  String message The message to log
 * @param  String module  The originating application module (js filename?)
 * @param  Integer status  One of the HTTP status codes
 *
 * @return Object         The id of the newly created message collection entry.
 */
var logInsert = function(level, context, message, module, status) {
  //checkPermissions();
  checkLevel(level);
  checkStatus(status);

  var log = {
    ts: new Date(),
    org: context,
    msg: message,
    level: level,
    module: module || "",
    status: status || "" // or 200 as default ??
  };

  var id = Logs.insert(log);
  return {
    _id: id
  };
};

var checkLevel = function(level) {
  if (!_.contains(["DEBUG", "INFO", "WARN", "ERROR"], level)) {
    throwLoggingError(500, "Log level is not defined.", level);
  }
};

var checkStatus = function(status) {
  if (typeof status == 'undefined') return;
  if (typeof status != 'number') throw new Meteor.Error(500, "Not a numeric status code given");
  if (status < 100) throw new Meteor.Error(500, "Status code should conform to the known HTTP status codes");
  if (status > 102 && status < 200) throw new Meteor.Error(500, "Status code should conform to the known HTTP status codes");
  if (status > 226 && status < 300) throw new Meteor.Error(500, "Status code should conform to the known HTTP status codes");
  if (status < 308 && status < 400) throw new Meteor.Error(500, "Status code should conform to the known HTTP status codes");
  if (status > 599) throw new Meteor.Error(500, "Status code should conform to the known HTTP status codes");
};

throwLoggingError = function(errorType, message, details) {
  var meteorError = new Meteor.Error(errorType, message, details);
  if (Meteor.isClient) {
    // this error is never used on the client, the return value of a stub is ignored
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};

var checkPermissions = function() {
  // if (Meteor.isClient) {
  //   throw new Meteor.Error(403);
  // }
};
