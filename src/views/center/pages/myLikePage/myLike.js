import React, { Component } from 'react';
import { BlankWrapper } from '../../style';
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { actionCreators as tabActionCreators} from '@/views/tabBar/store';
import { Toast, ActivityIndicator } from 'antd-mobile';
import { getLikeDynamicList, addLikeDynamic } from '@/api/dynamicApi';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from '@/views/home/pages/recommendPage/style';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { getUserInfo } from '@/api/userApi';
import LazyLoad from 'react-lazyload';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

class MyLike extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            likeDynamicList: [],
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true
         }
        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.getDynamicDetail = this.getDynamicDetail.bind(this);
    }
    render() { 
        // let { userList } = this.props;
        let { leftData, rightData } = this.state;
        const LikeDynamicList = <RecipesListWrapper>
            <div className='left'>
                {
                    leftData && leftData.map((item, index) => {
                        return (
                            <div key={index} className='contentBox'>
                                <LazyLoad offset={100}>
                                    <img src={require('@/' + item.imgs[0].url)} width="100%" height="100%"  key={index} onClick={this.getDynamicDetail(item._id)} alt=""/>
                                </LazyLoad>
                                <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                <div className='otherInfo'>
                                    <div className='user'>
                                        <LazyLoad offset={100}>
                                            <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} className='avatar' alt=""/>
                                        </LazyLoad>
                                        <span className='userName'>{item.userName}</span>
                                    </div>
                                    <div className='collection'>
                                        <CollectionIcon 
                                            className="iconfont" 
                                            onClick={this.handleLikeClick(item._id, index, 'left', item.like)}
                                            dangerouslySetInnerHTML={{__html: item.like}} 
                                            style={{
                                                color: item.like === UNLIKE ? '#888888' : '#FB6650'
                                            }} 
                                        />
                                        <span>{item.likeNumber}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='right'>
                {
                    rightData && rightData.map((item, index) => {
                        return (
                            <div key={index} className='contentBox'>
                                <LazyLoad offset={100}>
                                    <img src={require('@/' + item.imgs[0].url)} width="100%" height="100%"  key={index} onClick={this.getDynamicDetail(item._id)} alt=""/>
                                </LazyLoad>
                                <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                <div className='otherInfo'>
                                    <div className='user'>
                                        <LazyLoad offset={100}>
                                            <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} className='avatar' alt=""/>
                                        </LazyLoad>
                                        <span className='userName'>{item.userName}</span>
                                    </div>
                                    <div className='collection'>
                                        <CollectionIcon 
                                            className="iconfont" 
                                            onClick={this.handleLikeClick(item._id, index, 'right', item.like)}
                                            dangerouslySetInnerHTML={{__html: item.like}} 
                                            style={{
                                                color: item.like === UNLIKE ? '#888888' : '#FB6650'
                                            }} 
                                        />
                                        <span>{item.likeNumber}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </RecipesListWrapper>
        const Blank = this.props.location.userDetail ? 
        <BlankWrapper>
            <p>还未点赞过动态</p>
        </BlankWrapper> : 
        <BlankWrapper>
            <p>你好像还未点赞过动态</p>
            <p className='create' onClick={() => {
                this.props.history.replace('/tab/home/find');
                this.props.saveSelectedTab('home');
            }}>去逛逛动态</p>
        </BlankWrapper>
        return ( 
            <TitleWrapper style={{padding: '0'}}>
                <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'500px'}}>
                    <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                </div>
                { this.state.likeDynamicList.length === 0 ? Blank : LikeDynamicList }
            </TitleWrapper>
         );
    }

    getDynamicDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/dynamicDetail/' + recipeId
        })
    }
    
    handleLikeClick = (dynamicId, index, choose, like) => () => {
        let userInfo = this.props.userList;
        let newLikeNumber, newLikeList;
        let type;
        let writerId;
        
        if (choose === 'left') {
            writerId = this.state.leftData[index].userId;
            newLikeNumber = this.state.leftData[index].likeNumber;
            newLikeList = this.state.leftData[index].likeList;
        } else {
            writerId = this.state.rightData[index].userId;
            newLikeNumber = this.state.rightData[index].likeNumber;
            newLikeList = this.state.rightData[index].likeList;
        }
        if (like === UNLIKE) {
            type = 'add';
            newLikeNumber++;
            newLikeList.push(userInfo._id);
            if (userInfo.likeDynamic) {
                userInfo.likeDynamic.push(dynamicId);
            } else {
                userInfo.likeDynamic = [dynamicId];
            }
        } else {
            type = 'delete';
            newLikeNumber--;
            newLikeList.forEach((item, i) => {
                if (item === userInfo._id) {
                    newLikeList.splice(i, 1);
                    i--;
                }
            })
            userInfo.likeDynamic.forEach((item, i) => {
                if (item === dynamicId) {
                    userInfo.likeDynamic.splice(i, 1);
                    i--;
                }
            })
        }
        
        this.props.saveUserList(userInfo);
        
        addLikeDynamic({
            userId: userInfo._id,
            dynamicId: dynamicId,
            likeDynamic: userInfo.likeDynamic,
            likeNumber: newLikeNumber,
            likeList: newLikeList,
            type,
            writerId
        }).then(res => {
            var newData = []
            if (choose === 'left') {
                newData = this.state.leftData;
                newData[index].likeNumber = newLikeNumber;
                newData[index].likeList = newLikeList;
                newData[index].like = like === UNLIKE ? LIKE : UNLIKE;
                this.setState({
                    leftData: newData
                })
            } else {
                newData = this.state.rightData;
                newData[index].likeNumber = newLikeNumber;
                newData[index].likeList = newLikeList;
                newData[index].like = like === UNLIKE ? LIKE : UNLIKE;
                this.setState({
                    rightData: newData
                })
            }
        })
    }

    getLikeDynamicList() {
        let likeDynamic = [];
        if (this.props.location.userDetail) {
            likeDynamic = this.props.location.userDetail.likeDynamic;
        } else {
            likeDynamic = this.props.userList.likeDynamic;
        }
        getLikeDynamicList({likeDynamic}).then(res => {
            if (res.data.code === 200) {
                // console.log('likeDynamicList', res.data.data)
                var likeDynamicList = res.data.data;
                var actionArr = [];
                likeDynamicList.forEach(item => {
                    if (!item.likeNumber) {
                        item.likeNumber = 0;
                    }
                    if (!item.likeList) {
                        item.likeList = [];
                    }

                    if (this.props.userList.likeDynamic instanceof Array) {
                        if (this.props.userList.likeDynamic.length !== 0) {
                            var liked = this.props.userList.likeDynamic.some(val => {
                                if (val === item._id) {
                                    return true
                                }
                            })
                            if (liked) {
                                item.like = LIKE
                            } else {
                                item.like = UNLIKE
                            }
                        } else {
                            item.like = UNLIKE
                        }
                    } else {
                        item.like = UNLIKE
                    }

                    actionArr.push(getUserInfo({userId: item.userId}))
                })

                Promise.all(actionArr).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        likeDynamicList[i].userName = userData.name;
                        likeDynamicList[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    // console.log('likeDynamicList', likeDynamicList)
                    this.setState({
                        likeDynamicList: likeDynamicList
                    })
                    // 瀑布流分左右布局
                    getHW(likeDynamicList, 'dynamicList', this) //调用
                    finishLoading(this)

                }).catch(function (err) {
                    Toast.fail('布局未知错误', 1);
                })
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        if (this.props.location.userDetail) {
            console.log('myLike userDetail', this.props.location.userDetail);
            this.getLikeDynamicList();
        } else {
            // let likeNum = 0;
            // this.props.likeDynamicList.forEach(item => {
            //     if (!item.likeNumber) {
            //         item.likeNumber = 0
            //     }
            //     likeNum += item.likeNumber
            // })
            // if ((this.props.likeLeftDynamic instanceof Array) && (this.props.likeRightDynamic instanceof Array) && (likeNum === this.props.userList.likeDynamic.length)) {
            if ((this.props.likeLeftDynamic instanceof Array) && (this.props.likeRightDynamic instanceof Array)) {
                this.setState({
                    likeDynamicList: this.props.likeDynamicList,
                    leftData: this.props.likeLeftDynamic,
                    rightData: this.props.likeRightDynamic
                })
                finishLoading(this);
            } else {
                this.getLikeDynamicList(localStorage.getItem('userId'));
            }
        }
    }
    
    componentWillUnmount() {
        if (!this.props.location.userDetail) {
            let likeDynamicList = this.state.likeDynamicList;
            let likeLeftDynamic = this.state.leftData;
            let likeRightDynamic = this.state.rightData;

            this.props.saveLikeDynamicList(likeDynamicList);
            this.props.saveLikeLeftDynamic(likeLeftDynamic);
            this.props.saveLikeRightDynamic(likeRightDynamic);
        }
    }
}
 

const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        selectedTab: state.getIn(['tab', 'selectedTab']),
        likeDynamicList: state.getIn(['center', 'likeDynamicList']),
        likeLeftDynamic: state.getIn(['center', 'likeLeftDynamic']),
        likeRightDynamic: state.getIn(['center', 'likeRightDynamic'])
    }
  }
  
const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(actionCreators.saveUserList(userList));
        },
        saveSelectedTab(selectedTab) {
            dispatch(tabActionCreators.saveSelectedTab(selectedTab));
        },
        saveLikeDynamicList(LikeDynamicList) {
            dispatch(actionCreators.saveLikeDynamicList(LikeDynamicList));
        },
        saveLikeLeftDynamic(likeLeftDynamic) {
            dispatch(actionCreators.saveLikeLeftDynamic(likeLeftDynamic));
        },
        saveLikeRightDynamic(likeRightDynamic) {
            dispatch(actionCreators.saveLikeRightDynamic(likeRightDynamic));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyLike);
