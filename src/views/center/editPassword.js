import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { Button, InputItem, Toast } from 'antd-mobile';
import { phoneLogin } from './style';
import { editPassword } from '@/api/userApi';
import md5 from 'md5';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '设置密码',
    right: ''
}

class EditPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userList: {},
            password: '',
            repeatPassword: ''
        };
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeRePassword = this.handleChangeRePassword.bind(this);
        this.verifyPassword = this.verifyPassword.bind(this);
        this.verifyRePassword = this.verifyRePassword.bind(this);
        this.handleBtnClick = this.handleBtnClick.bind(this);
    }
    render() { 
        return (
            <div>
                <Header header={header}></Header>
                <InputItem 
                    type="password" 
                    value={this.state.password} 
                    onChange={this.handleChangePassword} 
                    placeholder="请输入密码(6~16位数字或字母)" 
                    clear
                    maxLength='16'
                    onBlur={this.verifyPassword}
                >密码</InputItem>
                <InputItem 
                    type="password" 
                    value={this.state.repeatPassword} 
                    onChange={this.handleChangeRePassword} 
                    placeholder="请再次输入密码" 
                    clear
                    maxLength='16'
                    onBlur={this.verifyRePassword}
                >重复密码</InputItem>
                <Button style={phoneLogin} onClick={this.handleBtnClick} disabled={this.state.isDisabled}>完成</Button>
            </div>
        )
    }

    componentDidMount() {
        let userList = this.props.userList;
        this.setState({ userList })
    }

    handleChangePassword(value) {
        this.setState({
            password: value
        })
    }
    
    handleChangeRePassword(value) {
        this.setState({
            repeatPassword: value
        })
    }
    
    verifyPassword() {
        var testPattern = /^[a-zA-Z0-9]{6,16}$/;
        if (testPattern.test(this.state.password) === false) {
            Toast.fail('请输入符合条件的密码(6~16位数字或字母)', 1);
        }
    }

    verifyRePassword() {
        if (this.state.password !== this.state.repeatPassword) {
            Toast.fail('请输入相一致的密码', 1);
        }
    }

    handleBtnClick() {
        editPassword({
            mobile: this.state.userList.phone, 
            password: md5(this.state.password)
        }).then(res => {
            if (res.data.code === 200)
            Toast.success('编辑成功', 1);
            let userList = this.state.userList;
            userList.password = md5(this.state.password)
            this.props.saveUserList(userList)
            this.props.history.push({
                pathname: '/setting'
            })
        }).catch((err) => {
            Toast.success('编辑失败', 1);
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
        saveUserList(information) {
            dispatch(actionCreators.saveUserList(information));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPassword);