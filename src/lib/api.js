import axios from 'axios';
/** 
 * Axios wrapper for making API requests. 
 * It is primarily used by the store, but can be used generically in other components.
 * @param {string} jwt most API requests will require it
 * @param {object} callOptions
 * @param {string} callOptions.method GET, POST, PUT, DELETE
 * @param {string} callOptions.url
 * @param {object} callOptions.parms query parameter key/values
 * @param {object} callOptions.body the body (typically a JSON object)
 */
 let callApi = async function(jwt, callOptions){
  let {method, url, parms, body} = callOptions;
  method = method.toLowerCase();

  if(!url.toLowerCase().startsWith("http")){
    // Relative URLs get prepended with base URL
    url = process.env.VUE_APP_API_BASE_URL + url;
  }

  try {
    let options = {
      method,
      url,
      params: parms,
      headers: {
        "Content-Type": "application/json"
      },
    };
    if (jwt) {
      options.headers["Authorization"]=`Bearer ${jwt}`;
    }
    if (method === "post" || method === "put") {
      if (body) {
        options.data = body;
      }
    }
    let response = await axios(options);
    let content = null;
    let jsoncontent = null;
    let contentType = response.headers['Content-Type'];
    if(contentType && contentType.includes('/json')){
      jsoncontent = response.data;
    } else {
      content = response.data;
    }
    
    return jsoncontent || content;
  } catch (err) {
    // console.error('error handling in api: %o \n  %s', err.name, err.message);
    if (!err.response) {
      // No network connection.
      console.error("No network connection.");
      throw new ApiNotAvailableError("Unable to reach server. Please check your network connection.");
    } else if ([401, 403].includes(err.response.status)){
      let msg = err.response.data && err.response.data.message 
        ? err.response.data.message  
        : "Unauthorized."; 
      throw new ApiAuthorizationError(msg, err.response.status);
    } else if (400 <= err.response.status < 500) {
      throw new ApiError("Error.", err.response.status, err.response.data);
    } else if (err.response.status >= 500) {
      throw new ApiError("Server error.", err.response.status, err.response.data);
    } else {
      // Unknown error.
      console.error(err);
      console.error(`${method} ${url} error. ${err.message}`);
      throw new ApiError(`${method} ${url} error. ${err.message}`);
    } 
    
  }
};

export {callApi};


export class ApiError extends Error {
  constructor(msg, status, data){
    super(msg);
    this.status = status;
    this.data = data;
  }
}

export class ApiAuthorizationError extends ApiError {}
export class ApiNotAvailableError extends ApiError {}