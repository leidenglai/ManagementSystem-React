import React from 'react'
import { Layout } from 'antd'
import TopProgress from 'components/Nav/TopProgress'
import { SERVER_CDN_ROOT } from 'config'
const { Header } = Layout
/**
 * 本组件为登录模块的容器页
 * 由于与app内容模块布局不一样
 * 所以区别于App.js
 */

const App = ({ children, globalData }) => (
  <div style={styles.container} className="container">
    <Layout style={styles.container}>
      <Header style={styles.topLogo}>
        <div style={styles.logo}></div>
      </Header>
      <TopProgress globalData={globalData} />
      { children }
    </Layout>
  </div>
)

const styles = {
  container: {
    height: '100%'
  },
  topLogo: {
    backgroundColor: '#ffffff'
  },
  logo: {
    height: 64,
    width: '100%',
    background: `url(${SERVER_CDN_ROOT}/static/logo@2x-black.png) center center / 180px 25px no-repeat`
  }
}

export default App
