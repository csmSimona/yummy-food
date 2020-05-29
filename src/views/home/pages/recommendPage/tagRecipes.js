import React, { Component } from 'react';
import { Toast, ActivityIndicator } from 'antd-mobile';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { getUserInfo } from '@/api/userApi';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import Header from '@/components/header';
import { searchRecipes } from '@/api/searchApi';
import { TitleWrapper, RecipesListWrapper, CollectionIcon, JoinWrapper } from './style';
import { addCollectRecipes } from '@/api/recipesApi';

const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

class TagRecipes extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recipesList: [],
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true
        }
        
        this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
        this.goBack = this.goBack.bind(this);
        this.joinTagRecipes = this.joinTagRecipes.bind(this);
    }
    render() { 
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: this.props.location.tag.value,
            right: ''
        };
        let {leftData, rightData, recipesList} = this.state;
        return ( 
            <div>
                <Header header={header} leftClick={this.goBack}></Header>
                <img
                    src={require(`@/statics/img/${this.props.location.tag.url}.jpg`)}
                    alt=""
                    style={{ width: '100%' }}
                />
                <TitleWrapper>
                    <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'300px'}}>
                        <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                    </div>
                    <RecipesListWrapper>
                        <div className='left'>
                            {
                                leftData && leftData.map((item, index) => {
                                    return (
                                        <div key={index} className='contentBox'>
                                            <LazyLoad offset={100} height={50}>
                                                { item.videoUrl ? 
                                                    <video 
                                                        onClick={this.getRecipesDetail(item._id)}
                                                        src={item.videoUrl} 
                                                        controls="controls" 
                                                        width='100%'
                                                    >
                                                        您的浏览器不支持 video 标签。
                                                    </video> : 
                                                    <img 
                                                        src={item.album[0].url.substring(0, 4) === 'http' ? item.album[0].url : require('@/' + item.album[0].url)} 
                                                        width="100%" 
                                                        height="100%"  
                                                        key={index} 
                                                        onClick={this.getRecipesDetail(item._id)} 
                                                        alt=""/> 
                                                }
                                            </LazyLoad>
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
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
                                                        onClick={this.handleCollectionClick(item._id, index, 'left', item.collect)} 
                                                        dangerouslySetInnerHTML={{__html: item.collect}} 
                                                        style={{
                                                            color: item.collect === UNCOLLECT ? '#888888' : '#FB6650'
                                                        }} 
                                                    />
                                                    <span>{item.collectionNumber}</span>
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
                                            <LazyLoad offset={100} height={50}>
                                                { item.videoUrl ? 
                                                    <video 
                                                        onClick={this.getRecipesDetail(item._id)}
                                                        src={item.videoUrl} 
                                                        controls="controls" 
                                                        width='100%'
                                                    >
                                                        您的浏览器不支持 video 标签。
                                                    </video> : 
                                                    <img 
                                                        src={item.album[0].url.substring(0, 4) === 'http' ? item.album[0].url : require('@/' + item.album[0].url)} 
                                                        width="100%" 
                                                        height="100%"  
                                                        key={index} 
                                                        onClick={this.getRecipesDetail(item._id)} 
                                                        alt=""/> 
                                                }
                                            </LazyLoad>
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} alt="">{item.recipeName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <LazyLoad offset={100}>
                                                        <img src={item.avatar.substring(0, 4) === 'http' ? item.avatar : require('@/' + item.avatar)} className='avatar' alt="" onClick={() => this.gotoUserDetail(item.writer)}/>
                                                    </LazyLoad>
                                                    <span className='userName' onClick={() => this.gotoUserDetail(item.writer)}>{item.userName}</span>
                                                </div>
                                                <div className='collection'>
                                                    <CollectionIcon 
                                                        className="iconfont" 
                                                        onClick={this.handleCollectionClick(item._id, index, 'right', item.collect)} 
                                                        dangerouslySetInnerHTML={{__html: item.collect}} 
                                                        style={{
                                                            color: item.collect === UNCOLLECT ? '#888888' : '#FB6650'
                                                        }} 
                                                    />
                                                    <span>{item.collectionNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </RecipesListWrapper>
                </TitleWrapper>
                <JoinWrapper onClick={this.joinTagRecipes}>+ 立即参与</JoinWrapper>
            </div>
         );
    }

    goBack() {
        this.props.history.replace('/tab/home/recommend')
    }

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId,
            type: 'look',
            tag: this.props.location.tag
        })
    }

    joinTagRecipes() {
        this.props.history.replace({
            pathname: '/createRecipes',
            tag: this.props.location.tag.value
        })
    }

    handleCollectionClick = (recipeId, index, choose, collect) => () => {
        let userInfo = this.props.userList;
        let newCollectionNumber, newCollectionList;
        let type;
        let writerId;
        if (choose === 'left') {
            newCollectionNumber = this.state.leftData[index].collectionNumber;
            newCollectionList = this.state.leftData[index].collectionList;
            writerId = this.state.leftData[index].userId;
        } else {
            newCollectionNumber = this.state.rightData[index].collectionNumber;
            newCollectionList = this.state.rightData[index].collectionList;
            writerId = this.state.rightData[index].userId;
        }
        if (collect === UNCOLLECT) {
            type = 'add';
            newCollectionNumber++;
            newCollectionList.push(userInfo._id);
            if (userInfo.collectRecipes) {
                userInfo.collectRecipes.push(recipeId);
            } else {
                userInfo.collectRecipes = [recipeId];
            }
        } else {
            type = 'delete';
            newCollectionNumber--;
            newCollectionList.forEach((item, i) => {
                if (item === userInfo._id) {
                    newCollectionList.splice(i, 1);
                    i--;
                }
            })
            userInfo.collectRecipes.forEach((item, i) => {
                if (item === recipeId) {
                    userInfo.collectRecipes.splice(i, 1);
                    i--;
                }
            })
        }
        this.props.saveUserList(userInfo);
        
        addCollectRecipes({
            writerId: writerId,
            userId: userInfo._id,
            recipeId: recipeId,
            collectRecipes: userInfo.collectRecipes,
            collectionNumber: newCollectionNumber,
            collectionList: newCollectionList,
            type
        }).then(() => {
            var newData = []
            if (choose === 'left') {
                newData = this.state.leftData;
                newData[index].collectionNumber = newCollectionNumber;
                newData[index].collectionList = newCollectionList;
                newData[index].collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
                this.setState({
                    leftData: newData
                })
            } else {
                newData = this.state.rightData;
                newData[index].collectionNumber = newCollectionNumber;
                newData[index].collectionList = newCollectionList;
                newData[index].collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
                this.setState({
                    rightData: newData
                })
            }
        })
    }

    gotoUserDetail(userData) {
        this.props.history.replace({
          pathname: '/center/myRecipes',
          userDetail: userData
        })
    }

    onMenuClick() {
        this.props.history.replace('/menuClass')
    }

    getRecipesList() {
        searchRecipes({searchContent: this.props.location.tag.value, type: 0}).then(res => {
            if (res.data.code === 200) {
                var recipesList = res.data.data;
                recipesList.forEach(item => {
                    if (item.album[0].url.substring(0, 13) === 'statics/video') {
                        item.videoUrl = require('@/' + item.album[0].url)
                    }
                    if (!item.collectionNumber) {
                        item.collectionNumber = 0;
                    }
                    if (!item.collectionList) {
                        item.collectionList = [];
                    }
                    if (this.props.userList.collectRecipes instanceof Array) {
                        if (this.props.userList.collectRecipes.length !== 0) {
                            var collected = this.props.userList.collectRecipes.some(val => {
                                if (val === item._id) {
                                    return true
                                }
                            })
                            if (collected) {
                                item.collect = COLLECTED
                            } else {
                                item.collect = UNCOLLECT
                            }
                        } else {
                            item.collect = UNCOLLECT
                        }
                    } else {
                        item.collect = UNCOLLECT
                    }
                })
                this.setState({
                    recipesList: recipesList
                })
                // 瀑布流分左右布局
                getHW(recipesList, 'recipesList', this) //调用
                finishLoading(this)
            } else {
                Toast.fail('未知错误', 1);
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }
    
    componentDidMount() {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        this.getRecipesList();
    }
    
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList'])
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(centerActionCreators.saveUserList(userList));
        }
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(TagRecipes);