import ProductService from 'services/productService'
import { message } from 'antd'

import intlFormatString from 'utils/intlFormatString'

/**
 * 获取Product List数据
 */
export const FETCH_PRODUCTLIST_DATA_REQUEST = "FETCH_PRODUCTLIST_DATA_REQUEST"
export const FETCH_PRODUCTLIST_DATA_SUCCESS = "FETCH_PRODUCTLIST_DATA_SUCCESS"
export const FETCH_PRODUCTLIST_DATA_ERROR = "FETCH_PRODUCTLIST_DATA_ERROR"

function fetchProductListDataStart() {
  return {
    type: FETCH_PRODUCTLIST_DATA_REQUEST
  }
}

function fetchProductListDataSuccess(data, tabKey) {
  return {
    type: FETCH_PRODUCTLIST_DATA_SUCCESS,
    payload: {
      data,
      tabKey
    }
  }
}

function fetchProductListDataError(error) {
  return {
    type: FETCH_PRODUCTLIST_DATA_ERROR,
    error
  }
}

export function fetchProductListData(params, tabKey) {
  return dispatch => {
    dispatch(fetchProductListDataStart())

    ProductService.fetchProductList(params)
      .then(function(data) {
          dispatch(fetchProductListDataSuccess(data, tabKey))
        },
        function(error) {
          dispatch(fetchProductListDataError(error))
        }
      );
  }
}


export default {
  fetchProductListData
}
