import React, { Component } from 'react';
import { Toast, ActivityIndicator, List } from 'antd-mobile';
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { findRecipesByUseId, addCollectRecipes, findRecipesDraftByUseId } from '@/api/recipesApi';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from '@/views/home/pages/recommendPage/style';
import { BlankWrapper, EditIcon } from '../../style';

const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

class MyRecipes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipesList: [],
            leftData: [],//左边的数据
            rightData:[],//右边的数据
            animating: true,
            recipesDraft: [],
            userList: {}
        }
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
        this.editRecipes = this.editRecipes.bind(this);
    }
    render() { 
        // let {userList} = this.props;
        let {leftData, rightData, userList} = this.state;
        const RecipesList = <RecipesListWrapper>
            <div className='left'>
                {
                    leftData && leftData.map((item, index) => {
                        return (
                            <div key={index} style={{position: 'relative'}}>
                                {
                                    this.props.location.userDetail ? '' : 
                                    <EditIcon className='iconfont' onClick={this.editRecipes(item._id)}>&#xe678;</EditIcon>
                                }
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
                                        src={require('@/' + item.album[0].url)} 
                                        width="100%" 
                                        height="100%"  
                                        key={index} 
                                        onClick={this.getRecipesDetail(item._id)} 
                                        alt=""/> 
                                }

                                <div className='title' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
                                <div className='otherInfo'>
                                    <div className='user'>
                                        <img src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} className='avatar' alt=""/>
                                        <span className='userName'>{userList.name}</span>
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
                            <div key={index} style={{position: 'relative'}}>
                                {
                                    this.props.location.userDetail ? '' : 
                                    <EditIcon className='iconfont' onClick={this.editRecipes(item._id)}>&#xe678;</EditIcon>
                                }
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
                                        src={require('@/' + item.album[0].url)} 
                                        width="100%" 
                                        height="100%"  
                                        key={index} 
                                        onClick={this.getRecipesDetail(item._id)} 
                                        alt=""/> 
                                }
                                <div className='title' onClick={this.getRecipesDetail(item._id)} alt="">{item.recipeName}</div>
                                <div className='otherInfo'>
                                    <div className='user'>
                                        <img src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} className='avatar' alt=""/>
                                        <span className='userName'>{userList.name}</span>
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
        const Blank = this.props.location.userDetail ? 
        <BlankWrapper>
            <p>暂无菜谱</p>
        </BlankWrapper> : 
        <BlankWrapper>
            <p>创建菜谱的人是厨房里的天使</p>
            <p className='create' onClick={() => {
                this.props.history.replace('/createRecipes')
            }}>开始创建第一道菜谱</p>
        </BlankWrapper>
        return ( 
            <div>
                {
                    this.props.location.userDetail ? '' :
                    <List.Item arrow="horizontal" style={{display: this.state.recipesDraft.length === 0 ? 'none' : 'block'}} onClick={() => {
                        this.props.history.replace({
                            pathname: '/editRecipesDraft',
                            recipesDraft: this.state.recipesDraft
                        })
                    }}>草稿</List.Item>
                }
                <TitleWrapper style={{padding: '0'}}>
                    <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'300px'}}>
                        <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                    </div>
                    { this.props.recipesList.length === 0 ? Blank : RecipesList }
                </TitleWrapper>
            </div>
         );
    }

    editRecipes = (recipeId) => () => {
        this.props.history.replace({
            pathname: '/createRecipes',
            recipeId: recipeId
        })
    }
    
    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId,
            type: 'look'
        })
    }
    
    handleCollectionClick = (recipeId, index, choose, collect) => () => {
        var userInfo = this.props.userList;
        var newCollectionNumber, newCollectionList;
        if (choose === 'left') {
            newCollectionNumber = this.state.leftData[index].collectionNumber;
            newCollectionList = this.state.leftData[index].collectionList;
        } else {
            newCollectionNumber = this.state.rightData[index].collectionNumber;
            newCollectionList = this.state.rightData[index].collectionList;
        }
        if (collect === UNCOLLECT) {
            newCollectionNumber++;
            newCollectionList.push(userInfo._id);
            if (userInfo.collectRecipes) {
                userInfo.collectRecipes.push(recipeId);
            } else {
                userInfo.collectRecipes = [recipeId];
            }
        } else {
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
            userId: userInfo._id,
            recipeId: recipeId,
            collectRecipes: userInfo.collectRecipes,
            collectionNumber: newCollectionNumber,
            collectionList: newCollectionList
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

    findRecipesDraftByUseId(userId) {
        findRecipesDraftByUseId({userId}).then(res => {
            if (res.data.code === 200) {
                let recipesDraft = res.data.data;
                this.setState({
                    recipesDraft
                })
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }
    
    findRecipesByUseId(userId) {
        let userList = {};
        if (this.props.location.userDetail) {
            userList = this.props.location.userDetail;
        } else {
            userList = this.props.userList;
        }
        findRecipesByUseId({userId}).then(res => {
            if (res.data.code === 200) {
                let recipesList = res.data.data;
                recipesList.forEach(item => {
                    if (item.album[0].url.substring(0, 13) === 'statics/video') {
                        item.videoUrl = require('@/' + item.album[0].url)
                    }
                    if (!item.followNumber) {
                        item.followNumber = 0;
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
                    recipesList: recipesList,
                    userList: userList
                })
                if (!this.props.location.userDetail) {
                    this.props.saveRecipesList(recipesList);
                }
                // 瀑布流分左右布局
                getHW(recipesList, 'recipesList', this)
                finishLoading(this)
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        // let collectNum = 0;
        // this.props.recipesList.forEach(item => {
        //     if (!item.collectionNumber) {
        //         item.collectionNumber = 0
        //     }
        //     collectNum += item.collectionNumber
        // })
        // if ((this.props.leftData instanceof Array) && (this.props.rightData instanceof Array) && (collectNum === this.props.userList.collectRecipes.length)) {
       
        if (this.props.location.userDetail) {
            console.log('myRecipes userDetail', this.props.location.userDetail)
            this.findRecipesByUseId(this.props.location.userDetail._id);
        } else {
            if ((this.props.leftData instanceof Array) && (this.props.rightData instanceof Array)) {
                this.setState({
                    userList: this.props.userList,
                    recipesList: this.props.recipesList,
                    leftData: this.props.leftData,
                    rightData: this.props.rightData
                })
                finishLoading(this);
            } else {
                this.findRecipesByUseId(localStorage.getItem('userId'));
            }
            this.findRecipesDraftByUseId(localStorage.getItem('userId'));
        }
    }
    
    componentWillUnmount() {
        if (!this.props.location.userDetail) {
            let recipesList = this.props.recipesList;
            let leftData = this.state.leftData;
            let rightData = this.state.rightData;

            this.props.saveRecipesList(recipesList);
            this.props.saveLeftData(leftData);
            this.props.saveRightData(rightData);
        }
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        recipesList: state.getIn(['center', 'recipesList']),
        leftData: state.getIn(['center', 'leftData']),
        rightData: state.getIn(['center', 'rightData'])
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(actionCreators.saveUserList(userList));
        },
        saveRecipesList(recipesList) {
            dispatch(actionCreators.saveRecipesList(recipesList));
        },
        saveLeftData(leftData) {
            dispatch(actionCreators.saveLeftData(leftData));
        },
        saveRightData(rightData) {
            dispatch(actionCreators.saveRightData(rightData));
        }
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(MyRecipes);
 