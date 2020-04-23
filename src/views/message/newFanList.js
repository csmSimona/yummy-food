import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators as tabActionCreators } from '../tabBar/store';
import { actionCreators as centerActionCreators } from '../center/store';
import { getUnreadFan } from '@/api/informApi';
import { getUserInfo, addConcernUser } from '@/api/userApi';
import formatTime from '@/utils/formatTime';
import { NewFanListWrapper } from './style';
import { Toast, Button } from 'antd-mobile';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '新增粉丝',
    right: ''
};

class NewFanList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            fanList: []
        }
    }

    render() { 
        let { fanList } = this.state;
        return ( 
            <NewFanListWrapper>
                <Header header={header}></Header>
                {
                    fanList && fanList.map((item, index) => {
                        return (
                            <div className='fanList' key={index}>
                                <img src={item.user.img[0].url.substring(0, 4) === 'http' ? item.user.img[0].url : require('@/' + item.user.img[0].url)} className='avatar' alt="" onClick={() => this.gotoUserDetail(item.user)}/>
                                <div className='desc'>
                                    <span className='name'>{item.user.name}</span> 关注了你
                                    <p className='time'>{formatTime(item.createDate)}</p>
                                </div>
                                <Button type='primary' size='small' onClick={this.changeConcern(item.concern, index)}>{item.concern}</Button>
                            </div>
                        )
                    })
                }
            </NewFanListWrapper>
         );
    }
    
    changeConcern = (concern, index) => () => {
        let user = this.props.userList;
        let type;
        let newFanList = this.state.fanList;
        let concernInfo = newFanList[index].user;

        if (concern === '互相关注') {
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
            writerId: concernInfo._id, 
            userId: user._id,
            concernList: user.concernList,
            fanList: concernInfo.fanList,
            type
        }).then(res => {
            if (res.data.code === 200) {
                this.props.saveUserList(user);
                if (concern === '互相关注') {
                    newFanList[index].concern = '关注';
                } else {
                    newFanList[index].concern = '互相关注';
                }
                this.setState({
                    fanList: newFanList
                })
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/center/myRecipes',
          userDetail: userData
        })
    }

    getUnreadFan() {
        getUnreadFan({writerId: this.props.userList._id}).then(res => {
            if (res.data.code === 200) {
                let fanList = res.data.data;
                let actionArr = [];
                fanList.forEach(item => {
                    actionArr.push(getUserInfo({userId: item.userId}));
                })
                Promise.all(actionArr).then(res => {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        fanList[i].user = userData;

                        let userList = this.props.userList;
                        let index = userData.concernList.indexOf(userList._id);
                        if (index !== -1) {
                            fanList[i].concern = '关注'
                        } else {
                            fanList[i].concern = '互相关注'
                        }
                    }
                }).then(() => {
                    console.log('fanList', fanList);
                    this.setState({
                        fanList: fanList.reverse()
                    })
                })
            }
        }).catch(function (err) {
            console.log('err', err);
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        this.getUnreadFan();
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        unReadNumber: state.getIn(['tab', 'unReadNumber']),
        unReadFanNumber: state.getIn(['tab', 'unReadFanNumber'])
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(centerActionCreators.saveUserList(userList));
        },
        saveSelectedTab(selectedTab) {
          dispatch(tabActionCreators.saveSelectedTab(selectedTab));
        },
        saveUnReadNumber(unReadNumber) {
          dispatch(tabActionCreators.saveUnReadNumber(unReadNumber));
        },
        saveUnReadFanNumber(unReadFanNumber) {
          dispatch(tabActionCreators.saveUnReadFanNumber(unReadFanNumber));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewFanList);