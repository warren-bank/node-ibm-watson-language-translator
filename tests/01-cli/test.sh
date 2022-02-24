#!/usr/bin/env bash

# declare variables "IBM_TRANSLATOR_API_KEY" and "IBM_TRANSLATOR_API_URL"
source "${HOME}/IBM_TRANSLATOR_API_CREDENTIALS.sh"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function ibm-translate {
  node "${DIR}/../../bin/ibm-translate.js" "$@"
}

output_dir="${DIR}/output"
log_file="${output_dir}/test.log"

[ ! -d "$output_dir" ] && mkdir "$output_dir"
[ -f "$log_file" ]     && rm    "$log_file"

ibm-translate -i 'en' -o 'de' -s 'Hello world'            >>"$log_file" 2>&1
ibm-translate -i 'en' -o 'de' -s 'Welcome to the jungle'  >>"$log_file" 2>&1
