import { applyMiddleware, compose, createStore } from 'redux'
import { createRootReducer } from 'reducers'
import middlewares from './middlewares'
import syncHistoryWithStore from './syncHistoryWithStore'
import enhancers from './enhancers'

// ======================================================
// 实例化 Store
// ======================================================
const store = createStore(
  createRootReducer(),
  window.__INITIAL_STATE__ || {}, // 前后端同构（服务端渲染）数据同步
  compose(
    applyMiddleware(...middlewares),
    ...enhancers
  )
)
export default store

// ======================================================
// 增强版 history
// ======================================================
export const history = syncHistoryWithStore(store)
