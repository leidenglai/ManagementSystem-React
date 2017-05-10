import React from 'react';
import { SERVER_CDN_ROOT } from 'config'

const SellerLogo = ({ userData }) => {
  const styles = {
    userData: {
      height: 64,
      width: '100%',
      borderBottom: '1px solid #333333'
    },
    logo: {
      height: 40,
      width: 40,
      margin: 12,
      position: 'absolute',
      overflow: 'hidden',
      borderRadius: 2,
      background: `url(${userData.userImagePath || SERVER_CDN_ROOT + '/static/logo-icon.png'}) center center / 40px 40px no-repeat`
    },
    info: {
      margin: '0 20px 0 64px',
      paddingTop: 12
    }
  }
  return (
    <div style={styles.userData}>
      <div style={styles.logo}>
      </div>
      <div style={styles.info}>
        <p style={{
          fontSize: 16,
          lineHeight: '40px',
          color: '#ffffff',
          overflow: 'hidden',
          maxHeight: 40
        }}>{userData.nickName}</p>
      </div>
    </div>
  )
}

export default SellerLogo
