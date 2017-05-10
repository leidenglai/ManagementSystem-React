import React from 'react'
import { Layout } from 'antd'
import { getUserData, fetchNewOrderSum, closeOrderSum } from 'actions/user'
import SellerLogo from 'components/Nav/SellerLogo'
import TopProgress from 'components/Nav/TopProgress'
import MenuControls from 'components/Nav/MenuControls'
const { Sider } = Layout

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      mode: 'inline',
      orderSum: false
    }

    const { dispatch } = props

    // 将用户数据加载到store中
    dispatch(getUserData())
  }

  componentDidMount() {
    const { dispatch, location } = this.props
    const that = this

    if (location.pathname.indexOf('/order') != -1) {
      this.setState({ orderSum: false })
      dispatch(closeOrderSum())
    } else {
      dispatch(fetchNewOrderSum(function(sum) {
        if (sum && sum > 0) {
          that.setState({ orderSum: true })
        }
      }))
    }
  }

  onCollapse = (collapsed) => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    });
  }

  closeBadge = ({ item, key, keyPath }) => {
    const { dispatch } = this.props

    if (key == 'orderPage') {
      this.setState({ orderSum: false })
      dispatch(closeOrderSum())
    }
  }

  render() {
    const { location, userData, dispatch, globalData } = this.props
    return (
      <Layout style={styles.app}>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          width={224}
          style={styles.sider}
          >
          <SellerLogo userData={ userData }/>

          <MenuControls
            orderSum={this.state.orderSum}
            closeBadge={this.closeBadge}
            dispatch={dispatch}
            location={location}
            mode={this.state.mode}
          />
        </Sider>
        <Layout>
          <TopProgress globalData={globalData} />
          { this.props.children }
        </Layout>
      </Layout>
    );
  }
}
export default App

const styles = {
  app: {
    position: "relative",
    width: "100%",
    height: "100%"
  },
  sider: {
    backgroundColor: '#404040'
  },
  menu: {
    color: '#ffffff'
  }
}
