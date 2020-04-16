import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import {  Cancel, wechatLogin, phoneLogin, logo, Slogan } from './style';
import axios from 'axios';

const AppID = 'wxf5fff2aa6e0b1af7';
const AppSecret = 'f396ab92d74c2ba72021d102aa67750b';

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

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
        {/* <a href="weixin://">打开微信</a> */}
        {/* <a href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=https%3A%2F%2F08b2ee24.ngrok.io%2F&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'>直接跳转到微信提供的网页</a> */}
        <Button style={wechatLogin} onClick={this.handleWechatBtnClick}>使用微信登录</Button>
        <Button style={phoneLogin} onClick={this.handlePhoneBtnClick}>手机登录注册</Button>
      </div>
    );
  }

  handleWechatBtnClick() {
    let return_uri = encodeURIComponent('http://127.0.0.1:3000/personInfo');  
    let url = ('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');

    // let url = 'weixin://dl/business/?ticket=ta428dhj739hg3efe6e';
    document.location = url;

  }

  handlePhoneBtnClick() {
    this.props.history.push('/phoneRegister');
  }
  // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2FpersonInfo&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect

  // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5fff2aa6e0b1af7&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2FpersonInfo&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1&uin=MTY2NjcxNzI0&key=601e91c206e212893e333f08e66ecbba9ac656ff465c386b14ec4f82c8cb54e3c0a29bd8fc2e8a77c198f4c974e8bcb0&pass_ticket=G/oAtnGuAdcptJN/+VHIqLkLRcHGsCTxaRod7cxVpCn9oAvgEh0Cvf4memnzWxgQp0YAzsa9crgmlh5sVKv0Pw==
  
  cancelLogin() {
    this.props.history.push({
      pathname: '/tab/home/recommend'
    })
  }
  //判断是否微信浏览器
  isWeixinBrowser() {  
    var ua = navigator.userAgent.toLowerCase();  
    var result = (/micromessenger/.test(ua)) ? true : false;
    if (result) {
        console.log('你正在访问微信浏览器');
    }
    else {
        console.log('你访问的不是微信浏览器');
    }
    return result;
  };
  componentDidMount() {
    this.isWeixinBrowser();
  }
}

export default Login;
