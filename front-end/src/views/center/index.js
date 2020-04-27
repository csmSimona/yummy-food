import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { Tabs, Modal, Picker, List } from 'antd-mobile';
import { CenterWrapper, SettingIcon, Border } from './style';
import { renderRoutes } from 'react-router-config';
import formatDate from '@/utils/formatDate';
import getAge from '@/utils/getAge';
import antdDistrict from '@/utils/antdDistrict';
import Header from '@/components/header';

const tabs1 = [
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

const tabs2 = [
    {
      title: '菜谱',
      path: '/center/myRecipes',
      id: 0
    },
    { 
      title: '动态',
      path: '/center/myDynamic',
      id: 1
    },
    { 
      title: '收藏',
      path: '/center/myCollect',
      id: 2
    },
    { 
      title: '点赞',
      path: '/center/myLike',
      id: 3
    }
];

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '个人中心',
    right: ''
};
function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
}

class Center extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showBigModal: false,
            showBigUrl: '',
            route: props.route,
            centerTab: 0,
            userList: {},
            tabs: []
        };
        this.editUserInfo = this.editUserInfo.bind(this);
        this.gotoUserList = this.gotoUserList.bind(this);
    }
    render() { 
        // let {userList, recipesList} = this.props;
        let { recipesList } = this.props;
        let { userList } = this.state;
        return ( 
            <CenterWrapper style={{zIndex: this.props.location.userDetail ? '1000' : ''}}>
                {
                    this.props.location.userDetail ? 
                    <Header header={header}></Header> : ''
                }
                {/* <div className='showBigImg' style={{display: this.state.showBigModal ? 'block' : 'none'}}>
                    <img src={userList.img ? userList.img[0].url.substring(0, 4) === 'http' ? userList.img[0].url : require('@/' + userList.img[0].url) : require('@/statics/img/blank.jpeg')} alt="查看图片" width="100%" height="100%" />
                </div> */}
                <div className='topHeader'>
                    <div className='editWrapper'>
                        <img 
                            className='avatar' 
                            src={userList.img ? userList.img[0].url.substring(0, 4) === 'http' ? userList.img[0].url : require('@/' + userList.img[0].url) : require('@/statics/img/blank.jpeg')} 
                            alt="" 
                            onClick={() => {
                                this.setState({
                                    showBigModal: true
                                })
                            }}
                        />
                        <Modal
                            visible={this.state.showBigModal}
                            transparent
                            maskClosable={true}
                            onClose={this.onClose('showBigModal')}
                            title="查看头像"
                            footer={[{ text: '关闭', onPress: () => { this.onClose('showBigModal')(); } }]}
                            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                        >
                            <img src={userList.img ? userList.img[0].url.substring(0, 4) === 'http' ? userList.img[0].url : require('@/' + userList.img[0].url) : require('@/statics/img/blank.jpeg')} alt="查看图片" width="100%" height="100%" />
                        </Modal>
                        
                        {
                            this.props.location.userDetail ? 
                            <div className='userName'>
                                {userList.name}
                            </div> : 
                            <div className='editContent'>
                                <p className="userName">{userList.name}</p>
                                <div style={{display: 'flex', alignItems: 'center', margin: '.5rem'}}>
                                    <div className='editButton' onClick={this.editUserInfo}>编辑资料</div>
                                    <Link to='/setting'>
                                        <SettingIcon className='iconfont'>&#xe63c;</SettingIcon>
                                    </Link>
                                </div>
                            </div>
                        }
                    </div>
                    {
                        this.props.location.userDetail ? 
                        <div className='userDesc'>
                            <span className='descContent'>{userList.gender}</span>
                            <span className='descContent'>{userList.birthday ? ` · ${getAge(formatDate(userList.birthday))}岁` : ''}</span>
                            <span className='descContent'> · {formatDate(userList.createDate)} 加入</span>
                            <div className='place'>
                                <p>家乡：</p>
                                {userList.hometown ? 
                                    <Picker
                                        disabled
                                        data={antdDistrict}
                                        value={userList.hometown}
                                        extra='未知'
                                        >
                                        <List.Item></List.Item>
                                    </Picker> : '未知'
                                }
                            </div>
                            <div className='place'>
                                <p>现居地：</p>
                                {userList.livingPlace ? 
                                    <Picker
                                        disabled
                                        data={antdDistrict}
                                        value={userList.livingPlace}
                                        extra='未知'
                                        >
                                        <List.Item></List.Item>
                                    </Picker> : '未知'
                                }
                            </div>
                            <p className='descContent'>{userList.profile ? userList.profile : '暂无个人简介'}</p>
                        </div> : ''
                    }
                    <div className='userData'>
                        <div className='dataItem'>
                            <p className='dataNumber' onClick={this.gotoUserList('concernList')}>{userList.concernList ? userList.concernList.length : '0'}</p>
                            <p>关注</p>
                        </div>
                        <div className='dataItem'>
                            <p className='dataNumber' onClick={this.gotoUserList('fanList')}>{userList.fanList ? userList.fanList.length : '0'}</p>
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
                    </div>
                </div>
                <Border />
                <Tabs tabs={this.state.tabs}
                    page={this.state.centerTab}
                    onTabClick={tab => { 
                        this.setState({
                          centerTab: tab.id
                        })
                        this.props.history.replace({
                            pathname: tab.path,
                            userDetail: this.props.location.userDetail ? this.props.location.userDetail : ''
                        })
                      }}
                >
                </Tabs>
                <div style={{margin: '0 1rem'}}>
                    {renderRoutes(this.state.route.children)}
                </div>
            </CenterWrapper>
        );
    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
    }

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }
    
    gotoUserList = list => () => {
        let userList = this.state.userList;
        // let userList = this.props.userList;
        let num;
        if (list === 'concernList') {
            num = userList.concernList ? userList.concernList.length : '0';
            if (num !== 0) {
                this.props.history.replace({
                    pathname: '/userList',
                    list: userList.concernList,
                    userId: userList._id,
                    type: 'concernList',
                    userDetail: this.props.location.userDetail
                });
            }
        }
        if (list === 'fanList') {
            num = userList.fanList ? userList.fanList.length : '0';
            if (num !== 0) {
                this.props.history.replace({
                    pathname: '/userList',
                    list: userList.fanList,
                    userId: userList._id,
                    type: 'fanList',
                    userDetail: this.props.location.userDetail
                });
            }
        }
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
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        if (this.props.location.userDetail) {
            // console.log('center userDetail', this.props.location.userDetail);
            let userDetail = this.props.location.userDetail;
            let pathname = this.props.location.pathname;
            if (pathname === '/center/myRecipes') {
                this.setState({
                    centerTab: 0
                })
            }
            if (pathname === '/center/myDynamic') {
                this.setState({
                    centerTab: 1
                })
            }
            if (pathname === '/center/myCollect') {
                this.setState({
                    centerTab: 2
                })
            }
            if (pathname === '/center/myLike') {
                this.setState({
                    centerTab: 3
                })
            }
            if (!userDetail.concernList) {
                userDetail.concernList = []
            }
            if (!userDetail.fanList) {
                userDetail.fanList = []
            }
            this.setState({
                userList: userDetail,
                tabs: tabs2
            })
        } else {
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
                    centerTab: 3
                })
            }
            if (!userList.concernList) {
                userList.concernList = []
            }
            if (!userList.fanList) {
                userList.fanList = []
            }
            this.setState({
                userList: userList,
                tabs: tabs1
            })
            this.props.saveUserList(userList);
        }
    }
    componentWillUnmount(){
        // 卸载异步操作设置状态
        this.setState = (state, callback) => {
            return;
        }
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