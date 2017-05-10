import React, { PureComponent, Component } from 'react'
import { Card, Button, Row, Col, Input, Alert, Tooltip, Layout } from 'antd'
import { injectIntl, FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
const { Content } = Layout

// React.PureComponent is exactly like React.
// Component but implements shouldComponentUpdate() with a shallow prop and state comparison.

class NumericInput extends PureComponent {
  onChange = (e) => {
    const { value } = e.target;
    const reg = /^[0-9]*$/;
    if (reg.test(value)) {
      this.props.onChange(value);
    }
  }
  render() {
    return (
      <Tooltip
        trigger={['focus']}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          {...this.props}
          onChange={this.onChange}
          onBlur={this.onBlur}
          maxLength="20"
          size="large"
        />
      </Tooltip>
    );
  }
}
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      telNum: '',
      userPwd: '',
      errOpen: false,
      error: ''
    }
  }

  onChange = (telNum) => {
    this.setState({ telNum })
  }

  handleKey = (event) => {
    this.setState({ userPwd: event.target.value })
  }

  hanlderChange = (event) => {
    event.stopPropagation()
    event.preventDefault()

    const { telNum, userPwd } = this.state

    this.props.login({ telNum, userPwd })
  }

  render() {
    return (
      <Content>
        <Row type="flex" justify="center">
          <Col style={styles.loginBox} xs={18} sm={12} md={9} lg={6}>
            <Card>
              <form onSubmit={this.hanlderChange}>
                <div style={styles.title}><FormattedMessage id='user_login' defaultMessage='Login' /></div>
                <Alert message={this.props.userData.type == 'error' && this.props.userData.msg} type="error" showIcon style={{display: (this.state.errOpen == true || this.props.userData.type == 'error' ? "block" : "none"), ...styles.errorAlert}}/>
                <NumericInput style={styles.inputname} value={this.state.telNum} onChange={this.onChange} placeholder={this.props.intl.formatMessage({id: 'please_input_phone'})} />
                <div style={{position: "relative"}}>
                  <Input type="password" size="large" maxLength={20} placeholder={this.props.intl.formatMessage({id: 'please_input_pass'})} style={styles.inptkey} value={this.state.userPwd} onChange={this.handleKey}/>
                  <Link to="/account/forgot"><div style={styles.forgot} ><FormattedMessage id='forgot_pass' /></div></Link>
                </div>
                <Button type="primary" htmlType="submit" size="large" style={styles.loginBtn} ><FormattedMessage id='login' /></Button>
                <div style={styles.promOne}><FormattedMessage id='problems_contact_us' /></div>
              </form>
            </Card>
          </Col>
        </Row>
      </Content>
    )
  }
}
export default injectIntl(Login)

const styles = {
  errorAlert: {
    margin: "0 auto",
    marginTop: -12,
    marginBottom: 0,
    width: "80%",
    textAlign: "left"
  },
  loginBox: {
    marginTop: 100,
    textAlign: "center"
  },
  loginBtn: {
    marginBottom: 23,
    width: "80%",
    height: 32,
    lineHeight: "21px"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: "30px",
    marginBottom: 20,
    marginTop: 8
  },
  inputname: {
    marginTop: 8,
    width: "80%"
  },
  inptkey: {
    marginTop: 8,
    marginBottom: 24,
    width: "80%",
    display: "inline-block",
    paddingRight: 72
  },
  forgot: {
    position: "absolute",
    top: 15,
    right: 45,
    display: "inline-block",
    border: "none",
    color: "#0e77ca",
    cursor: "pointer"
  },
  promOne: {
    color: '#b0b0b0'
  }
}
