Request = require("./request");

function Connector(public_key, secret_key, server_base){
  if(!public_key || !secret_key){
    throw new Error('Missing public_key or secret_key');
  }

  this.public_key = public_key;
  this.secret_key = secret_key;
  this.server_base = server_base || "https://www.startwithplate.com/api/v2";
}

Connector.prototype.send_request = function(method, path, parameters, success_callback, error_callback){
  var full_url = this.server_base + path;
  request = new Request(method, full_url, parameters, this, success_callback, error_callback);
  request.execute()
}

module.exports = Connector
