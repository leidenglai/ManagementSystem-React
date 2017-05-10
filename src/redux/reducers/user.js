import update from 'immutability-helper'
import createReducer from 'utils/createReducer'
import * as actionType from 'actions/account'
import { USERDATA_GET, LOG_OUT } from 'actions/user'

export default createReducer({}, {
  [actionType.LOG_IN_SUCCESS]: (userData, { payload }) => {
    return update(userData, { $set: payload })
  },
  [actionType.LOG_IN_ERROR]: (userData, { payload, errOpen }) => {
    return update(userData, { $set: { type: 'error', msg: payload, errOpen: errOpen } });
  }
})
