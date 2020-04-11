import React, { Component } from 'react';
import { weChatLogin, get_wx_access_token } from '@/api/userApi';
import { Button } from 'antd-mobile';
import {  Cancel, wechatLogin, phoneLogin, logo, Slogan } from './style';
import axios from 'axios';


const AppID = 'wxf5fff2aa6e0b1af7';
const AppSecret = 'f396ab92d74c2ba72021d102aa67750b';

// function generateGetCodeUrl(redirectURL) {
//   return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
//       .addQuery("appid", AppID)
//       .addQuery("redirect_uri", redirectURL)
//       .addQuery("response_type", "code")
//       .addQuery("scope", "snsapi_userinfo")
//       .addQuery("response_type", "code")
//       .hash("wechat_redirect")
//       .toString();
// };

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: ""};

    this.handleWechatBtnClick = this.handleWechatBtnClick.bind(this);
    this.handlePhoneBtnClick = this.handlePhoneBtnClick.bind(this);
    this.cancelLogin = this.cancelLogin.bind(this);
  }

  render() {
    return (
      <div style={{ position: 'relative'}}>
        <Cancel onClick={this.cancelLogin}></Cancel>
        <img src={require('@/statics/img/title.png')} style={logo} alt="头像" ></img>
        <Slogan>唯有美食与爱不可辜负</Slogan>
        {/* <a href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=https%3A%2F%2F08b2ee24.ngrok.io%2F&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'>直接跳转到微信提供的网页</a> */}
        <Button style={wechatLogin} onClick={this.handleWechatBtnClick}>使用微信登录</Button>
        <Button style={phoneLogin} onClick={this.handlePhoneBtnClick}>手机登录注册</Button>
      </div>
    );
  }

  handleWechatBtnClick() {

    var return_uri = encodeURIComponent('https://30134e6b.ngrok.io/');  
    // const uri = new URI(document.location.href);
    // const query = uri.query(true);
    // const {code} = query;

    // if(code) {
    //     WechatUserStore.fetchUserInfo(code);

    //     next();

    // } else {

        document.location = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=http%3A%2F%2F6a9dbb81.ngrok.io%2F&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    // }

    // var return_uri = encodeURIComponent('https://08b2ee24.ngrok.io/');  
    // var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'

    // axios.get(url).then(res => {
    //   console.log('res', res)
    // })
      // console.log('使用微信登录')
      // weChatLogin().then(res => {
      //   console.log('weChatLogin', res)
      // }).catch((err) => {
      //   console.log('error', err);
      // })
      // get_wx_access_token().then(res => {
      //   console.log('weChatLogin', res)
      // }).catch((err) => {
      //   console.log('error', err);
      // })
  }

  handlePhoneBtnClick() {
    this.props.history.push('/phoneRegister');
  }
  
  cancelLogin() {
    this.props.history.push({
      pathname: '/tab/home/recommend'
    })
  }
}

export default Login;
