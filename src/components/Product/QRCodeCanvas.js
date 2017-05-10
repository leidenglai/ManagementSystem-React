import React, { PureComponent } from 'react'
import QRCode from 'utils/QRCode/qrcode'
/**
 * 生成二维码
 *@prmars urlString 实际url
 *
 */
class QRCodeImg extends PureComponent {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    colorDark: React.PropTypes.number,
    colorLight: React.PropTypes.number,
    urlString: React.PropTypes.string.isRequired,
    idName: React.PropTypes.string.isRequired
  };

  static defaultProps = { // 组件默认的props对象
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff"
  }

  constructor(props) {
    super(props)

    this.qrcode = {}
  }
  componentDidMount() {
    const { idName, urlString, width, height, colorDark, colorLight } = this.props
    this.qrcode = new QRCode(document.getElementById(idName), {
      text: urlString,
      width,
      height,
      colorDark,
      colorLight,
      correctLevel: QRCode.CorrectLevel.H
    })
  }

  componentDidUpdate() {
    this.qrcode.makeCode(this.props.urlString);
  }

  componentWillUnmount() {
    this.qrcode.clear()
  }

  render() {
    return (
      <div id={this.props.idName} ref="qrcode"></div>
    )
  }
}

export default QRCodeImg
