import React from 'react'
import _ from 'lodash'
import { Breadcrumb } from 'antd'
import { Link } from 'react-router'

const BreadcrumbItem = Breadcrumb.Item

const BreadcrumbControls = ({ items }) => {
  const { location } = window

  return (
    <Breadcrumb>
      {items.map((val, key) => (<BreadcrumbItem key={key} style={key == 0 ? styles.itemOne : styles.itemOther } >
        { _.trimEnd(location.pathname, '/') == _.trimEnd(val.path, '/') ? val.name : <Link to={val.path}>{val.name}</Link>}
      </BreadcrumbItem>))}
    </Breadcrumb>
  )
}

const styles = {
  itemOne: { fontSize: 16, fontWeight: 600 },
  itemOther: { fontSize: 12, fontWeight: 400 }
}

export default BreadcrumbControls
