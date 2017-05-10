import UserService from 'services/UserService'
import { history } from 'store'

import intlFormatString from 'utils/intlFormatString'
// ================================
// Action Type
// ================================
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST'
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'
export const LOG_IN_ERROR = 'LOG_IN_ERROR'

// ================================
// Action Creator
// ================================
function logInStart() {
  return {
    type: LOG_IN_REQUEST
  }
}

function loginDone(userData) {
  return {
    type: LOG_IN_SUCCESS,
    payload: userData,
    errOpen: false
  }
}

function logInError(error) {
  return {
    type: LOG_IN_ERROR,
    payload: error,
    errOpen: true
  }
}

const login = (formData) => {
  return dispatch => {
    // 先校验空 再请求
    if (formData.telNum == '' && formData.userPwd == '') {
      return dispatch(logInError(intlFormatString({ id: 'phone_or_password_not_empty' })))
    } else if (formData.telNum == '') {
      return dispatch(logInError(intlFormatString({ id: 'phone_not_empty' })))
    } else if (formData.userPwd == '') {
      return dispatch(logInError(intlFormatString({ id: 'password_not_empty' })))
    }

    dispatch(logInStart())

    UserService.login(formData).then(re => {
        // 保存用户数据和token
        localStorage.setItem('token', re.webToken)
        localStorage.setItem('userData', JSON.stringify(re))

        // 其他用户数据
        UserService.fetchInitInfo().then(data => {
          const completeUserData = {
            ...Object.assign({}, re, data.userInfo),
            currency: data.currency,
            currencyIcon: data.currencyIcon
          }
          localStorage.setItem('userData', JSON.stringify(completeUserData))
          dispatch({
            type: 'USERDATA_GET',
            payload: completeUserData
          })
        })

        dispatch(loginDone(re))

        // 跳转页面
        history.push('/')
      },
      error => dispatch(logInError(error))
    )
  }
}


/* default 导出所有 Action Creators */
export default {
  // 虽然是同步的函数，但请不要自行 bindActionCreators
  // 皆因调用 connect 后，react-redux 已经帮我们做了，见：
  // https://github.com/reactjs/react-redux/blob/master/src/utils/wrapActionCreators.js
  login
}
