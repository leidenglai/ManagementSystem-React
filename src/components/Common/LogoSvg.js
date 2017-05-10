import React, { PureComponent, PropTypes } from 'react'

/*
 * 组件属性
 * style 样式宽高颜色
 */
class LogoSvg extends PureComponent {
  static propTypes = {
    style: PropTypes.object.isRequired,
    color: PropTypes.string
  };

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={this.props.style}>
        <svg style={{width: '100%', height: '100%', fill: this.props.color}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74.68 44.37"><path class="cls-1" d="M50.1,10.92c1.69-2.61,2.22,8.4,3.18,7s7-11.06,7-11.06a3.93,3.93,0,0,0-.2-.78C60,6,57.91,0,51.79,0c-3.85,0-6.66,1-9.1,4.85-.55.87-13.9,22.07-18.19,28.84-1.57,1.74-2.1-8.56-3-7.19s-7,11.06-7,11.06a3.64,3.64,0,0,0,.18.75c0,.07,2.15,6.06,8.28,6.06,3.85,0,6.66-1,9.1-4.85C32.63,38.6,50.38,10.49,50.1,10.92Z"/><path class="cls-1" d="M31.92,17.78c.93-1.37,7-11.06,7-11.06a8.35,8.35,0,0,0-.62-1.62A9.57,9.57,0,0,0,33.49.56a8,8,0,0,0-3-.56h0c-3.85,0-6.66,1-9.1,4.85-.42.66-15.57,24.72-15.74,25a29.92,29.92,0,0,1-2.83,3.61C1.48,34.81.05,35.95,0,36.12a.53.53,0,0,0,.23.52,8.06,8.06,0,0,0,5.09,1.74c3.85,0,6.66-1,9.1-4.85.13-.2,11-17.32,14.58-23C30.49,9.42,31,19.11,31.92,17.78Z"/><path class="cls-1" d="M74.44,7.65a8.06,8.06,0,0,0-5.09-1.74c-3.85,0-6.66,1-9.1,4.85-.13.2-11,17.34-14.59,23.05-1.47,1-2-8.63-2.89-7.31s-7,11.06-7,11.06c-.1.19.32,1,.62,1.62a9.28,9.28,0,0,0,4.78,4.53,10.79,10.79,0,0,0,3.06.56h0c3.85,0,6.66-1,9.1-4.85.42-.66,15.57-24.72,15.74-25a30,30,0,0,1,2.83-3.61c1.29-1.38,2.71-2.51,2.75-2.68A.53.53,0,0,0,74.44,7.65Z"/>
        </svg>
      </div>
    )
  }
}
export default LogoSvg
