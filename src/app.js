// es6兼容文件
import 'babel-polyfill'
/* 入口启动文件 */
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { Router } from 'react-router'
import store, { history } from 'store'
import routes from 'routes'
// https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API
import 'whatwg-fetch'

// promise兼容 Auto-polyfill: https://github.com/stefanpenner/es6-promise
import 'es6-promise/auto'

// // 全局加载lodash
// // Load the core build.
// windows._ = require('lodash/core');

import { LocaleProvider, message } from 'antd'
import { addLocaleData, IntlProvider } from 'react-intl'
import getLocalLanguageJson, { getLanguage } from 'utils/getLocalLanguageJson'
import shimInil from 'utils/shimInil'

window.localLanguage = getLanguage()

/*
 * 国际化
 * 兼容不支持Intl浏览器
 */
shimInil(window.localLanguage, () => {
  // 加载locale 配置文件
  const appLocale = getLocalLanguageJson()
  addLocaleData(appLocale.data)

  // 配置全局message
  message.config({
    top: 64
  });

  /**
   * 用于检测不必要的重新渲染，详情请看其项目地址：
   * https://github.com/garbles/why-did-you-update
   *
   * 有关性能提升方面的问题
   * 诸如 PureComponent / shouldComponentUpdate / Immutable.js 等
   * 请自行查阅相关资料
   */
  if (__DEV__ && __WHY_DID_YOU_UPDATE__) {
    const { whyDidYouUpdate } = require('why-did-you-update')
    whyDidYouUpdate(React)
  }
  if (__DEV__) {
    console.info('[当前环境] 开发环境')
  }
  if (__PROD__) {
    console.info('[当前环境] 生产环境')
  }

  const MOUNT_NODE = document.getElementById('app')

  // 加载intl,redux
  const App = () => (
    <LocaleProvider locale={appLocale.antd}>
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <Provider store={store}>
          <Router history={history} children={routes} />
        </Provider>
      </IntlProvider>
    </LocaleProvider>
  )

  // ================================
  // 将根组件挂载到 DOM，启动！
  // ================================
  ReactDOM.render(
    <App />,
    MOUNT_NODE
  )
})

// === Webpack 处理 assets，取消注释即可进行测试 === //
/* 处理 less / sass */
/* 公共css覆盖 */
import 'assets/less/common.less'
// import 'assets/less/normalize.less'
// import 'assets/scss/normalize.scss'
