const translate = require('../../../lib/ibm-watson-language-translator')

const print_divider = function() {
  console.log(('-').repeat(40))
}

const print_echo_server_json_response = function(error_message) {
  const regex = /^[^\{]*/m
  const my_PW = /("Authorization": ")[^"]+(")/
  const my_ID = /("X-Amzn-Trace-Id": ")[^"]+(")/
  const my_IP = /("origin": ")[^"]+(")/

  error_message = error_message.replace(regex, '')
  error_message = error_message.replace(my_PW, '$1Basic XXXXXXXXX$2')
  error_message = error_message.replace(my_ID, '$1YYYYYYYYYYYYYYY$2')
  error_message = error_message.replace(my_IP, '$1ZZZ.ZZZ.ZZZ.ZZZ$2')

  console.log(error_message)
}

const run_test = async function(optimize_duplicates = true, use_echo_server = false) {
  const api_key              = !use_echo_server ? process.env["IBM_TRANSLATOR_API_KEY"] : 'MY_IBM_TRANSLATOR_API_KEY'
  const api_url              = !use_echo_server ? process.env["IBM_TRANSLATOR_API_URL"] : 'https://httpbin.org/post#'
  const input_language_code  = 'en'
  const output_language_code = 'de'
  const input_strings_array  = ['Hello world', 'Hello world', 'Hello world', 'Hello world']

  try {
    const translated_strings_array = await translate(api_key, api_url, input_language_code, output_language_code, input_strings_array, optimize_duplicates)

    if (!Array.isArray(translated_strings_array) || (translated_strings_array.length !== input_strings_array.length))
      throw new Error('ERROR: IBM Watson Language Translator service API returned an incorrect number of string translations.')

    console.log(JSON.stringify(translated_strings_array, null, 2))
  }
  catch(error) {
    print_echo_server_json_response(error.message)
  }

  print_divider()
}

const run_all_tests = async function() {
  await run_test(false, true)
  await run_test(false, false)

  await run_test(true, true)
  await run_test(true, false)
}

run_all_tests()
