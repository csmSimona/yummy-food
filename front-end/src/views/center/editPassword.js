import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { Button, InputItem, Toast } from 'antd-mobile';
import {  phoneLogin } from './style';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '设置密码',
    right: ''
}

class EditPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userList: {}
        };
    }
    render() { 
        return (
            <div>
                <Header header={header}></Header>
                <InputItem type="password" value={this.state.phone} onChange={this.handleChange} placeholder="请输入密码(6~16位数字、字母或符号)" clear>密码</InputItem>
                <InputItem type="password" value={this.state.phone} onChange={this.handleChange} placeholder="请再次输入密码" clear>重复密码</InputItem>
                <Button style={phoneLogin} onClick={this.handleBtnClick} disabled={this.state.isDisabled}>完成</Button>
            </div>
        )
    }

    componentDidMount() {
        let userList = this.props.userList;
        this.setState({ userList })
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