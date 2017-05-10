// import { history } from 'store'
import { message } from 'antd'

import getLocalLanguageJson from 'utils/getLocalLanguageJson'
const appLocale = getLocalLanguageJson().messages

/*
 *处理返回值
 *@param response Object [必选] 后端返回的response对象
 *
 *@return Promise Object json处理后的数据
 */
export default function responseHandler(response) {
  return new Promise(function(resolve, reject) {
    response.json()
      .then(json => {
        // 服务器返回状态
        switch (response.status) {
          case 401: // 无权限
            message.error(appLocale['please_login_again']);
            reject({ status: response.status, message: response.statusText })
            break;
          default:
            if (json.code != 1) {
              reject({ status: json.code, message: json.msg })
            } else {
              resolve(json.data)
            }
        }
      }, function() {
        console.log('response json解析错误')
        reject('json error')
      })
  })
}
