import packOptionsToFetch from './fetch'

/**
 * 对应后端涉及到产品的 API
 */
class ProductService {
  /**
   * 产品列表
   * @param  {Object} 请求条件
   * @return {Promise}
   */
  fetchProductList(params) {
    return packOptionsToFetch({
      method: 'post',
      api: '/product/xxxx.do',
      params: params
    })
  }
}

// 实例化后再导出
export default new ProductService()
