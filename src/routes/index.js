// import { injectReducer } from 'reducers'
import createContainer from 'utils/createContainer'

export default [
  {
    path: '/account',

    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        /* 组件连接 state */
        const AccountContainer = createContainer(({ globalData }) =>
          ({ globalData })
        )(require('components/Account').default)

        cb(null, AccountContainer)
      }, 'accountView')
    },

    indexRoute: {
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          /* 组件连接 state */
          const LoginContainer = createContainer(
            ({ globalData, userData }) => ({ globalData, userData }), // mapStateToProps,
            require('actions/account').default, // mapActionCreators,
            require('containers/account/LoginPage').default // 木偶组件
          )

          cb(null, LoginContainer)
        }, 'accountLoginView')
      }
    },

    childRoutes: require('./account').default
  },
  {
    path: '/',

    component: createContainer(({ globalData, userData }) =>
      ({ globalData, userData })
    )(require('components/App').default),

    indexRoute: { onEnter: (nextState, replace) => replace('/product') },

    childRoutes: [
      // 路由按模块组织分离，避免单文件代码量过大
      require('./product').default,

      // 强制“刷新”页面的 hack
      { path: 'redirect', component: require('components/Redirect').default },

      // 无路由匹配的情况一定要放到最后，否则会拦截所有路由
      { path: '*', component: require('components/404').default }
    ]
  }
]
