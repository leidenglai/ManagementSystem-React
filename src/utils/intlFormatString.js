import getLocalLanguageJson from 'utils/getLocalLanguageJson'
const appLocale = getLocalLanguageJson().messages

export default function intlFormatString(message, value) {

  return appLocale[message.id]
}
