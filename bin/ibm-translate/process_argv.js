const process_argv = require('@warren-bank/node-process-argv')

const lang_codes = ['ar','eu','bn','bs','bg','ca','zh','zh-TW','hr','cs','da','nl','en','et','fi','fr','fr-CA','de','el','gu','he','hi','hu','ga','id','it','ja','ko','lv','lt','ms','ml','mt','cnr','ne','nb','pl','pt','ro','ru','sr','si','sk','sl','es','sv','ta','te','th','tr','uk','ur','vi','cy']

const argv_flags = {
  "--help":             {bool: true},
  "--version":          {bool: true},
  "--api-key":          {},
  "--api-url":          {},
  "--input-language":   {enum: lang_codes},
  "--output-language":  {enum: lang_codes, many: true},
  "--input-string":     {}
}

const argv_flag_aliases = {
  "--help":             ["-h"],
  "--version":          ["-v"],
  "--api-key":          ["-k"],
  "--api-url":          ["-u"],
  "--input-language":   ["-i"],
  "--output-language":  ["-o"],
  "--input-string":     ["-s"]
}

let argv_vals = {}

try {
  argv_vals = process_argv(argv_flags, argv_flag_aliases)
}
catch(e) {
  console.log('ERROR: ' + e.message)
  process.exit(1)
}

if (argv_vals["--help"]) {
  const help = require('./help')
  console.log(help)
  process.exit(0)
}

if (argv_vals["--version"]) {
  const data = require('../../package.json')
  console.log(data.version)
  process.exit(0)
}

argv_vals["--api-key"] = argv_vals["--api-key"] || process.env["IBM_TRANSLATOR_API_KEY"]
argv_vals["--api-url"] = argv_vals["--api-url"] || process.env["IBM_TRANSLATOR_API_URL"]

if (!argv_vals["--api-key"]) {
  console.log('ERROR: IBM Cloud account API key is required')
  process.exit(1)
}

if (!argv_vals["--api-url"]) {
  console.log('ERROR: IBM Cloud account API URL is required')
  process.exit(1)
}

if (!argv_vals["--input-language"]) {
  console.log('ERROR: Language code for input string is required')
  process.exit(1)
}

if (!argv_vals["--output-language"]) {
  console.log('ERROR: Language code for translated output string is required')
  process.exit(1)
}

if (!argv_vals["--input-string"]) {
  console.log('ERROR: Input string to be translated is required')
  process.exit(1)
}

// validate restricted translation pairs
{
  const whitelist = {
    "eu": ["es"],
    "ca": ["es"]
  }

  const test_translation_pair = (src, dst) => {
    if (
      (whitelist[src] && (whitelist[src].indexOf(dst) === -1)) ||
      (whitelist[dst] && (whitelist[dst].indexOf(src) === -1))
    ) {
      console.log(`ERROR: Input language ("${src}") cannot be translated to output language ("${dst}")`)
      process.exit(1)
    }
  }

  test_translation_pair(
    argv_vals["--input-language"],
    argv_vals["--output-language"]
  )
}

module.exports = argv_vals
