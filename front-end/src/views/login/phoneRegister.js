import React, { Component } from 'react';
import { Button, InputItem, Toast } from 'antd-mobile';
import {  phoneLogin } from './style';
import { getVerificationCode } from '@/api/userApi';
import Header from '@/components/header';

const header = {
  left: '取消',
  title: '手机登录注册',
  right: ''
}

class phoneRegister extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          phone: '',
          isDisabled: true
        }
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    render() { 
        return (
            <div style={{ position: 'relative'}}>
              <Header header={header}></Header>
              <InputItem type="phone" value={this.state.phone} onChange={this.handleChange} placeholder="请输入手机号" clear>手机号</InputItem>
              <Button style={phoneLogin} onClick={this.handleBtnClick} disabled={this.state.isDisabled}>获取验证码</Button>
            </div>
          );
    }
    handleBtnClick() {
      var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (phone.test(this.state.phone) === false) {
        Toast.info('请输入正确的手机号码', 1);
        return false;
      } else {
        getVerificationCode({mobile: this.state.phone}).then(res => {
          this.props.history.push({
            pathname: '/smsCheck',
            phone: this.state.phone,
          })
        }).catch((err) => {
          console.log('error', err);
        })
      }
    }
    handleChange(value) {
      this.setState({
        phone: value.replace(/\s*/g,"")
      })
      if (value) {
        this.setState({
          isDisabled: false
        })
      } else {
        this.setState({
          isDisabled: true
        })
      }
    }
}
 
export default phoneRegister;