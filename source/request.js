const URL = require('url').URL;
const crypto = require('crypto');
const got = require('got');

function Request(method, url, parameters, connector){
  this.method = method.toUpperCase();
  this.parsed_url = new URL(url);
  this.public_key = connector.public_key;
  this.secret_key = connector.secret_key;
  if(this.method == "GET"){
    this.set_get_params(parameters);
  }else{
    this.post_params = {
      'data': parameters
    }
  }
}

/**
 * Execute the request
 * @return {Undefined} Undefined
 */
Request.prototype.execute = function(){
  var date_string = new Date().toUTCString();
  var authentication_hash = this.sign_string(this.string_to_sign());
  var options = this.request_options(date_string, authentication_hash)

  var response_promise = got(this.parsed_url.href, options);
  return response_promise
}

/**
 * Return the options for Got
 * @param  {String} date_string         The string for the Date header
 * @param  {String} authentication_hash The hash for the Authorization header
 * @return {Object}                     An object with all the options
 */
Request.prototype.request_options = function (date_string, authentication_hash) {
  var request_options = {
    method: this.method,
    headers: {
      'Date': date_string,
      'Authorization': "hmac " + this.public_key +":" + authentication_hash
    },
    json: true,
    body: this.post_params
  };
};

/**
 * Set the GET parameters in the url.
 * @param  {Object} params The parameters to set
 */
Request.prototype.set_get_params = function(params){
  for(key in params){
    this.parsed_url.searchParams.set(key, params[key]);
  }
  this.parsed_url.searchParams.sort();
}

/**
 * Setup the string to sign for the Authorization header
 * @param  {String} date_string The string representation of the Date header that is going to be used
 * @return {String}             The string to sign for the Authorization header
 */
Request.prototype.string_to_sign = function(date_string){
  var string_to_sign = this.method + "\n"
    + this.parsed_url.host + "\n"
    + this.parsed_url.pathname + "\n"
    + this.parsed_url.searchParams + "\n"
    + date_string;
  return string_to_sign;
}

/**
 * Sign a string for the Authorization header, using the secret_key.
 * @param  {String} string_to_sign The string that is going to be hashed
 * @return {String}                The resulting hash
 */
Request.prototype.sign_string = function(string_to_sign){
  var hash = crypto.createHmac('sha512', this.secret_key)
                   .update(string_to_sign)
                   .digest('base64');
  return hash;
}

module.exports = {GetRequest: Request, PostRequest: PostRequest} 
