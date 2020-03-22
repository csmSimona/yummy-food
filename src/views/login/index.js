import React, { Component } from 'react';
import { weChatLogin, get_wx_access_token } from '@/api/userApi';
import { Button } from 'antd-mobile';
import {  Cancel, wechatLogin, phoneLogin, logo, Slogan } from './style';

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
        <Cancel onClick={this.cancelLogin}>取消</Cancel>
        <img src={require('@/statics/img/title.png')} style={logo} alt="头像" ></img>
        <Slogan>唯有美食与爱不可辜负</Slogan>
        <Button style={wechatLogin} onClick={this.handleWechatBtnClick}>使用微信登录</Button>
        <Button style={phoneLogin} onClick={this.handlePhoneBtnClick}>手机登录注册</Button>
      </div>
    );
  }

  handleWechatBtnClick() {
      console.log('使用微信登录')
      weChatLogin().then(res => {
        console.log('weChatLogin', res)
      }).catch((err) => {
        console.log('error', err);
      })
      get_wx_access_token().then(res => {
        console.log('weChatLogin', res)
      }).catch((err) => {
        console.log('error', err);
      })
  }

  handlePhoneBtnClick() {
    this.props.history.push('/phoneRegister');
  }
  
  cancelLogin() {
    this.props.history.push({
      pathname: '/tab/home/recommend',
      selectedTab: 'home'
    })
  }
}

export default Login;
