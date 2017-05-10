import update from 'immutability-helper'
import _ from 'lodash'
import createReducer from 'utils/createReducer'
import * as actionsType from 'actions/product/group'

export default createReducer({
  groupList: [],
  productList: {
    content: [],
    pageNum: 1,
    pageSize: 10,
    totalCount: 0
  },
  addProductList: {
    content: [],
    pageNum: 1,
    pageSize: 5,
    totalCount: 0
  }
}, {
  [actionsType.FETCH_PRODUCT_GROUP_DATA]: (productGroupData, { payload }) => {
    return update(productGroupData, { groupList: { $set: payload } })
  },
  [actionsType.MOVE_PRODUCT_TO_GROUP]: (productGroupData, { payload }) => {
    // 移入商品组
    return update(productGroupData, { groupList: { $set: payload } })
  },
  [actionsType.MOVE_PRODUCT_GROUP]: (productGroupData, { payload }) => {
    // 移动商品组排序
    return update(productGroupData, { groupList: { $set: payload } })
  },
  [actionsType.MOVE_OUT_PRODUCT_GROUP]: (productGroupData, { payload }) => {
    const { categoryId, productIds } = payload
    const count = productIds.split(',').length

    // 减少商品组的数量
    return update(productGroupData, {
      groupList: {
        $set: _.map(productGroupData.groupList, item => {
          item.categoryId == categoryId ? (item.productSize = item.productSize - count) : null
          return item
        })
      }
    })
  },
  [actionsType.ADD_PRODUCT_GROUP]: (productGroupData, { payload }) => {
    return update(productGroupData, { groupList: { $push: [payload] } })
  },
  [actionsType.EDIT_PRODUCT_GROUP]: (productGroupData, { payload }) => {
    return update(productGroupData, {
      groupList: {
        $set: _.map(productGroupData.groupList, (item) => item.categoryId == payload.categoryId ? payload : item)
      }
    })
  },
  [actionsType.DELETE_PRODUCT_GROUP]: (productGroupData, { payload }) => {
    return update(productGroupData, {
      groupList: {
        $splice: [[_.findIndex(productGroupData.groupList, ['categoryId', payload.categoryId]), 1]]
      }
    })
  },
  [actionsType.FETCH_GROUP_PRODUCTLIST_DATA]: (productGroupData, { payload }) => {
    // 获取组内商品
    return update(productGroupData, { productList: { $set: payload } })
  },
  [actionsType.MOVE_OUT_PRODUCT_GROUP_IN_GROUP_PAGE]: (productGroupData, { payload }) => {
    const { productList } = productGroupData
    const { productIds, categoryId } = payload
    // 移出商品组
    return update(productGroupData, {
      productList: {
        content: { $set: _.filter(productList.content, (item) => productIds.indexOf(item.productId) == -1) },
        totalCount: { $set: productList.totalCount - productIds.split(',').length }
      },
      groupList: {
        // 更新 group里面的数量
        $apply: (data) => {
          return _.map(data, (item) => {
            if (item.categoryId == categoryId) {
              item.productSize -= productIds.split(',').length
            }
            return item
          })
        }
      }
    })
  },
  [actionsType.FETCH_GROUP_ADD_PRODUCTLIST_DATA]: (productGroupData, { payload }) => {
    // 移入产品到商品组的产品列表
    return update(productGroupData, { addProductList: { $set: payload } })
  }
})
