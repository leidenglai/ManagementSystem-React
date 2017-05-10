import update from 'immutability-helper'
import _ from 'lodash'
import createReducer from 'utils/createReducer'
import * as actionsType from 'actions/product/list'
import { MOVE_OUT_PRODUCT_GROUP } from 'actions/product/group'
import { POST_ADD_PRODUCT_SUCCESS, POST_UPDATE_PRODUCT_SUCCESS } from 'actions/product/edit'

export default createReducer({
  all: {
    content: [],
    pageNum: 1,
    pageSize: 10,
    totalCount: 0
  },
  online: {
    content: [],
    pageNum: 1,
    pageSize: 10,
    totalCount: 0
  },
  offline: {
    content: [],
    pageNum: 1,
    pageSize: 10,
    totalCount: 0
  }
}, {
  [actionsType.FETCH_PRODUCTLIST_DATA_SUCCESS]: (productListData, { payload }) => {
    const { data, tabKey } = payload
    return update(productListData, {
      [tabKey]: {
        content: { $set: data.content || [] },
        pageNum: { $set: data.pageNum },
        pageSize: { $set: data.pageSize },
        totalCount: { $set: data.totalCount }
      }
    })
  },
  [actionsType.FETCH_PRODUCT_VISIBLE_COUNT]: (productListData, { payload }) => {
    return update(productListData, {
      all: { totalCount: { $set: payload.onLineSum + payload.offLineSum } },
      online: { totalCount: { $set: payload.onLineSum } },
      offline: { totalCount: { $set: payload.offLineSum } }
    })
  },
  [MOVE_OUT_PRODUCT_GROUP]: (productListData, { payload }) => {
    const { tabKey, productIds } = payload
    // 移出分组
    // 删除redux state数据，更新props和totalCount
    // 只有当在productList页面才处理（有tabkey参数）
    if (tabKey) {
      return update(productListData, {
        [tabKey]: {
          content: { $set: _.filter(productListData[tabKey].content, (item) => productIds.indexOf(item.productId) == -1) },
          totalCount: { $set: productListData[tabKey].totalCount - productIds.split(',').length }
        }
      })
    }
  },
  [actionsType.ONLINE_PRODUCT]: (productListData, { payload }) => {
    const { tabKey, productIds } = payload
    // 上架
    // 在“上架”tab下时，页面移出产品
    // 在“全部”tab下时，直接修改状态
    if (tabKey == 'all') {
      return update(productListData, {
        [tabKey]: {
          content: {
            $set: _.map(productListData[tabKey].content, (item) => {
              if (productIds.indexOf(item.productId) != -1) {
                item.isVisible = 1
              }

              return item
            })
          }
        }
      })
    } else {
      return update(productListData, {
          [tabKey]: {
          content: { $set: _.filter(productListData[tabKey].content, (item) => productIds.indexOf(item.productId) == -1) },
          totalCount: { $set: productListData[tabKey].totalCount - payload.productIds.split(',').length }
        }
      })
    }
  },
  [actionsType.OFFLINE_PRODUCT]: (productListData, { payload }) => {
    const { tabKey, productIds } = payload
    // 下架
    // 在“下架”tab下时，页面移出产品
    // 在“全部”tab下时，直接修改状态
    if (tabKey == 'all') {
      return update(productListData, {
        [tabKey]: {
          content: {
            $set: _.map(productListData[tabKey].content, (item) => {
              if (productIds.indexOf(item.productId) != -1) {
                item.isVisible = 0
              }

              return item
            })
          }
        }
      })
    } else {
      return update(productListData, {
        [tabKey]: {
          content: { $set: _.filter(productListData[tabKey].content, (item) => productIds.indexOf(item.productId) == -1) },
          totalCount: { $set: productListData[tabKey].totalCount - productIds.split(',').length }
        }
      })
    }
  },
  [actionsType.DELETE_PRODUCT]: (productListData, { payload }) => {
    const { tabKey, productIds } = payload
    // 删除 直接移出页面
    return update(productListData, {
      [tabKey]: {
        content: { $set: _.filter(productListData[tabKey].content, (item) => productIds.indexOf(item.productId) == -1) },
        totalCount: { $set: productListData[tabKey].totalCount - productIds.split(',').length }
      }
    })
  },
  [POST_ADD_PRODUCT_SUCCESS]: (productListData, { payload }) => {
    const tabKey = payload.isVisible == 1 ? 'online' : 'offline'

    // 新建商品成功
    return update(productListData, {
      all: {
        content: {
          $apply: (x) => {
            if (x.length >= productListData['all'].pageSize) {
              x.pop()
            }
            x.unshift(payload)
            return x
          }
        },
        totalCount: { $set: productListData['all'].totalCount + 1 }
      },
      [tabKey]: {
        content: {
          $apply: (x) => {
            if (x.length >= productListData[tabKey].pageSize) {
              x.pop()
            }
            x.unshift(payload)
            return x
          }
        },
        totalCount: { $set: productListData[tabKey].totalCount + 1 }
      }
    })
  },
  [POST_UPDATE_PRODUCT_SUCCESS]: (productListData, { payload }) => {
    const { productId } = payload
    // 编辑后list页面数据
    return update(productListData, {
      all: {
        content: {
          $apply: (data) => {
            return _.map(data, (item) => {
              if (item.productId == productId) {
                return payload
              } else {
                return item
              }
            })
          }
        }
      },
      online: {
        content: {
          $apply: (data) => {
            return _.map(data, (item) => {
              if (item.productId == productId) {
                return payload
              } else {
                return item
              }
            })
          }
        }
      },
      offline: {
        content: {
          $apply: (data) => {
            return _.map(data, (item) => {
              if (item.productId == productId) {
                return payload
              } else {
                return item
              }
            })
          }
        }
      }
    })
  }
})
