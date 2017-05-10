import createReducer from 'utils/createReducer'
import { FETCH_PRODUCT_LIST_TO_DETAIL } from 'actions/product/list'
import { RESET_PRODUCT_DETAIL, POST_UPDATE_PRODUCT_SUCCESS } from 'actions/product/edit'

export default createReducer({}, {
  [FETCH_PRODUCT_LIST_TO_DETAIL]: (productEditData, { payload }) => {
    return payload
  },
  [RESET_PRODUCT_DETAIL]: (productEditData, { payload }) => {
    return payload
  },
  [POST_UPDATE_PRODUCT_SUCCESS]: (productEditData, { payload }) => {
    return payload
  }
})
