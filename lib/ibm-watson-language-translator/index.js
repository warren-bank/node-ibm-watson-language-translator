const request           = require('./request')
const {DuplicatesStore} = require('../optimize-duplicates')
const parse_url         = require('url').parse

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

const translate = (api_key, api_url, input_language_code, output_language_code, input_strings_array, optimize_duplicates = false) => {
  return new Promise((resolve, reject) => {
    // short-circuit when no translation is necessary
    if (input_language_code === output_language_code) {
      resolve(input_strings_array)
      return
    }

    let duplicates_store, api_input_strings_array
    if (optimize_duplicates) {
      duplicates_store        = new DuplicatesStore(input_strings_array)
      api_input_strings_array = duplicates_store.dehydrate_input_strings_array()
    }
    else {
      api_input_strings_array = input_strings_array
    }

    const url      = parse_url(api_url + api_path)
    const postBody = {"text": api_input_strings_array, "model_id": `${input_language_code}-${output_language_code}`}
    const options  = get_request_options(api_key, url, postBody)

    request(options, postBody)
    .then(response => {
      if (
           (response instanceof Object)
        && (response !== null)
        && Array.isArray(response.translations)
        && (response.translations.length === api_input_strings_array.length)
      ) {
        const api_output_strings_array = response.translations.map(obj => obj.translation)

        const output_strings_array = optimize_duplicates
          ? duplicates_store.rehydrate_translated_strings_array(api_output_strings_array)
          : api_output_strings_array

        if (output_strings_array.length === input_strings_array.length) {
          resolve(output_strings_array)
        }
        else {
          reject(
            new Error(
              'ERROR: Optimizations to process duplicate strings have failed.' + "\n" +
              'The server did return the correct number of distinct string translations.' + "\n" +
              'The library failed to denormalize duplicates.' + "\n\n" +
              'Distinct translations from server:' + "\n" +
              JSON.stringify(api_output_strings_array, null, 2) + "\n\n" +
              'Denormalized translations from library:' + "\n" +
              JSON.stringify(output_strings_array, null, 2)
            )
          )
        }
      }
      else {
        reject(
          new Error(
            'ERROR: IBM Watson Language Translator service API returned an incorrect number of string translations.' + "\n\n" +
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
