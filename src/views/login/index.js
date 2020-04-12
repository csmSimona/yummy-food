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
        <Button style={wechatLogin} onClick={this.handleWechatBtnClick}>使用微信登录</Button>
        <Button style={phoneLogin} onClick={this.handlePhoneBtnClick}>手机登录注册</Button>
      </div>
    );
  }

  handleWechatBtnClick() {
    let return_uri = encodeURIComponent('http://127.0.0.1:3000/personInfo');  
    let url = ('https://open.weixin.qq.com/connect/oauth2/authorize?appid='+AppID+'&redirect_uri='+return_uri+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect');
    document.location = url;
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
