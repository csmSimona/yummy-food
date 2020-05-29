import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { Toast, Button } from 'antd-mobile';
import { getConcernList, getFanList, addConcernUser } from '@/api/userApi';
import { UserListWrapper } from './style';

const header1 = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '关注',
    right: ''
};

const header2 = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '粉丝',
    right: ''
};

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userList: []
         }
        this.back = this.back.bind(this);
    }
    render() { 
        return ( 
            <div>
                <Header header={this.props.location.type === 'concernList' ? header1 : header2}  leftClick={this.back}></Header>
                <div>
                    {
                        this.state.userList.map((item, index) => {
                            return (
                                <UserListWrapper key={index}>
                                    <img src={item.img[0].url.substring(0, 4) === 'http' ? item.img[0].url : require('@/' + item.img[0].url)} className='avatar' alt="" onClick={() => this.gotoUserDetail(item)}/>
                                    <div className='desc'>{item.name}</div>
                                    <div className='button'>
                                        <Button type='primary' size='small' onClick={this.changeConcern(item.concern, index)}>{item.concern}</Button>
                                    </div>
                                </UserListWrapper>
                            )
                        })
                    }
                </div>
            </div>
         );
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/center/myRecipes',
          userDetail: userData
        })
    }

    back() {
        if (this.props.location.userDetail) {
            this.props.history.replace({
                pathname: '/center/myRecipes',
                userDetail: this.props.location.userDetail
            })
        } else {
            this.props.history.replace('/tab/center/myRecipes')
        }
    }

    changeConcern = (concern, index) => () => {
        let concernType = this.props.location.type;
        let user = this.props.userList;
        let newUserList = this.state.userList;
        let concernInfo = newUserList[index];
        let type;

        if (concern === '互相关注' || concern === '已关注') {
            type = 'delete';
            concernInfo.fanList.forEach((item, i) => {
                if (item === user._id) {
                    concernInfo.fanList.splice(i, 1);
                    i--;
                    return;
                }
            })
            user.concernList.forEach((item, i) => {
                if (item === concernInfo._id) {
                    user.concernList.splice(i, 1);
                    i--;
                    return;
                }
            })
        } else {
            type = 'add';
            concernInfo.fanList.push(user._id);
            user.concernList.push(concernInfo._id);
        }
        
        addConcernUser({
            writerId: concern._id, 
            userId: user._id,
            concernList: user.concernList,
            fanList: concernInfo.fanList,
            type
        }).then(res => {
            if (res.data.code === 200) {
                this.props.saveUserList(user);
                if (concern === '互相关注' || concern === '已关注') {
                    concernInfo.concern = '关注';
                } else if (concern === '关注' && concernType === 'concernList') {
                    concernInfo.concern = '已关注';
                } else if (concern === '关注' && concernType === 'fanList') {
                    concernInfo.concern = this.props.location.userDetail ? '已关注' : '互相关注';
                }
                newUserList[index] = concernInfo;
                this.setState({
                    userList: newUserList
                })
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getConcernList() {
        let concernIdList = this.props.location.list;
        getConcernList({concernIdList}).then(res => {
            if (res.data.code === 200) {
                console.log('concernList', res.data.data)
                let userList = res.data.data;
                let user = this.props.userList;
                if (this.props.location.userDetail) {
                    userList.forEach(item => {
                        let index = item.concernList.indexOf(user._id);
                        if (index !== -1) {
                            item.concern = '已关注'
                        } else {
                            item.concern = '关注'
                        }
                    })
                } else {
                    userList.forEach(item => {
                        let index = item.concernList.indexOf(user._id);
                        if (index !== -1) {
                            item.concern = '互相关注'
                        } else {
                            item.concern = '已关注'
                        }
                    })
                }
                this.setState({
                    userList: userList
                })
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    getFanList() {
        let fanIdList = this.props.location.list;
        getFanList({fanIdList}).then(res => {
            if (res.data.code === 200) {
                console.log('getFanList', res.data.data)
                let userList = res.data.data;
                let user = this.props.userList;
                if (this.props.location.userDetail) {
                    userList.forEach(item => {
                        let index = item.fanList.indexOf(user._id);
                        if (index !== -1) {
                            item.concern = '已关注'
                        } else {
                            item.concern = '关注'
                        }
                    })
                } else {
                    userList.forEach(item => {
                        let index = item.fanList.indexOf(user._id);
                        if (index !== -1) {
                            item.concern = '互相关注'
                        } else {
                            item.concern = '关注'
                        }
                    })
                }
                this.setState({
                    userList: res.data.data
                })
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        console.log('this.props.location', this.props.location)
        let type = this.props.location.type;
        if (type === 'concernList') {
            this.getConcernList();
        } else {
            this.getFanList();
        }
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        // selectedTab: state.getIn(['tab', 'selectedTab'])
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(actionCreators.saveUserList(userList));
        },
        // saveSelectedTab(selectedTab) {
        //     dispatch(tabActionCreators.saveSelectedTab(selectedTab));
        // }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
