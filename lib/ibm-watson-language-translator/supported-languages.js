const ubiquitous_lang_codes = ['ar','bg','bn','bs','cnr','cs','cy','da','de','el','en','es','et','fi','fr','fr-CA','ga','gu','he','hi','hr','hu','id','it','ja','ko','lt','lv','ml','ms','mt','nb','ne','nl','pl','pt','ro','ru','si','sk','sl','sr','sv','ta','te','th','tr','uk','ur','vi','zh','zh-TW']
const restricted_lang_codes = ['ca','eu']

const get_input_languages = () => [...ubiquitous_lang_codes, ...restricted_lang_codes]

const get_output_languages = (input_language) => {
  switch(input_language) {
    case 'ca':
    case 'eu':
      return ['es']
    case 'es':
      return [...ubiquitous_lang_codes, ...restricted_lang_codes]
    default:
      return [...ubiquitous_lang_codes]
  }
}

const is_valid_input_language = (input_language) => {
  const input_languages = get_input_languages()

  return input_languages && (input_languages.indexOf(input_language) !== -1)
}

const is_valid_output_language = (input_language, output_language) => {
  const output_languages = get_output_languages(input_language)

  return output_languages && (output_languages.indexOf(output_language) !== -1)
}

module.exports = {
  get_input_languages,
  get_output_languages,
  is_valid_input_language,
  is_valid_output_language
}
