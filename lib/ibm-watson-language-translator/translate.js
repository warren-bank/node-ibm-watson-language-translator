const request             = require('./request')
const supported_languages = require('./supported-languages')
const {DuplicatesStore}   = require('../optimize-duplicates')
const parse_url           = require('url').parse

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

const translate = async (api_key, api_url, input_language_code, output_language_code, input_strings_array, optimize_duplicates = false) => {

  // short-circuit when no translation is necessary
  if (input_language_code === output_language_code) {
    return input_strings_array
  }

  // validate language codes
  if (!supported_languages.is_valid_input_language(input_language_code)) {
    throw new Error(
      'ERROR: Input language is not valid.' + "\n" +
      `You entered: "${input_language_code}"` + "\n" +
      'Valid options: ' + JSON.stringify(supported_languages.get_input_languages(), null, 2)
    )
  }
  if (!supported_languages.is_valid_output_language(input_language_code, output_language_code)) {
    throw new Error(
      `ERROR: Output language is not a valid target for the specified input language ("${input_language_code}").` + "\n" +
      `You entered: "${output_language_code}"` + "\n" +
      'Valid targets are: ' + JSON.stringify(supported_languages.get_output_languages(input_language_code), null, 2)
    )
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
  const response = await request(options, postBody)

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
      return output_strings_array
    }
    else {
      throw new Error(
        'ERROR: Optimizations to process duplicate strings have failed.' + "\n" +
        'The server did return the correct number of distinct string translations.' + "\n" +
        'The library failed to denormalize duplicates.' + "\n\n" +
        'Distinct translations from server:' + "\n" +
        JSON.stringify(api_output_strings_array, null, 2) + "\n\n" +
        'Denormalized translations from library:' + "\n" +
        JSON.stringify(output_strings_array, null, 2)
      )
    }
  }
  else {
    throw new Error(
      'ERROR: IBM Watson Language Translator service API returned an incorrect number of string translations.' + "\n\n" +
      'Full response:' + "\n" +
      JSON.stringify(response, null, 2)
    )
  }
}

module.exports = translate
