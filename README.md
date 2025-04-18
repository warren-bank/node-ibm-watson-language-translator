### [ibm-watson-language-translator](https://github.com/warren-bank/node-ibm-watson-language-translator)

Unofficial Node.js client library and CLI for a subset of the IBM Watson&trade; Language Translator service API.

#### Installation:

```bash
npm install @warren-bank/ibm-watson-language-translator
```

- - - - -

#### Library API:

* translate(api_key, api_url, input_language_code, output_language_code, input_strings_array, optimize_duplicates)
  - input parameters:
    * api_key
      - type: string
      - unique to an [IBM Cloud account](.etc/docs/IBM-Cloud-account.md)
    * api_url
      - type: string
      - unique to an [IBM Cloud account](.etc/docs/IBM-Cloud-account.md)
    * input_language_code
      - type: string
      - value is restricted to the [list of supported languages](#supported-languages)
    * output_language_code
      - type: string
      - value is restricted to the [list of supported languages](#supported-languages)
    * input_strings_array
      - type: array of strings
      - each string will be translated from `input_language_code` to `output_language_code`
      - the order of strings is preserved in the resolved return value
    * optimize_duplicates
      - type: boolean
      - default: false
      - when true:
        * duplicate strings are removed from the request to the translation service
        * translations for duplicate input strings are positionally inserted into the response from the translation service
          - the resolved value is identical to that of a non-optimized request
          - the benefit is that the translation service performs less work
  - return value:
    * Promise that resolves to an array of translated strings in the same order as the input array

#### Supported Languages

| code    | name                  |
|---------|-----------------------|
| "ar"    | Arabic                |
| "eu"    | Basque [1]            |
| "bn"    | Bengali               |
| "bs"    | Bosnian               |
| "bg"    | Bulgarian             |
| "ca"    | Catalan [1]           |
| "zh"    | Chinese (Simplified)  |
| "zh-TW" | Chinese (Traditional) |
| "hr"    | Croatian              |
| "cs"    | Czech                 |
| "da"    | Danish                |
| "nl"    | Dutch                 |
| "en"    | English               |
| "et"    | Estonian              |
| "fi"    | Finnish               |
| "fr"    | French                |
| "fr-CA" | French (Canadian)     |
| "de"    | German                |
| "el"    | Greek                 |
| "gu"    | Gujarati              |
| "he"    | Hebrew                |
| "hi"    | Hindi                 |
| "hu"    | Hungarian             |
| "ga"    | Irish                 |
| "id"    | Indonesian            |
| "it"    | Italian               |
| "ja"    | Japanese              |
| "ko"    | Korean                |
| "lv"    | Latvian               |
| "lt"    | Lithuanian            |
| "ms"    | Malay                 |
| "ml"    | Malayalam             |
| "mt"    | Maltese               |
| "cnr"   | Montenegrin           |
| "ne"    | Nepali                |
| "nb"    | Norwegian Bokmål      |
| "pl"    | Polish                |
| "pt"    | Portuguese            |
| "ro"    | Romanian              |
| "ru"    | Russian               |
| "sr"    | Serbian               |
| "si"    | Sinhala               |
| "sk"    | Slovak                |
| "sl"    | Slovenian             |
| "es"    | Spanish               |
| "sv"    | Swedish               |
| "ta"    | Tamil                 |
| "te"    | Telugu                |
| "th"    | Thai                  |
| "tr"    | Turkish               |
| "uk"    | Ukrainian             |
| "ur"    | Urdu                  |
| "vi"    | Vietnamese            |
| "cy"    | Welsh                 |

[1] Basque and Catalan are supported only for translation to and from Spanish.

[related docs](https://cloud.ibm.com/docs/language-translator?topic=language-translator-translation-models&locale=en-US#section-list-languages-supported)

#### Library Examples:

* implicit optimization of duplicate input strings

```javascript
const {translate} = require('@warren-bank/ibm-watson-language-translator')

{
  const api_key              = 'xxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxx'
  const api_url              = 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
  const input_language_code  = 'en'
  const output_language_code = 'de'
  const input_strings_array  = ['Hello world', 'Welcome to the jungle', 'Hello world', 'Welcome to the jungle']
  const optimize_duplicates  = true

  const translated_strings_array = await translate(api_key, api_url, input_language_code, output_language_code, input_strings_array, optimize_duplicates)

  console.log(output_language_code)
  console.log(JSON.stringify(translated_strings_array, null, 2))
}
```

* explicit optimization of duplicate input strings

```javascript
const {translate}       = require('@warren-bank/ibm-watson-language-translator')
const {DuplicatesStore} = require('@warren-bank/ibm-watson-language-translator/lib/optimize-duplicates')

{
  const api_key             = 'xxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxx'
  const api_url             = 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy'
  const input_language_code = 'en'
  const input_strings_array = ['Hello world', 'Welcome to the jungle', 'Hello world', 'Welcome to the jungle']
  const optimize_duplicates = false

  const duplicates_store            = new DuplicatesStore(input_strings_array)
  const deduped_input_strings_array = duplicates_store.dehydrate_input_strings_array()
  const output_languages            = ['de', 'es', 'fr']

  for (const output_language_code of output_languages) {
    const deduped_translated_strings_array = await translate(
      api_key, api_url, input_language_code, output_language_code, deduped_input_strings_array, optimize_duplicates
    )
    const translated_strings_array = duplicates_store.rehydrate_translated_strings_array(deduped_translated_strings_array)

    console.log(output_language_code)
    console.log(JSON.stringify(translated_strings_array, null, 2))
  }
}
```

- - - - -

#### CLI Usage:

```bash
ibm-translate <options>

options:
========
"-h"
"--help"
    Print a help message describing all command-line options.

"-v"
"--version"
    Display the version.

"-k" <key>
"--api-key" <key>
    [optional] IBM Cloud account API key.
    Default: Value is read from "IBM_TRANSLATOR_API_KEY" environment variable.

"-u" <url>
"--api-url" <url>
    [optional] IBM Cloud account API URL.
    Default: Value is read from "IBM_TRANSLATOR_API_URL" environment variable.

"-i" <language>
"--input-language" <language>
    [required] Language code for input string.

"-o" <language>
"--output-language" <language>
    [required] Language code for translated output string, written to stdout.

"-s" <text>
"--input-string" <text>
    [required] Input string to be translated.

language codes:
===============
  "ar"    Arabic
  "eu"    Basque [1]
  "bn"    Bengali
  "bs"    Bosnian
  "bg"    Bulgarian
  "ca"    Catalan [1]
  "zh"    Chinese (Simplified)
  "zh-TW" Chinese (Traditional)
  "hr"    Croatian
  "cs"    Czech
  "da"    Danish
  "nl"    Dutch
  "en"    English
  "et"    Estonian
  "fi"    Finnish
  "fr"    French
  "fr-CA" French (Canadian)
  "de"    German
  "el"    Greek
  "gu"    Gujarati
  "he"    Hebrew
  "hi"    Hindi
  "hu"    Hungarian
  "ga"    Irish
  "id"    Indonesian
  "it"    Italian
  "ja"    Japanese
  "ko"    Korean
  "lv"    Latvian
  "lt"    Lithuanian
  "ms"    Malay
  "ml"    Malayalam
  "mt"    Maltese
  "cnr"   Montenegrin
  "ne"    Nepali
  "nb"    Norwegian Bokmål
  "pl"    Polish
  "pt"    Portuguese
  "ro"    Romanian
  "ru"    Russian
  "sr"    Serbian
  "si"    Sinhala
  "sk"    Slovak
  "sl"    Slovenian
  "es"    Spanish
  "sv"    Swedish
  "ta"    Tamil
  "te"    Telugu
  "th"    Thai
  "tr"    Turkish
  "uk"    Ukrainian
  "ur"    Urdu
  "vi"    Vietnamese
  "cy"    Welsh

[1] Basque and Catalan are supported only for translation to and from Spanish.
```

#### CLI Example:

```bash
source ~/IBM_TRANSLATOR_API_CREDENTIALS.sh

ibm-translate -i 'en' -o 'de' -s 'Hello world'
ibm-translate -i 'en' -o 'de' -s 'Welcome to the jungle'
```

- - - - -

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
