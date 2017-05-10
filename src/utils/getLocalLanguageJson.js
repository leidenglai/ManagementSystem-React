import _ from 'lodash'
import { LanguageData } from 'constants/staticMap'

// 获取语言
export const getLanguage = function() {
  // 先返回本地保存的语言
  const localLanguage = localStorage.getItem('language');
  if (localLanguage) return localLanguage.replace('-', '_');

  // 返回浏览器语言
  let currentLang = navigator.language; // 判断除IE外其他浏览器使用语言
  if (!currentLang) { // 判断IE浏览器使用语言
    currentLang = navigator.browserLanguage;
  }
  const localePrefix = currentLang.substring(0, 2)
  const langIndex = _.findIndex(LanguageData, o => o.lang == localePrefix)

  if (langIndex != -1) {
    return LanguageData[langIndex].short
  }

  // 返回默认语言
  return 'en_US'
}

const locale = getLanguage()

// 加载locale 配置文件
const appLocale = require('../i18n/' + locale).default

export default function getLocalLanguageJson() {
  return appLocale
}
