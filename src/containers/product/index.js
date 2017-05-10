import React from 'react'
import { Layout } from 'antd'
// import { Link } from 'react-router'

/* 布局基页 */
export default class ProductView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { fetchProductGroupData, userData } = this.props

    // 获取产品分组列表
    fetchProductGroupData({ ownerId: userData.userId })
  }

  render() {
    const { children } = this.props
    return (
      <Layout>
        { children }
      </Layout>
    )
  }
}
