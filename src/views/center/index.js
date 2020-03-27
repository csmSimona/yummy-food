import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { Tabs } from 'antd-mobile';
import { CenterWrapper, SettingIcon, Border } from './style';
import { renderRoutes } from 'react-router-config';

const tabs = [
    {
      title: '菜谱',
      path: '/tab/center/myRecipes',
      id: 0
    },
    { 
      title: '动态',
      path: '/tab/center/myDynamic',
      id: 1
    },
    { 
      title: '收藏',
      path: '/tab/center/myCollect',
      id: 2
    },
    { 
      title: '点赞',
      path: '/tab/center/myLike',
      id: 3
    }
  ];

class Center extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            route: props.route,
            centerTab: 0
        };
        this.editUserInfo = this.editUserInfo.bind(this)
    }
    render() { 
        let {userList, recipesList, dynamicList} = this.props;
        return ( 
            <CenterWrapper>
                <div className='topHeader'>
                    <div className='editWrapper'>
                        <img className='avatar' src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} alt="" />
                        <div className='editContent'>
                            <p className="userName">{userList.name}</p>
                            <div style={{display: 'flex', alignItems: 'center', margin: '.5rem'}}>
                                <div className='editButton' onClick={this.editUserInfo}>编辑资料</div>
                                <Link to='/setting'>
                                    <SettingIcon className='iconfont'>&#xe63c;</SettingIcon>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* <div className='userDesc'>
                        <p className='descContent'>{formatDate(userList.createDate)} 加入</p>
                        <p className='descContent'>{userList.profile ? userList.profile : '添加个人简介，让厨友更了解你'}</p>
                    </div> */}
                    <div className='userData'>
                        <div className='dataItem'>
                            <p className='dataNumber'>{userList.concernList ? userList.concernList.length : '0'}</p>
                            <p>关注</p>
                        </div>
                        <div className='dataItem'>
                            <p className='dataNumber'>{userList.fanList ? userList.fanList.length : '0'}</p>
                            <p>粉丝</p>
                        </div>
                        <div className='dataItem'>
                            <p className='dataNumber'>{this.computedCollectNum(recipesList)}</p>
                            <p>被收藏</p>
                        </div>
                        <div className='dataItem'>
                            <p className='dataNumber'>{this.computedFollowNum(recipesList)}</p>
                            <p>被跟做</p>
                        </div>
                        {/* <div className='dataItem'>
                            <p className='dataNumber'>{this.computedLikeNum(dynamicList)}</p>
                            <p>被点赞</p>
                        </div> */}
                    </div>
                </div>
                <Border />
                <Tabs tabs={tabs}
                    page={this.state.centerTab}
                    onTabClick={tab => { 
                        this.setState({
                          centerTab: tab.id
                        })
                        this.props.history.replace(tab.path)
                      }}
                >
                </Tabs>
                <div>
                    {renderRoutes(this.state.route.children)}
                </div>
            </CenterWrapper>
        );
    }
    editUserInfo() {
        this.props.history.push({
            pathname: '/personInfo',
            phone: this.props.userList.phone
        })
    }
    computedFollowNum(recipesList){ 
        let followNum = 0;
        if (recipesList) {
            if (recipesList.length !== 0) {
                recipesList.forEach(item => {
                    if (!item.followNumber) {
                        item.followNumber = 0
                    }
                    followNum += item.followNumber
                })
            }
        }
        return followNum;
    }

    computedCollectNum(recipesList){ 
        let collectNum = 0;
        if (recipesList) {
            if (recipesList.length !== 0) {
                recipesList.forEach(item => {
                    if (!item.collectionNumber) {
                        item.collectionNumber = 0
                    }
                    collectNum += item.collectionNumber
                })
            }
        }
        return collectNum;
    }
    computedLikeNum(dynamicList){ 
        let likeNum = 0;
        if (dynamicList) {
            if (dynamicList.length !== 0) {
                dynamicList.forEach(item => {
                    if (!item.likeNumber) {
                        item.likeNumber = 0
                    }
                    likeNum += item.likeNumber
                })
            }
        }
        return likeNum;
    }
    componentDidMount() {
        let userList = this.props.userList;
        let pathname = this.props.location.pathname;
        if (pathname === '/tab/center/myRecipes') {
            this.setState({
                centerTab: 0
            })
            this.props.location.userId = userList._id
        }
        if (pathname === '/tab/center/myDynamic') {
            this.setState({
                centerTab: 1
            })
        }
        if (pathname === '/tab/center/myCollect') {
            this.setState({
                centerTab: 2
            })
        }
        if (pathname === '/tab/center/myLike') {
            this.setState({
                centerTab: 2
            })
        }
        if (!userList.concernList) {
            userList.concernList = []
        }
        if (!userList.fanList) {
            userList.fanList = []
        }
        this.props.saveUserList(userList);
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        dynamicList: state.getIn(['center', 'dynamicList']),
        recipesList: state.getIn(['center', 'recipesList']),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(information) {
            dispatch(actionCreators.saveUserList(information));
        },
        saveRecipesList(information) {
            dispatch(actionCreators.saveRecipesList(information));
        },
        saveDynamicList(information) {
            dispatch(actionCreators.saveDynamicList(information));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Center);