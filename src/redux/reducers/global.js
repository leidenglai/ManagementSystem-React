import update from 'immutability-helper'
import * as actionType from 'actions/global'
import createReducer from 'utils/createReducer'

export default createReducer({
  loading: {
    status: false
  }
}, {
  // loading动画
  [actionType.SHOW_LOADING](globalData) {
    return update(globalData, { loading: { status: { $set: true } } })
  },
  [actionType.HIDE_LOADING](globalData) {
    return update(globalData, { loading: { status: { $set: false } } })
  }

})
