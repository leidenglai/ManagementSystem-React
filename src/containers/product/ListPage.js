import React, { Component, PureComponent } from 'react'
import { history } from 'store'
import { SERVER_SHARE_ROOT, SERVER_CDN_ROOT } from 'config'
import update from 'immutability-helper'
import _ from 'lodash'
import { Layout, Row, Col, Button, Tabs, Badge, Select, Input, Table, Icon, Popover, Popconfirm, Menu, Dropdown, Modal } from 'antd'
// import QueueAnim from 'rc-queue-anim'

import BreadcrumbControls from 'components/Nav/BreadcrumbControls'
// import GroupModal from 'components/Product/GroupModal'
import QRCodeImg from 'components/Product/QRCodeCanvas'
import LogoSvg from 'components/Common/LogoSvg'

import getProductPrice from 'utils/getProductPrice'
import { injectIntl, FormattedMessage } from 'react-intl'

const { Header, Content } = Layout
const TabPane = Tabs.TabPane
const MenuItem = Menu.Item

class TabFilterNodes extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedGroupKey: '',
      keyword: ''
    }
  }

  handleGroupChange = value => {
    this.setState({ selectedGroupKey: value })
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value.trim()
    });
  }

  handleReset = () => {
    this.setState({
      selectedGroupKey: '',
      keyword: ''
    })
  }

  render() {
    const { selectedGroupKey, keyword } = this.state
    const { groupData } = this.props

    return (
      <div style={{paddingBottom: 16, borderBottom: '1px solid #e9e9e9'}}>
        <form onSubmit={this.props.handleSearch.bind(this, {groupId: selectedGroupKey, keyword, pageNum: 1})}>
          <div style={{ display: 'inline-block', marginRight: 16}}>
            <span><FormattedMessage id='product_group' />:</span>
            <Select value={selectedGroupKey} style={{ width: 160, marginLeft: 8 }} onChange={ this.handleGroupChange }>
              <Option value=""><FormattedMessage id='product_all' /></Option>
              {groupData.map((item, key) => <Option key={key} value={item.categoryId}>{item.categoryName}</Option>)}
            </Select>
          </div>
          <div style={{display: 'inline-block', marginRight: 8}}>
            <span><FormattedMessage id='search_keyword' />:</span>
            <Input placeholder={this.props.intl.formatMessage({id: 'write_product_name_or_keyword'})} name="keyword"
              style={{ width: 250, marginRight: 16, marginLeft: 8 }}
              onChange={this.handleInputChange} value={ keyword }/>
            <Button icon="search" htmlType="submit"><FormattedMessage id='search' /></Button>
          </div>
          <Button onClick={this.handleReset}><FormattedMessage id='reset' /></Button>
        </form>
      </div>
    )
  }
}
const TabFilterNodesIntl = injectIntl(TabFilterNodes)
class ProductTables extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      selectedRowKeys: [],
      hasSelected: false,
      groupModalVisible: false,
      deletePopVisible: true,
      previewVisible: false
    }
  }

  // 检查数据更新，重置状态
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.productData.content, this.props.productData.content)) {
      this.setState({
        selectedRowKeys: [],
        hasSelected: false
      })
    }
  }

  // 翻页、排序
  handleTableChange = (pagination, filters, sorter) => {
    this.props.handleTableChange({ pageNum: pagination.current, sortField: sorter.columnKey, sortOrder: (sorter.order && sorter.order == 'descend' ? 'desc' : 'asc') })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys, hasSelected: !!selectedRowKeys.length });
  }

  handleMoveInGroup = () => {
    this.setState({
      groupModalVisible: true
    })
  }

  handleGroupModalCancel = () => {
    this.setState({
      groupModalVisible: false
    })
  }

  handleGroupModalOk = (selectedGroup) => {
    let groupIds = []
    _.forEach(selectedGroup, (val, key) => val && groupIds.push(key))

    // 移入商品组
    const parmas = {
      productIds: this.state.selectedRowKeys.join(),
      categoryIds: groupIds.join()
    }

    this.props.moveProducttoGroup(parmas)

    this.setState({
      selectedRowKeys: [],
      hasSelected: false,
      groupModalVisible: false
    })
  }

  // 移出商品组
  handleMoveOutGroup = () => {

    this.props.handleSelectedsChange('moveOut', this.state.selectedRowKeys)

    this.setState({
      selectedRowKeys: [],
      hasSelected: false
    })
  }

  // 删除产品
  handleDeleteProduct = () => {
    this.props.handleSelectedsChange('delete', this.state.selectedRowKeys)

    this.setState({
      selectedRowKeys: [],
      hasSelected: false
    })
  }

  // 上下架
  handleSelectedsChange = (type) => {
    this.props.handleSelectedsChange(type, this.state.selectedRowKeys)
    this.setState({
      selectedRowKeys: [],
      hasSelected: false
    })
  }

  handleSiteSelect = (productId, { key }) => {
    const { handleSelectedsChange } = this.props
    if (key == 'delete') {
      Modal.confirm({
        title: this.props.intl.formatMessage({ id: 'if_delete_product' }),
        onOk() {
          handleSelectedsChange(key, [productId])
        },
        onCancel() {}
      })
    } else {
      handleSelectedsChange(key, [productId])
    }
  }

  handlePreviewVisibleChange = () => {
    this.setState({ previewVisible: true })
  }

  getProductMobileUrl = (productId) => {
    const url = `${SERVER_SHARE_ROOT}/detail.html?&locale=${window.localLanguage}&ownerId=${this.props.userId}&productId=${productId}`

    return url
  }

  moreMenu = (item) => (
    <Menu style={{minWidth: 108}} onClick={this.handleSiteSelect.bind(this, item.productId)}>
      {!item.isVisible ? (<MenuItem key="online" style={{paddingLeft: 0, paddingRight: 0}}>
        <span style={{paddingLeft: 15}}><FormattedMessage id='new_product_now' /></span>
        </MenuItem>)
        : (<MenuItem key="offline">
          <span><FormattedMessage id='sold_out_now' /></span>
        </MenuItem>)
      }
      <MenuItem key="delete"><span><FormattedMessage id='delete_product' /></span></MenuItem>
    </Menu>
  )

  render() {
    const { productData, tabKey, hanldeEditProduct } = this.props
    const { selectedRowKeys, hasSelected } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: selectedRowKeys => this.onSelectChange(selectedRowKeys)
    }

    const columns = [
      {
        title: <FormattedMessage id='product_message' />,
        key: 'product',
        width: '55%',
        render: (text, item) => (
          <div style={{position: 'relative'}}>
            <div style={{position: 'absolute', width: 48, height: 48, top: '50%', marginTop: -24}}>
              {(item.productPics && item.productPics[0]) ? <img width="100%" height="100%" src={item.productPics && item.productPics[0]} alt=""/> : <div style={{width: '100%', height: '100%', border: '1px solid #e9e9e9'}}><LogoSvg style={{width: '70%', height: '70%', margin: '15%'}} color={'#d9d9d9'} /></div> }
            </div>
            <div style={{paddingLeft: 64}}>
              <p>{item.productName}</p>
              <p style={{color: '#999999'}}><FormattedMessage id='product_ID' />: {item.productShortId}</p>
              {item.isVisible <= 0 ?
                <p style={{color: '#f56a00'}}><FormattedMessage id='sold_out_finish' /></p> : null}
            </div>
          </div>
        )
      }, {
        title: <FormattedMessage id='product_price' />,
        key: 'productPrice',
        sorter: true,
        width: '15%',
        className: 'ant-table-selection-column',
        render: (text, item) => (
          <div>
              {getProductPrice(item)[0]}
              {getProductPrice(item)[1] && '-' + getProductPrice(item)[1]}
            </div>
        )
      }, {
        title: <FormattedMessage id='product_group' />,
        key: 'group',
        width: '12%',
        className: 'ant-table-selection-column',
        render: (text, item) => (
          <div>
            {item.categoryList && _.map(item.categoryList, 'categoryName').join(', ')}
          </div>
        )
      }, {
        title: <FormattedMessage id='product_operation' />,
        key: 'action',
        className: 'ant-table-operations',
        width: 150,
        render: (text, item) => (
          <p style={{lineHeight: 1}}>
              <div style={{marginBottom: 4}}>
                <a href="javascript:;" onClick={hanldeEditProduct.bind(this, item, 'edit')}><FormattedMessage id='edit' /></a>
              </div>
              <div style={{marginBottom: 4}}>
                <a href="javascript:;" onClick={hanldeEditProduct.bind(this, item, 'similar')}><FormattedMessage id='add_similar_product' /></a>
              </div>
              <div style={{marginBottom: 4}}>
                <Popover
                  content={(<div style={{textAlign: 'center', width: 128}}>
                    <QRCodeImg
                      idName={`product-detial-${item.productId}`}
                      urlString={this.getProductMobileUrl(item.productId)}
                    />
                    <p style={{marginTop: 4}}><FormattedMessage id='phone_scan_code_to_preview' /></p>
                  </div>)}
                >
                  <a href="javascript:;"><FormattedMessage id='preview' /></a>
                </Popover>
              </div>

              <div style={{marginBottom: 4}}>
                <Dropdown overlay={this.moreMenu(item)}>
                  <a href="javascript:;" className="ant-dropdown-link">
                  <FormattedMessage id='more' /> <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
          </p>
        )
      }
    ]

    return (
      <div style={{paddingTop: 16}}>
        <div style={{marginBottom: 8}}>

          <Button style={styles.tableTopBtn}
            size="small"
            type="primary"
            disabled={ !hasSelected || tabKey == 'online' }
            onClick={this.handleSelectedsChange.bind(this, 'online')}
          ><FormattedMessage id='new_product_now' /></Button>

          <Button style={styles.tableTopBtn}
            size="small"
            type="primary"
            disabled={ !hasSelected || tabKey == 'offline' }
            onClick={this.handleSelectedsChange.bind(this, 'offline')}
          ><FormattedMessage id='sold_out_now' /></Button>

          <Popconfirm title={this.props.intl.formatMessage({id: 'if_delete_selected_product'})} onConfirm={this.handleDeleteProduct}>
            <Button
              style={styles.tableTopBtn}
              size="small"
              type="primary"
              disabled={ !hasSelected }
            ><FormattedMessage id='delete_product' /></Button>
          </Popconfirm>

          <span>{hasSelected ? `Selected ${selectedRowKeys.length} items` : null}</span>
        </div>
          <Table
            pagination={{
              current: productData.pageNum,
              defaultCurrent: 1,
              total: (productData.content.length > 0 ? productData.totalCount : 0),
              pageSize: productData.pageSize,
              showTotal: (total, range) => <FormattedMessage id='super_range_items' values={{rangeFrom: range[0], rangeTo: range[1], total: total}}/>
            }}
            onChange={this.handleTableChange}
            loading={this.props.loading}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={productData.content}
            rowKey="productId"
            locale={{
              emptyText: (
                <div>
                  <div style={{width: 100, height: 100, backgroundImage: `url(${SERVER_CDN_ROOT}/static/product-list-empty.png)`, backgroundSize: '100% 100%', margin: '112px auto 24px'}}>
                  </div>
                  <div style={{marginBottom: 100}}>
                    <p style={{fontSize: 18, color: '#333333'}}>{this.props.defaultEmptyText}</p>
                  </div>
                </div>)
            }} />
      </div>
    )
  }
}
const ProductTablesIntl = injectIntl(ProductTables)

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: 'all',
      sortField: 'updateDate', // 默认按产品修改时间排序
      sortOrder: 'desc', // 排序规则 asc正排，desc倒排
      loading: { // tab loading 动画
        all: false,
        online: false,
        offline: false
      },
      tabParams: { // 保存请求参数
        all: {
          pageSize: 10,
          keyword: '',
          groupId: '',
          isVisible: '',
          sortField: 'updateDate',
          sortOrder: 'desc'
        },
        online: {
          pageSize: 10,
          keyword: '',
          groupId: '',
          isVisible: '',
          sortField: 'updateDate',
          sortOrder: 'desc'
        },
        offline: {
          pageSize: 10,
          keyword: '',
          groupId: '',
          isVisible: '',
          sortField: 'updateDate',
          sortOrder: 'desc'
        }
      },
      tabInfo: { // tab信息
        all: {
          title: <FormattedMessage id='product_all' />,
          loading: false,
          request: false
        },
        online: {
          title: <FormattedMessage id='new_product_finish' />,
          loading: false,
          request: false
        },
        offline: {
          title: <FormattedMessage id='sold_out_finish' />,
          loading: false,
          request: false
        }
      }
    }

    // 保存当前请求的tab，防止请求过程中切换tab造成数据混乱
    this.requestTabKay = 'all'

    // 保存产品总数
    this.totalCount = 0
  }

  componentDidMount() {
    const { fetchProductTabCount, productData } = this.props;
    const { productListData } = productData

    // 获取每个tab数量
    fetchProductTabCount((totalCount) => {
      this.totalCount = totalCount
    })

    // 请求初始数据
    if (productListData.all.content.length <= 0) {
      this.handleSearch()
    }
  }

  componentWillReceiveProps(nextProps) {

    const { tabInfo } = this.state

    // 隐藏loading
    this.setState({
      tabInfo: update(tabInfo, {
        [this.requestTabKay]: { loading: { $set: false } }
      })
    })
  }

  handleSearch = (params = {}, event) => {
    const { fetchProductListData } = this.props // 搜索产品列表
    const { tabKey, tabInfo, tabParams } = this.state
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    // 参数
    let data = {}

    if (params.keyword || params.keyword === '') {
      data.keyword = params.keyword
    }

    if (params.groupId || params.groupId === '') {
      data.groupId = params.groupId
    }

    if (params.pageNum) {
      data.pageNum = params.pageNum
    }

    if (params.pageSize) {
      data.pageNum = params.pageSize
    }

    if (this.state.tabKey != 'all') {
      data.isVisible = (tabKey == 'online' ? 1 : 0)
    }

    if (params.sortField) {
      data.sortField = params.sortField
      data.sortOrder = params.sortOrder
    }

    data = _.assign(tabParams[tabKey], data)

    this.requestTabKay = tabKey

    this.setState({
      tabInfo: update(tabInfo, {
        [tabKey]: { loading: { $set: true } }
      }),
      tabParams: update(tabParams, {
        [tabKey]: { $set: data }
      })
    })

    fetchProductListData(data, tabKey)
  }

  handleTabChange = (key) => {
    const { tabInfo, tabParams } = this.state
    if (!tabInfo[key].request) {
      this.setState({
        tabKey: key,
        tabInfo: update(tabInfo, {
          [key]: { loading: { $set: true }, request: { $set: true } }
        }),
        tabParams: update(tabParams, {
          [key]: { pageNum: { $set: 1 } }
        })
      }, () => {
        this.handleSearch()
      })
    } else {
      this.setState({
        tabKey: key
      })
    }
  }

  // 产品批量操作和 单独操作（selectedRowKeys只有一个值时）
  handleSelectedsChange = (type, selectedRowKeys) => {
    const { tabKey, tabInfo } = this.state

    // type === 'moveOut' 移出产品组
    // type === 'online' 上架
    // type === 'offline' 下架
    // type === 'delete' 删除
    switch (type) {
      case 'moveOut':
        this.requestTabKay = tabKey
        this.props.moveOutProductGroup({ productIds: selectedRowKeys.join(), categoryId: this.state.tabParams[this.requestTabKay].groupId }, tabKey)
        break;
      case 'online':
        this.setState({
          tabInfo: update(tabInfo, {
            all: { request: { $set: tabKey == 'all' } },
            online: { request: { $set: tabKey == 'online' } },
            offline: { request: { $set: tabKey == 'offline' } }
          })
        })
        this.props.onlineProduct({ productIds: selectedRowKeys.join() }, tabKey)
        break;
      case 'offline':
        this.setState({
          tabInfo: update(tabInfo, {
            all: { request: { $set: tabKey == 'all' } },
            online: { request: { $set: tabKey == 'online' } },
            offline: { request: { $set: tabKey == 'offline' } }
          })
        })
        this.props.offlineProduct({ productIds: selectedRowKeys.join() }, tabKey)
        break;
      case 'delete':
        this.setState({
          tabInfo: update(tabInfo, {
            all: { request: { $set: tabKey == 'all' } },
            online: { request: { $set: tabKey == 'online' } },
            offline: { request: { $set: tabKey == 'offline' } }
          })
        })
        this.props.deleteProduct({ productIds: selectedRowKeys.join() }, tabKey)
        break;
    }
  }

  moveProducttoGroup = (parmas) => {
    this.props.moveProducttoGroup(parmas, () => {
      this.handleSearch()
    })
  }

  goAddPage = () => {
    this.props.resetProductDetail({})
    history.push('/product/add/')
  }

  hanldeEditProduct = (productData, type) => {
    if (type == 'edit') {
      history.push('/product/edit/' + productData.productId)
    } else { // 添加类似商品
      history.push('/product/add/')
    }

    this.props.fetchProductListtoDetail(productData, this.state.tabKey)
  }

  render() {
    const { productGroupData, productListData } = this.props.productData
    const { tabInfo, tabParams } = this.state

    return (
      <Layout>
        <Header style={{ backgroundColor: '#fff', padding: '0 16px' }}>
          <Row style={{ height: 64, lineHeight: '64px' }}>
            <Col span={12}>
              <BreadcrumbControls items={[
                {name: this.props.intl.formatMessage({ id: 'product' }), path: "/product"}
                ]}/>
            </Col>
            <Col span={12} style={{ textAlign: 'right'}}>
              <Button type="primary" icon="plus" onClick={this.goAddPage}><FormattedMessage id='add_new_product' /></Button>
            </Col>
          </Row>
        </Header>
        <Content id="product-tabs-card-container">
          <div style={{ margin: '8px 16px 16px'}}>
            <Tabs type="card" onTabClick={this.handleTabChange} >
              {_.map(productListData, (item, key)=> {
                return (<TabPane tab={<span>{tabInfo[key].title} <Badge count={item.totalCount} overflowCount={999} style={styles.tabsBadge} /></span>} key={key}>
                  <TabFilterNodesIntl
                    handleSearch={this.handleSearch}
                    groupData={productGroupData.groupList}
                  />
                  <ProductTablesIntl
                    productData={item}
                    userId={this.props.userData.userId}
                    groupData={productGroupData.groupList}
                    defaultEmptyText={!this.totalCount ? <FormattedMessage id='you_have_not_prouct' /> : <FormattedMessage id='no_result_order' />}
                    loading={tabInfo[key].loading}
                    handleTableChange={this.handleSearch}
                    moveProducttoGroup={this.moveProducttoGroup}
                    currentGroupId={tabParams[key].groupId}
                    tabKey={key}
                    handleSelectedsChange={this.handleSelectedsChange}
                    hanldeEditProduct={this.hanldeEditProduct}
                  />
                </TabPane>)
              })}
            </Tabs>
          </div>
        </Content>
      </Layout>
    )
  }
}

export default injectIntl(ProductList)

const styles = {
  tabsBadge: {
    backgroundColor: '#fff',
    color: '#999',
    boxShadow: '0 0 0 1px #d9d9d9 inset',
    fontSize: 12,
    height: 17,
    lineHeight: '17px',
    top: -2
  },

  tableTopBtn: {
    marginRight: 8,
    fontWeight: '300'
  }
}
