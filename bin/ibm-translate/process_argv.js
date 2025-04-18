const process_argv = require('@warren-bank/node-process-argv')

const argv_flags = {
  "--help":             {bool: true},
  "--version":          {bool: true},
  "--api-key":          {},
  "--api-url":          {},
  "--input-language":   {},
  "--output-language":  {},
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

module.exports = argv_vals
