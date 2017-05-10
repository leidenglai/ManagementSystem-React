import userAuth from 'utils/userAuth' // 用户访问拦截器
import createContainer from 'utils/createContainer'

const connectComponent = createContainer(
  ({ userData, productData }) => ({ userData, productData }), // mapStateToProps
  require('actions/product').default // mapActionCreators
)

export default {
  path: 'product',

  onEnter: userAuth,

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, createContainer(
        ({ userData }) => ({ userData }), // mapStateToProps,
        require('actions/product/group'), // mapActionCreators,
      )(require('containers/product').default))
    }, 'productView')
  },

  indexRoute: { // 对应 /product
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, connectComponent(require('containers/product/ListPage').default))
      }, 'productListView')
    }
  }
}
