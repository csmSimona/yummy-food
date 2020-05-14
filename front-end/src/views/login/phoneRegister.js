import React, { Component } from 'react';
import { Button, InputItem, Toast } from 'antd-mobile';
import { PhoneRegisterWrapper } from './style';
import { getVerificationCode, loginByPassword } from '@/api/userApi';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '../center/store';
import { actionCreators as tabActionCreators} from '@/views/tabBar/store';
import md5 from 'md5';

const header1 = {
  left: '取消',
  title: '手机登录注册',
  right: '密码登录'
}

const header2 = {
  left: '取消',
  title: '手机登录注册',
  right: '验证码登录'
}

class phoneRegister extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          phone: '',
          isDisabled: true,
          password: '',
          changeType: true
        }
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.rightClick = this.rightClick.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    render() { 
        return (
            <PhoneRegisterWrapper>
              <Header header={this.state.changeType ? header1 : header2} rightClick={this.rightClick}></Header>
              <InputItem 
                type="phone" 
                value={this.state.phone} 
                onChange={this.handleChange} 
                placeholder="请输入手机号" 
                clear
                ref={ref => this.phoneInput = ref}
              >手机号</InputItem>
              {
                this.state.changeType ? '' :
                <InputItem 
                  type="password" 
                  value={this.state.password} 
                  onChange={this.handleChangePassword} 
                  placeholder="请输入密码" 
                  clear
                  maxLength='16'
                  style={{display: this.state.changeType ? 'none' : 'block'}}
                >密码</InputItem>
              }
              <Button className='phoneLogin' onClick={this.handleBtnClick} disabled={this.state.isDisabled} style={{display: !this.state.changeType ? 'none' : 'block'}}>获取验证码</Button>
              <Button className='phoneLogin' onClick={this.handleLogin} style={{display: this.state.changeType ? 'none' : 'block'}}>登录</Button>
            </PhoneRegisterWrapper>
          );
    }
    componentDidMount() {
        this.phoneInput.focus();
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
    handleChangePassword(value) {
      this.setState({
          password: value
      })
    }
    rightClick() {
      this.setState({
        changeType: !this.state.changeType
      })
    }
    handleLogin() {
      loginByPassword({
        phone: this.state.phone,
        password: md5(this.state.password)
      }).then(res => {
        if (res.data.code === 200) {
          if (res.data.msg === 'can not find') {
            Toast.fail('密码错误', 1);
          } else {
            localStorage.setItem('token', res.data.userList.token);
            localStorage.setItem('userId', res.data.userList._id);
            this.props.saveUserList(res.data.userList);
            this.props.history.push({
              pathname: '/tab/home/recommend'
            })
            this.props.saveSelectedTab('home');
          }
        }
      })
      .catch((err) => {
        console.log('error', err);
      })
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

export default connect(mapStateToProps, mapDispatchToProps)(phoneRegister);