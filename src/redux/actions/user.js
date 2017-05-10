import UserService from 'services/UserService'
import OrderService from 'services/orderService'
import { history } from 'store'
// ================================
// Action Type
// ================================
export const LOG_OUT = 'LOG_OUT'

// 加载本地用户数据
export const USERDATA_GET = 'USERDATA_GET'

// ================================
// Action Creator
// ================================

export const getUserData = () => {
  return dispatch => {
    const userData = JSON.parse(localStorage.getItem('userData'))

    dispatch({
      type: USERDATA_GET,
      payload: userData
    })
  }
}

export const checkLogin = () => {
  return dispatch => {
    // 检查本地的token
    const token = localStorage.getItem('token')

    if (!token) {
      history.replace('/account')
    }
  }
}

export const logout = () => {
  history.replace('/account')

  return dispatch => {
    UserService
      .logout()
      .then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('userData')
        dispatch({
          type: LOG_OUT
        })
      })
  }
}
