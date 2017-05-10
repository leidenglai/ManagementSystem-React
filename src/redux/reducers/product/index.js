import { combineReducers } from 'redux'
import listReducer from './list'
import groupReducer from './group'
import editReducer from './edit'

export default combineReducers({
  productListData: listReducer,
  productEditData: editReducer,
  productGroupData: groupReducer
})
