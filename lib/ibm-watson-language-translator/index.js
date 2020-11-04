const request   = require('./request')
const parse_url = require('url').parse

const api_path  = '/v3/translate?version=2018-05-01'

const get_request_options = (api_key, url, postBody) => ({
  method:   'POST',
  protocol: url.protocol,
  hostname: url.hostname,
  port:     url.port || 443,
  path:     url.path,
  auth:     `apikey:${api_key}`,
  headers: {
    'Content-Type':   'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(postBody))
  }
})

const translate = (api_key, api_url, input_language_code, output_language_code, input_strings_array) => {
  return new Promise((resolve, reject) => {
    const url      = parse_url(api_url + api_path)
    const postBody = {"text": input_strings_array, "model_id": `${input_language_code}-${output_language_code}`}
    const options  = get_request_options(api_key, url, postBody)

    request(options, postBody)
    .then(response => {
      if (
           (response instanceof Object)
        && (response !== null)
        && Array.isArray(response.translations)
        && (response.translations.length === input_strings_array.length)
      ) {
        resolve(
          response.translations.map(obj => obj.translation)
        )
      }
      else {
        reject(
          new Error(
            'ERROR: IBM Watson Language Translator service API returned an incorrect number of string translations.' + "\n" +
            'Full response:' + "\n" +
            JSON.stringify(response, null, 2)
          )
        )
      }
    })
    .catch(reject)
  })
}

module.exports = translate
