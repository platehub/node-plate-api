const URL = require('url').URL;
const crypto = require('crypto');
const got = require('got');

function Request(method, url, parameters, connector, success_callback, error_callback){
  this.method = method.toUpperCase();
  this.parsed_url = new URL(url);
  this.error_callback = error_callback;
  this.success_callback = success_callback;
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

// Execute request
Request.prototype.execute = function(){
  var date_string = new Date().toUTCString();

  var string_to_sign = this.method + "\n"
    + this.parsed_url.host + "\n"
    + this.parsed_url.pathname + "\n"
    + this.parsed_url.searchParams + "\n"
    + date_string;

  console.log("String to sign: \n" + string_to_sign);

  var hmac = crypto.createHmac('sha512', this.secret_key)
                   .update(string_to_sign)
                   .digest('base64');
  console.log(this.post_params)

  var request_options = {
    method: this.method,
    headers: {
      'Date': date_string,
      'Authorization': "hmac " + this.public_key +":" + hmac
    },
    json: true,
    body: this.post_params
  };

  console.log("Using options: " + request_options.headers['Authorization']);
  console.log("Using url: " + this.parsed_url.href);

  var response = got(this.parsed_url.href, request_options).then(this.success_callback, this.error_callback);
}

// Set params
Request.prototype.set_get_params = function(params){
  for(key in params){
    this.parsed_url.searchParams.set(key, params[key]);
  }
  this.parsed_url.searchParams.sort();
}

module.exports = Request
