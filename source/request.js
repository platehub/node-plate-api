const URL = require('url').URL;
const crypto = require('crypto');
const got = require('got');

function Request(method, url, parameters, connector){
  this.method = method.toUpperCase();
  this.parsedUrl = new URL(url);
  this.publicKey = connector.publicKey;
  this.secretKey = connector.secretKey;
  if(this.method == 'GET'){
    this.setGetParams(parameters);
  }else{
    this.postParams = {
      'data': parameters
    }
  }
}

/**
 * Execute the request
 * @return {Undefined} Undefined
 */
Request.prototype.execute = function(){
  var dateString = Date.toUTCString();

  var authenticationHash = this.signString(this.stringToSign(dateString));
  var options = this.requestOptions(dateString, authenticationHash)
  var responsePromise = got(this.parsedUrl.href, options);
  return responsePromise
}

/**
 * Return the options for Got
 * @param  {String} dateString         The string for the Date header
 * @param  {String} authenticationHash The hash for the Authorization header
 * @return {Object}                     An object with all the options
 */
Request.prototype.requestOptions = function (dateString, authenticationHash) {
  var requestOptions = {
    method: this.method,
    headers: {
      'Date': dateString,
      'Authorization': 'hmac ' + this.publicKey +':' + authenticationHash
    },
    json: true,
    body: this.postParams
  };
  return requestOptions;
};

/**
 * Set the GET parameters in the url.
 * @param  {Object} params The parameters to set
 */
Request.prototype.setGetParams = function(params){
  for(key in params){
    this.parsedUrl.searchParams.set(key, params[key]);
  }
  this.parsedUrl.searchParams.sort();
}

/**
 * Setup the string to sign for the Authorization header
 * @param  {String} dateString The string representation of the Date header that is going to be used
 * @return {String}             The string to sign for the Authorization header
 */
Request.prototype.stringToSign = function(dateString){
  var stringToSign = this.method + '\n'
    + this.parsedUrl.hostname + '\n'
    + this.parsedUrl.pathname + '\n'
    + this.parsedUrl.searchParams + '\n'
    + dateString;
  return stringToSign;
}

/**
 * Sign a string for the Authorization header, using the secretKey.
 * @param  {String} stringToSign The string that is going to be hashed
 * @return {String}                The resulting hash
 */
Request.prototype.signString = function(stringToSign){
  var hash = crypto.createHmac('sha512', this.secretKey)
                   .update(stringToSign)
                   .digest('base64');
  return hash;
}

module.exports = Request
