Request = require('./request');

function Connector(publicKey, secretKey, serverBase){
  if(!publicKey || !secretKey){
    throw new Error('Missing publicKey or secretKey');
  }

  this.publicKey = publicKey;
  this.secretKey = secretKey;
  this.serverBase = serverBase || 'https://www.startwithplate.com/api/v2';
}

/**
 * Send a request to the API
 * @param  {String} method       The HTTP method to use
 * @param  {String} path         The relative path to use
 * @param  {Object} parameters   The parameters to send with the request
 * @return {Promise}             Promise for response object
 */
Connector.prototype.sendRequest = function(method, path, parameters){
  var fullUrl = this.serverBase + path;
  request = new Request(method, fullUrl, parameters, this);
  return request.execute();
}

module.exports = Connector
