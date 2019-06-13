Request = require("./request");

function Connector(public_key, secret_key, server_base){
  if(!public_key || !secret_key){
    throw new Error('Missing public_key or secret_key');
  }

  this.public_key = public_key;
  this.secret_key = secret_key;
  this.server_base = server_base || "https://www.startwithplate.com/api/v2";
}

/**
 * Send a request to the API
 * @param  {String} method       The HTTP method to use
 * @param  {String} path         The relative path to use
 * @param  {Object} parameters   The parameters to send with the request
 * @return {Promise}             Promise for response object
 */
Connector.prototype.send_request = function(method, path, parameters){
  var full_url = this.server_base + path;
  request = new Request(method, full_url, parameters, this);
  return request.execute();
}

module.exports = Connector
