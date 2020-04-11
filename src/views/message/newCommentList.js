import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators as tabActionCreators } from '../tabBar/store';
import { actionCreators as centerActionCreators } from '../center/store';
import { getUnreadComment, getCommentDetail } from '@/api/informApi';
import { Toast } from 'antd-mobile';
import { CommentListWrapper, Border } from './style';
import formatTime from '@/utils/formatTime';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '评论',
    right: ''
};

class NewCommentList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            commentList: []
        }
    }
    render() { 
        let { commentList } = this.state;
        return ( 
            <CommentListWrapper>
                <Header header={header}></Header>
                <Border/>
                {
                    commentList && commentList.map((item, index) => {
                        return (
                            <div className='list' key={index}>
                                <img src={require('@/' + item.writer.img[0].url)} className='avatar' alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                                <div className='user'>
                                    <p className='name' onClick={() => this.gotoUserDetail(item.writer)}>{item.writer.name}</p>
                                    <p className='comment'>{item.comment.content}</p>
                                    <p className='time'>{formatTime(item.comment.createDate)}</p>
                                </div>
                                <div className='desc'>评论了你的{ item.recipes ? '菜谱' : '动态' }</div>
                                { item.recipes ? 
                                    item.recipes.videoUrl ? 
                                        <video 
                                            onClick={this.getRecipesDetail(item.recipes._id)}
                                            src={item.recipes.videoUrl} 
                                            controls="controls" 
                                            className='album'
                                        >
                                            您的浏览器不支持 video 标签。
                                        </video> : 
                                        <img 
                                            src={require('@/' + item.recipes.album[0].url)} 
                                            key={index} 
                                            onClick={this.getRecipesDetail(item.recipes._id)} 
                                            alt=""
                                            className='album'/> : 
                                    <img 
                                        src={require('@/' + item.dynamic.imgs[0].url)} 
                                        key={index} 
                                        onClick={this.getDynamicDetail(item.dynamic._id)} 
                                        alt=""
                                        className='album'
                                    />
                                }
                            </div>
                        )
                    })
                }
            </CommentListWrapper>
         );
    }

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId,
            type: 'look'
        })
    }
    
    getDynamicDetail = (dynamicId) => () => {
        this.props.history.push({
            pathname: '/dynamicDetail/' + dynamicId
        })
    }
    
    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/tab/center/myRecipes',
          userDetail: userData
        })
    }

    getUnreadComment() {
        let that = this;
        getUnreadComment({userId: this.props.userList._id}).then(res => {
            if (res.data.code === 200) {
                let commentData = res.data.data;
                let actionArr = [];
                let commentList = [];
                commentData.forEach(item => {
                    actionArr.push(getCommentDetail({commentInform: item}))
                })
                Promise.all(actionArr).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        var commentDetail = res[i].data.data;
                        commentList.push(commentDetail)
                    }
                    
                    that.setState({
                        commentList: commentList.reverse()
                    })
                    console.log('commentList', commentList)
                })
            }
        }).catch(function (err) {
            console.log('err', err)
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        this.getUnreadComment();
    }
}

const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        unReadNumber: state.getIn(['tab', 'unReadNumber']),
        unReadCommentNumber: state.getIn(['tab', 'unReadCommentNumber'])
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
        saveUnReadCommentNumber(unReadCommentNumber) {
          dispatch(tabActionCreators.saveUnReadCommentNumber(unReadCommentNumber));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCommentList);