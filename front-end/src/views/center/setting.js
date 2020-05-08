import React, { Component } from 'react';
import Header from '@/components/header';
import { Modal } from 'antd-mobile';
import { SettingWrapper } from './style';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { actionCreators as homeActionCreators} from '@/views/home/store';
import browserCookie from 'browser-cookies';
import { Link } from 'react-router-dom';

const alert = Modal.alert;
const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '设置',
    right: ''
}

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return ( 
            <SettingWrapper height={height}>
                <Header header={header}></Header>
                <div className='blank'></div>
                <div className='text'>账号管理</div>
                <Link to='/editPassword'>
                    <div className='text'>密码</div>
                </Link>
                <div className='blank'></div>
                <div className='text'>用户协议</div>
                <div className='text'>隐私政策</div>
                <div className='text'>联系我们</div>
                <div className='text'>意见反馈</div>
                <div className='text'>帮助中心</div>
                <div className='blank'></div>
                <div 
                    className='logout'
                    onClick={() =>
                        alert('退出提示', '您确定要退出该账号吗？', [
                        { text: '取消'},
                        { text: '确定', onPress: () => {
                                this.props.history.replace('/login');
                                this.props.logout();
                                this.props.clearHomeReduxData();
                                localStorage.clear();
                                browserCookie.erase('');
                            }
                        }])
                    }
                >
                    退出当前账号
                </div>
            </SettingWrapper>
         );
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout() {
            dispatch(actionCreators.logout());
        },
        clearHomeReduxData() {
            dispatch(homeActionCreators.clearHomeReduxData());
        },
        saveUserList(information) {
            dispatch(actionCreators.saveUserList(information));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);