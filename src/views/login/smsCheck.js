import React, { Component } from 'react';
import { Button, InputItem, Toast } from 'antd-mobile';
import {  phoneLogin, Tip, PhoneNumber, sendButton, inputValid, Border, SmsCheckWrapper } from './style';
import { verifyCode, getVerificationCode } from '@/api/userApi';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '../center/store';
import { actionCreators as tabActionCreators} from '@/views/tabBar/store';

const header = {
  left: '取消',
  title: '手机登录注册',
  right: ''
}

class smsCheck extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          verification: '',
          isDisabled: true,
          reSend: true,
          sendText: '60'
        }
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSendBtnClick = this.handleSendBtnClick.bind(this);
    }
    render() { 
      return (
        <SmsCheckWrapper>
          <Header header={header}></Header>
          <Tip>短信验证码已发送，请填写验证码</Tip>
          <PhoneNumber>{this.props.location.phone}</PhoneNumber>
          <div style={{display: 'flex'}}>
            <InputItem style={inputValid} type="number" value={this.state.verification} onChange={this.handleChange} placeholder="请输入验证码" maxLength="4"></InputItem>
            <Button style={sendButton} disabled={this.state.reSend} onClick={this.handleSendBtnClick}>{this.state.sendText}</Button>
            <Border></Border>
          </div>
          <Button style={phoneLogin} onClick={this.handleBtnClick} disabled={this.state.isDisabled}>完成</Button>
        </SmsCheckWrapper>
      );
    }
    handleBtnClick() {
      var verifyParam = {
        mobile: this.props.location.phone,
        code: this.state.verification
      }
      verifyCode(verifyParam).then(res => {
        if (res.data.code === 200) {
          if (res.data.msg === 'can not find') {
            this.props.history.push({
              pathname: '/personInfo',
              phone: this.props.location.phone // 传手机号码
            })
          } else {
            // console.log('登录之后的data', res.data)
            localStorage.setItem('token', res.data.userList.token);
            // localStorage.setItem('userPhone', res.data.userList.phone);
            localStorage.setItem('userId', res.data.userList._id);
            this.props.saveUserList(res.data.userList);

            this.props.history.push({
              pathname: '/tab/home/recommend',
              // phone: this.props.location.phone // 传手机号码
            })
            this.props.saveSelectedTab('home');
          }
        } else {
          Toast.fail('验证码错误！', 1);
        }
      }).catch((err) => {
        console.log('error', err);
      })
    }
    handleChange(value) {
      this.setState({
        verification: value
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
    handleSendBtnClick() {
      getVerificationCode({mobile: this.props.location.phone}).then(res => {
        this.cutDown()
      }).catch((err) => {
        console.log('error', err);
      })
    }
    cutDown() {
      var seconds = 60;
      this.setState({
        reSend: true
      })
      let promise = new Promise((resolve, reject) => {
        let setTimer = setInterval(
          () => {
            seconds -= 1;
            this.setState({
              sendText: seconds
            })
            if (seconds <= 0) {
              this.setState({
                sendText: '重发'
              })
              resolve(setTimer)
            }
          }
          , 1000)
      })
      promise.then((setTimer) => {
        clearInterval(setTimer);
        this.setState({
          reSend: false
        })
      })   
    }
    componentWillUnmount(){
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return;
        }
    }
    
    componentDidMount() {
      this.cutDown();
      if (this.props.location.phone === undefined) {
          this.props.history.replace('/phoneRegister');
      }
    }
}
 
const mapStateToProps = (state) => {
  return {
      userList: state.getIn(['center', 'userList'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserList(userList) {
          dispatch(centerActionCreators.saveUserList(userList));
      },
      saveSelectedTab(selectedTab) {
          dispatch(tabActionCreators.saveSelectedTab(selectedTab));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(smsCheck);