import _ from 'lodash'
import * as config from 'config'
import { getLanguage } from 'utils/getLocalLanguageJson'
import responseHandler from 'utils/responseHandler'
import { history } from 'store'
// import { message } from 'antd'

/*
 *包装fetch普通数据请求
 *@param api String [必选] 后端API
 *@param params Object [可选] 请求参数
 *@param type String [可选] 接口domain
 *@param method String [可选] 请求类型
 *
 *@return Promise Object
 */
export default function packOptionsToFetch({ api, params = {}, type = 'API', method = 'post' }) {
  return new Promise(function(resolve, reject) {

    let globalParams = { // 默认语言
      ...config.DEF_REQUEST_CONFIG,
      locale: getLanguage()
    }

    const _userData = JSON.parse(localStorage.getItem('userData'))

    if (_userData) {
      globalParams.token = _userData.webToken
      globalParams.userId = _userData.userId
    }

    let completeApi = config['SERVER_API_ROOT_' + type] + (config.SERVER_API_PORT ? ':' + config.SERVER_API_PORT : '') + api

    const requestParams = _.map(Object.assign({}, params || {}, globalParams), (value, key) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      } else if (typeof value === 'string') {
        value = (value.trim())
      }

      return key + '=' + value;
    })

    const options = {
      method: method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },

      /*
       * 需要发送的数据，可以是 Blob, BufferSource, FormData, URLSearchParams, 或者 USVString。
       * 需要注意的是 GET 和 HEAD 方法不能包含 body。
       */
      body: requestParams.join('&'),

      /*
       * same-origin：
       * 该模式是不允许跨域的，它需要遵守同源策略，否则浏览器会返回一个error告知不能跨域；
       * 其对应的response type为basic。
       * cors:
       * 该模式支持跨域请求，顾名思义它是以CORS的形式跨域；
       * 当然该模式也可以同域请求不需要后端额外的CORS支持；其对应的response type为cors。
       * no-cors:
       * 该模式用于跨域请求但是服务器不带CORS响应头，也就是服务端不支持CORS；
       * 这也是fetch的特殊跨域请求方式；其对应的response type为opaque。
       */
      mode: "cors"
    }

    // 发送请求 返回promise对象
    fetch(completeApi, options)
      .then(responseHandler)
      .then(res => resolve(res))
      .catch(function(error) {
        reject(error.message)
        if (error && error.status == 401) {
          // 无权限 返回登录
          history.replace('/account')
        }
      });
  })
}
