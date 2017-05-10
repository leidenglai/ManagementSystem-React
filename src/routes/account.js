import createContainer from 'utils/createContainer'

const connectComponent = createContainer(
  ({ userData }) => ({ userData }), // mapStateToProps
  require('actions/account').default // mapActionCreators
)

export default [
  { // 对应 /account/forgot
    path: 'forgot',
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, connectComponent(require('containers/account/ForgotPage').default))
      }, 'accountForgot')
    }
  },

  // 无路由匹配的情况一定要放到最后，否则会拦截所有路由
  { path: '*', component: require('components/404').default }
]
