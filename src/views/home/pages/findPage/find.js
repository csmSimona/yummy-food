import React, { Component } from 'react';
import { Toast, ActivityIndicator, Tag } from 'antd-mobile';
import { getDynamic, addLikeDynamic } from '@/api/dynamicApi';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { getUserInfo } from '@/api/userApi';
import { RecipesListWrapper, CollectionIcon } from '../recommendPage/style';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { actionCreators } from '../../store';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { TagWrapper } from './style';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

class Find extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dynamicList: [],
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true,
         }
        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.getDynamicDetail = this.getDynamicDetail.bind(this);
    }

    handleImageLoaded() {
        //加载完毕
    }

    handleImageErrored() {
        //加载失败
        this.setState({
            src: require('@/statics/img/title.png')
        });
    }

    render() { 
        let {leftData, rightData} = this.state;
        return ( 
            <div style={{margin: '1rem'}}>
                <TagWrapper>
                    <Tag selected className='tag'>早餐</Tag>
                    <Tag selected className='tag'>中餐</Tag>
                    <Tag selected className='tag'>晚餐</Tag>
                    <Tag selected className='tag'>火锅</Tag>
                    <Tag selected className='tag'>烘焙</Tag>
                    <Tag selected className='tag'>宵夜</Tag>
                </TagWrapper>
                <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'300px'}}>
                    <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                </div>
                <RecipesListWrapper>
                    <div className='left'>
                        {
                            leftData && leftData.map((item, index) => {
                                return (
                                    <div key={index} className='contentBox'>
                                        <LazyLoad offset={100} height={80}>
                                            <img 
                                                src={require('@/' + item.imgs[0].url)} 
                                                width="100%" 
                                                height="100%"  
                                                key={index} 
                                                onClick={this.getDynamicDetail(item._id)} 
                                                alt=""
                                                // onError={(img) => {img.onerror = null; img.src=require('@/statics/img/title.png')}}
                                            />
                                        </LazyLoad>
                                        <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                        <div className='otherInfo'>
                                            <div className='user'>
                                                <LazyLoad offset={100}>
                                                    <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)}  className='avatar' alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                                                </LazyLoad>
                                                <span className='userName' onClick={() => this.gotoUserDetail(item.writer)}>{item.userName}</span>
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
                                    <LazyLoad offset={100} height={80}>
                                        <img 
                                            src={require('@/' + item.imgs[0].url)} 
                                            width="100%" 
                                            height="100%"  
                                            key={index} 
                                            onClick={this.getDynamicDetail(item._id)} 
                                            alt=""
                                            // onError={(img) => {img.onerror = null; img.src=require('@/statics/img/title.png')}}
                                        />
                                    </LazyLoad>
                                    <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                    <div className='otherInfo'>
                                        <div className='user'>
                                            <LazyLoad offset={100}>
                                                <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)}  className='avatar' alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                                            </LazyLoad>
                                            <span className='userName' onClick={() => this.gotoUserDetail(item.writer)}>{item.userName}</span>
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
            </div>
         );
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/tab/center/myRecipes',
          userDetail: userData
        })
    }

    getDynamicDetail = (dynamicId) => () => {
        this.props.history.push({
            pathname: '/dynamicDetail/' + dynamicId
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

    getDynamicList() {
        getDynamic().then(res => {
            if (res.data.code === 200) {
                var dynamicList = res.data.data;
                var actionArr = [];
                dynamicList.forEach(item => {
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
                        dynamicList[i].writer = userData;
                        dynamicList[i].userName = userData.name;
                        dynamicList[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    // console.log('dynamicList', dynamicList)
                    this.setState({
                        dynamicList: dynamicList
                    })
                    // 瀑布流分左右布局
                    getHW(dynamicList, 'dynamicList', this) //调用
                    finishLoading(this)

                }).catch(function (err) {
                    Toast.fail('布局未知错误', 1);
                })
            } else {
                Toast.fail('未知错误', 1);
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    componentDidMount() {
        // console.log('this.props.dynamicList', this.props.dynamicList);
        // console.log('this.props.leftDynamic', this.props.leftDynamic);
        // console.log('this.props.rightDynamic', this.props.rightDynamic);
        if (this.props.dynamicList instanceof Array) {
            if (this.props.dynamicList.length !== 0) {
                this.setState({
                    dynamicList: this.props.dynamicList,
                    leftData: this.props.leftDynamic,
                    rightData: this.props.rightDynamic
                })
                finishLoading(this)
            } else {
                this.getDynamicList();
            }
        } else {
            this.getDynamicList();
        }
    }
    
    componentWillUnmount() {
        let dynamicList = this.state.dynamicList;
        let leftDynamic = this.state.leftData;
        let rightDynamic = this.state.rightData;

        this.props.saveDynamicList(dynamicList);
        this.props.saveLeftDynamic(leftDynamic);
        this.props.saveRightDynamic(rightDynamic);
    }
}
 

const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        dynamicList: state.getIn(['home', 'dynamicList']),
        leftDynamic: state.getIn(['home', 'leftDynamic']),
        rightDynamic: state.getIn(['home', 'rightDynamic'])
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(centerActionCreators.saveUserList(userList));
        },
        saveDynamicList(dynamicList) {
            dispatch(actionCreators.saveDynamicList(dynamicList));
        },
        saveLeftDynamic(leftDynamic) {
            dispatch(actionCreators.saveLeftDynamic(leftDynamic));
        },
        saveRightDynamic(rightDynamic) {
            dispatch(actionCreators.saveRightDynamic(rightDynamic));
        }
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Find);