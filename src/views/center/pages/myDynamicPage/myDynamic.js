import React, { Component } from 'react';
import { Toast, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { findDynamicByUseId, addLikeDynamic } from '@/api/dynamicApi';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from '@/views/home/pages/recommendPage/style';
import { BlankWrapper, EditIcon } from '../../style';
import LazyLoad from 'react-lazyload';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

class MyDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            dynamicList: [],
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true,
            userList: {}
         }
        this.getDynamicDetail = this.getDynamicDetail.bind(this);
        this.editDynamic = this.editDynamic.bind(this);
    }
    render() { 
        // let { userList } = this.props;
        let { leftData, rightData, userList } = this.state;
        const DynamicList = <RecipesListWrapper>
            <div className='left'>
                {
                    leftData && leftData.map((item, index) => {
                        return (
                            <div key={index} className='contentBox' style={{position: 'relative'}}>
                                {
                                    this.props.location.userDetail ? '' : 
                                    <EditIcon className='iconfont' onClick={this.editDynamic(item._id)}>&#xe678;</EditIcon>
                                }
                                <LazyLoad offset={100}>
                                    <img src={require('@/' + item.imgs[0].url)} width="100%" height="100%"  key={index} onClick={this.getDynamicDetail(item._id)} alt=""/>
                                </LazyLoad>
                                <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                <div className='otherInfo'>
                                    <div className='user'>
                                        <LazyLoad offset={100}>
                                            <img src={userList.img ? userList.img[0].url.substring(0, 4) ? userList.img[0].url : require('@/' + userList.img[0].url) : require('@/statics/img/blank.jpeg')} className='avatar' alt=""/>
                                        </LazyLoad>
                                        <span className='userName'>{userList.name}</span>
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
                            <div key={index} className='contentBox' style={{position: 'relative'}}>
                                {
                                    this.props.location.userDetail ? '' : 
                                    <EditIcon className='iconfont' onClick={this.editDynamic(item._id)}>&#xe678;</EditIcon>
                                }
                                <LazyLoad offset={100}>
                                    <img src={require('@/' + item.imgs[0].url)} width="100%" height="100%"  key={index} onClick={this.getDynamicDetail(item._id)} alt=""/>
                                </LazyLoad>
                                <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                <div className='otherInfo'>
                                    <div className='user'>
                                        <LazyLoad offset={100}>
                                            <img src={userList.img[0].url.substring(0, 4) ? userList.img[0].url : require('@/' + userList.img[0].url)}className='avatar' alt=""/>
                                        </LazyLoad>
                                        <span className='userName'>{userList.name}</span>
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
            <p>暂无动态</p>
        </BlankWrapper> : 
        <BlankWrapper>
            <p>记录生活，生活因回忆更美丽</p>
            <p className='create' onClick={() => {
                this.props.history.replace('/createDynamic')
            }}>分享我的美食作品</p>
        </BlankWrapper>

        return ( 
            <div>
                <TitleWrapper style={{padding: '0'}}>
                    <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'300px'}}>
                        <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                    </div>
                    { this.props.dynamicList.length === 0 ? Blank : DynamicList }
                    </TitleWrapper>
            </div>
         );
    }

    editDynamic = (dynamicId) => () => {
        this.props.history.replace({
            pathname: '/createDynamic',
            dynamicId: dynamicId
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
        let type, writerId;
        
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

    findDynamicByUseId(userId) {
        findDynamicByUseId({userId}).then(res => {
            if (res.data.code === 200) {
                let dynamicList = res.data.data;
                
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
                })
                if (!this.props.location.userDetail) {
                    this.setState({
                        dynamicList: dynamicList,
                        userList: this.props.userList
                    })
                    this.props.saveDynamicList(dynamicList);
                } else {
                    this.setState({
                        dynamicList: dynamicList,
                        userList: this.props.location.userDetail
                    })
                }
                // 瀑布流分左右布局
                getHW(dynamicList, 'dynamicList', this);
                finishLoading(this);
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        if (this.props.location.userDetail) {
            console.log('myDynamic userDetail', this.props.location.userDetail);
            this.findDynamicByUseId(this.props.location.userDetail._id);
        } else {
            if ((this.props.leftDynamic instanceof Array) && (this.props.rightDynamic instanceof Array)) {
                this.setState({
                    userList: this.props.userList,
                    dynamicList: this.props.dynamicList,
                    leftData: this.props.leftDynamic,
                    rightData: this.props.rightDynamic
                })
                finishLoading(this);
            } else {
                this.findDynamicByUseId(localStorage.getItem('userId'));
            }
        }
        // console.log('this.props.dynamicList', this.props.dynamicList);
        // console.log('this.props.leftDynamic', this.props.leftDynamic);
        // console.log('this.props.rightDynamic', this.props.rightDynamic);
    }
    
    componentWillUnmount() {
        if (!this.props.location.userDetail) {
            let dynamicList = this.props.dynamicList;
            let leftDynamic = this.state.leftData;
            let rightDynamic = this.state.rightData;

            this.props.saveDynamicList(dynamicList);
            this.props.saveLeftDynamic(leftDynamic);
            this.props.saveRightDynamic(rightDynamic);
        }
    }
}
 

const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        dynamicList: state.getIn(['center', 'dynamicList']),
        leftDynamic: state.getIn(['center', 'leftDynamic']),
        rightDynamic: state.getIn(['center', 'rightDynamic'])
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(actionCreators.saveUserList(userList));
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(MyDynamic);