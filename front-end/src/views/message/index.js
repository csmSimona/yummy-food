import React, { Component } from 'react';
import Header from '@/components/header';
import { MessageWrapper, IconFont, GoIcon } from './style';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreators as tabActionCreators } from '../tabBar/store';
import { actionCreators as centerActionCreators } from '../center/store';
import { Badge } from 'antd-mobile';

const header = {
    left: "",
    title: '我的消息',
    right: ''
};

class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return ( 
            <MessageWrapper height={height}>
                <Header header={header}></Header>
                <Link to='/newFanList'>
                    <div className='text'>
                        <IconFont className='iconfont'>&#xe63d;</IconFont>
                        <p className='title'>新增粉丝</p>
                        <div className='right'>
                            <GoIcon className='iconfont back'>&#xe61f;</GoIcon>
                            <Badge text={this.props.unReadFanNumber}/>
                        </div>
                    </div>
                </Link>
                <Link to='/newLikeList'>
                    <div className='text'>
                        <IconFont className='iconfont' style={{background: '#FDA402'}}>&#xe63a;</IconFont>
                        <p className='title'>收到的赞</p>
                        <div className='right'>
                            <GoIcon className='iconfont back'>&#xe61f;</GoIcon>
                            <Badge text={this.props.unReadLikeNumber}/>
                        </div>
                    </div>
                </Link>
                <Link to='/newCollectList'>
                    <div className='text'>
                        <IconFont className='iconfont' style={{background: '#5BB5DA'}}>&#xe60f;</IconFont>
                        <p className='title'>收藏</p>
                        <div className='right'>
                            <GoIcon className='iconfont back'>&#xe61f;</GoIcon>
                            <Badge text={this.props.unReadCollectNumber}/>
                        </div>
                    </div>
                </Link>
                <Link to='/newCommentList'>
                    <div className='text'>
                        <IconFont className='iconfont' style={{background: '#34B87F'}}>&#xe648;</IconFont>
                        <p className='title'>评论</p>
                        <div className='right'>
                            <GoIcon className='iconfont back'>&#xe61f;</GoIcon>
                            <Badge text={this.props.unReadCommentNumber}/>
                        </div>
                    </div>
                </Link>
                <Link to='/inform'>
                    <div className='text'>
                        <IconFont className='iconfont' style={{background: '#5C99EC'}}>&#xe64a;</IconFont>
                        <p className='title'>官方通知</p>
                        <div className='right'>
                            <GoIcon className='iconfont back'>&#xe61f;</GoIcon>
                            {/* <Badge text={this.props.unReadNumber}/> */}
                        </div>
                    </div>
                </Link>
            </MessageWrapper>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        unReadNumber: state.getIn(['tab', 'unReadNumber']),
        unReadCollectNumber: state.getIn(['tab', 'unReadCollectNumber']),
        unReadCommentNumber: state.getIn(['tab', 'unReadCommentNumber']),
        unReadLikeNumber: state.getIn(['tab', 'unReadLikeNumber']),
        unReadFanNumber: state.getIn(['tab', 'unReadFanNumber']),
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
        saveUnReadCollectNumber(unReadCollectNumber) {
          dispatch(tabActionCreators.saveUnReadCollectNumber(unReadCollectNumber));
        },
        saveUnReadCommentNumber(unReadCommentNumber) {
          dispatch(tabActionCreators.saveUnReadCommentNumber(unReadCommentNumber));
        },
        saveUnReadLikeNumber(unReadLikeNumber) {
          dispatch(tabActionCreators.saveUnReadLikeNumber(unReadLikeNumber));
        },
        saveUnReadFanNumber(unReadFanNumber) {
          dispatch(tabActionCreators.saveUnReadFanNumber(unReadFanNumber));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);