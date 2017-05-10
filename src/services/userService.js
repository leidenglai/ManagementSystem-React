import packOptionsToFetch from './fetch'

/**
 * 对应后端涉及到用户认证的 API
 */
class UserService {

  checkLogin() {
    return packOptionsToFetch({ api: '/user' })
  }

  /**
   * @param  {Object} userData
   * @return {Promise}
   */
  login(userData) {
    return packOptionsToFetch({
      method: 'post',
      api: '/user/login',
      params: userData
    })
  }

  logout() {
    return packOptionsToFetch({
      method: 'post',
      api: '/user/logOut'
    })
  }

  // 用户初始数据
  fetchInitInfo() {
    return packOptionsToFetch({
      method: 'post',
      api: '/user/initInfo'
    })
  }

}

// 实例化后再导出
export default new UserService()
