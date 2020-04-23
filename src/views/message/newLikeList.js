import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators as tabActionCreators } from '../tabBar/store';
import { actionCreators as centerActionCreators } from '../center/store';
import { getUnreadLike } from '@/api/informApi';
import { getUserInfo } from '@/api/userApi';
import { getDynamicById } from '@/api/dynamicApi';
import { Toast } from 'antd-mobile';
import { CommentListWrapper, Border } from './style';
import formatTime from '@/utils/formatTime';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '收到的赞',
    right: ''
};

class NewLikeList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            likeList: []
        }
    }
    render() { 
        let { likeList } = this.state;
        return ( 
            <CommentListWrapper>
                <Header header={header}></Header>
                <Border/>
                {
                    likeList && likeList.map((item, index) => {
                        return (
                            <div className='list' key={index}>
                                <img src={item.user.img[0].url.substring(0, 4) === 'http' ? item.user.img[0].url : require('@/' + item.user.img[0].url)} className='avatar' alt="" onClick={() => this.gotoUserDetail(item.user)}/>
                                <div className='user'>
                                    <p className='name' onClick={() => this.gotoUserDetail(item.user)}>{item.user.name}</p>
                                    <p className='time'>{formatTime(item.createDate)}</p>
                                </div>
                                <div className='desc'>点赞了你的动态</div>
                                <img 
                                    src={require('@/' + item.dynamic.imgs[0].url)} 
                                    key={index} 
                                    onClick={this.getDynamicDetail(item.dynamic._id)} 
                                    alt=""
                                    className='album'
                                />
                            </div>
                        )
                    })
                }
            </CommentListWrapper>
         );
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/center/myRecipes',
          userDetail: userData
        })
    }
    
    getDynamicDetail = (dynamicId) => () => {
        this.props.history.push({
            pathname: '/dynamicDetail/' + dynamicId,
            type: 'look'
        })
    }

    getUnreadLike() {
        getUnreadLike({writerId: this.props.userList._id}).then(res => {
            if (res.data.code === 200) {
                let likeList = res.data.data;
                let actionArr = [];
                let action = [];
                likeList.forEach(item => {
                    actionArr.push(getUserInfo({userId: item.userId}));
                    action.push(getDynamicById({id: item.dynamicId}));
                })
                Promise.all(actionArr).then(res => {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        likeList[i].user = userData;
                    }
                    return Promise.all(action);
                }).then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        likeList[i].dynamic = res[i].data.data
                    }
                    console.log('likeList', likeList);
                    this.setState({
                        likeList: likeList.reverse()
                    })
                })
            }
        }).catch(function (err) {
            console.log('err', err);
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        this.getUnreadLike();
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        unReadNumber: state.getIn(['tab', 'unReadNumber']),
        unReadLikeNumber: state.getIn(['tab', 'unReadLikeNumber'])
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
        saveUnReadLikeNumber(unReadLikeNumber) {
          dispatch(tabActionCreators.saveUnReadLikeNumber(unReadLikeNumber));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewLikeList);