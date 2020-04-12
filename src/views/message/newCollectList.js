import React, { Component } from 'react';
import Header from '@/components/header';
import { connect } from 'react-redux';
import { actionCreators as tabActionCreators } from '../tabBar/store';
import { actionCreators as centerActionCreators } from '../center/store';
import { getUnreadCollect } from '@/api/informApi';
import { getUserInfo } from '@/api/userApi';
import { getRecipesById } from '@/api/recipesApi';
import { Toast } from 'antd-mobile';
import { CommentListWrapper, Border } from './style';
import formatTime from '@/utils/formatTime';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '收藏',
    right: ''
};

class NewCollectList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            collectList: []
        }
    }
    render() { 
        let { collectList } = this.state;
        return ( 
            <CommentListWrapper>
                <Header header={header}></Header>
                <Border/>
                {
                    collectList && collectList.map((item, index) => {
                        return (
                            <div className='list' key={index}>
                                <img src={item.user.img[0].url.substring(0, 4) ? item.user.img[0].url : require('@/' + item.user.img[0].url)} className='avatar' alt="" onClick={() => this.gotoUserDetail(item.user)}/>
                                <div className='user'>
                                    <p className='name' onClick={() => this.gotoUserDetail(item.user)}>{item.user.name}</p>
                                    <p className='time'>{formatTime(item.createDate)}</p>
                                </div>
                                <div className='desc'>收藏了你的菜谱</div>
                                {   item.recipes.videoUrl ? 
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
                                        className='album'/>
                                }
                            </div>
                        )
                    })
                }
            </CommentListWrapper>
         );
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/tab/center/myRecipes',
          userDetail: userData
        })
    }
    
    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId,
            type: 'look'
        })
    }

    getUnreadCollect() {
        getUnreadCollect({writerId: this.props.userList._id}).then(res => {
            if (res.data.code === 200) {
                let collectList = res.data.data;
                let actionArr = [];
                let action = [];
                collectList.forEach(item => {
                    actionArr.push(getUserInfo({userId: item.userId}));
                    action.push(getRecipesById({id: item.recipeId}));
                })
                Promise.all(actionArr).then(res => {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        collectList[i].user = userData;
                    }
                    return Promise.all(action);
                }).then((res) => {
                    for (let i = 0; i < res.length; i++) {
                        collectList[i].recipes = res[i].data.data
                    }
                    console.log('collectList', collectList);
                    this.setState({
                        collectList: collectList.reverse()
                    })
                })
            }
        }).catch(function (err) {
            console.log('err', err);
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        this.getUnreadCollect();
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        unReadNumber: state.getIn(['tab', 'unReadNumber']),
        unReadCollectNumber: state.getIn(['tab', 'unReadCollectNumber'])
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCollectList);