import React from 'react'
import _ from 'lodash'
import { Menu, Badge, Icon } from 'antd'
import { Link } from 'react-router'
import { logout } from 'actions/user'

import { FormattedMessage } from 'react-intl'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

const menuMap = {
  product: {
    key: 'productPage',
    href: '/product'
  },
  productGroup: {
    key: 'productGroupPage',
    href: '/product/group'
  },
  order: {
    key: 'orderPage',
    href: '/order'
  }
}

function checkSelectedKeys(location) {
  const selectMenu = _.findLast(menuMap, (item) => {
    return location.pathname.indexOf(item.href) != -1
  })

  return selectMenu ? selectMenu.key : ''
}

const MenuControls = ({ closeBadge, orderSum, dispatch, location, mode, intl }) => {
  return (
    <Menu theme="dark"
      mode={mode}
      selectedKeys={checkSelectedKeys(location)}
      defaultOpenKeys={['productSub']}
      onClick={closeBadge} >
      <SubMenu
        key="productSub"
        title={<span><Icon type="tag-o" /><span className="nav-text"><FormattedMessage id='product_manage' /></span></span>}
      >
        <MenuItem key={menuMap['product'].key}><Link to={menuMap['product'].href}><FormattedMessage id='product' /></Link></MenuItem>
        <MenuItem key={menuMap['productGroup'].key}><Link to={menuMap['productGroup'].href}><FormattedMessage id='product_group' /></Link></MenuItem>
      </SubMenu>
      <MenuItem key={menuMap['order'].key}>
        <Link to={menuMap['order'].href}>
          <span>
            <Icon type="paper-clip" />
            <Badge dot={orderSum}>
              <span className="nav-text" style={styles.menuSpan}><FormattedMessage id='order_manage' /></span>
            </Badge>
          </span>
        </Link>
      </MenuItem>
      <MenuItem style={styles.layoutMenuBottom}>
        <div onClick={()=> dispatch(logout())}>
          <Icon style={styles.layoutMenuIcon} type="poweroff" />
          <span className="nav-text"><FormattedMessage id='login_out' /></span>
        </div>
      </MenuItem>
    </Menu>
  )
}

const styles = {
  layoutMenuBottom: {
    width: '100%',
    height: 42,
    lineHeight: '42px',
    paddingLeft: 24,
    position: 'absolute',
    bottom: 0,
    borderTop: '1px solid #333333'
  },
  layoutMenuIcon: {
    minWidth: 14,
    marginRight: 8
  },
  menuSpan: {
    minWidth: 50,
    display: 'inline-block'
  }
}
export default MenuControls
