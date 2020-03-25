import React, { Component } from 'react';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from './style';
import { Carousel, Toast, ActivityIndicator } from 'antd-mobile';
import { getRecipes, addCollectRecipes } from '@/api/recipesApi';
import { getUserInfo, checkUser } from '@/api/userApi';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { actionCreators } from '../../store';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';

const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ['activity1', 'activity2', 'activity3'],
            imgHeight: 176,
            recipesList: [],
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true
        }
        this.onMenuClick = this.onMenuClick.bind(this);
        this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
    }

    render() { 
        let {leftData, rightData} = this.state;
        return ( 
            <div>
                <Carousel
                    style={{marginBottom: '1rem', overflow: 'hidden', touchAction: 'none'}}
                    autoplay
                    infinite
                    frameOverflow="visible"
                    slideWidth={0.8}
                    cellSpacing={10}
                    >
                    {this.state.data.map((val, index) => (
                        // <a
                        //     key={val}
                        //     href="http://www.baidu.com"
                        //     style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                        // >
                        <img
                            src={require(`@/statics/img/${val}.png`)}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                            key={index}
                        />
                        // </a>
                    ))}
                </Carousel>
                <TitleWrapper>
                    <span>为你推荐</span>
                    <span className='classify' onClick={this.onMenuClick}>菜谱分类</span>
                    <div style={{ display: this.state.animating ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', width: '100%', height:'300px'}}>
                        <ActivityIndicator id="loading" size="large" animating={this.state.animating}/>
                    </div>
                    <RecipesListWrapper>
                        <div className='left'>
                            {
                                leftData && leftData.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            <img src={item.album[0].url} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} alt=""/>
                                            {/* <img src={require('@/' + item.album[0].url)} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} alt=""/> */}
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={item.avatar} className='avatar' alt=""/>
                                                    <span className='userName'>{item.userName}</span>
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
                                        <div key={index}>
                                            {/* <img src={require('@/' + item.album[0].url)} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} alt=""/> */}
                                            <img src={item.album[0].url} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} />
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} alt="">{item.recipeName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={item.avatar} className='avatar' alt=""/>
                                                    <span className='userName'>{item.userName}</span>
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
            </div>
         );
    }

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId
        })
    }

    handleCollectionClick = (recipeId, index, choose, collect) => () => {
        var userInfo = this.props.userList;
        var newCollectionNumber;
        if (choose === 'left') {
            newCollectionNumber = this.state.leftData[index].collectionNumber;
        } else {
            newCollectionNumber = this.state.rightData[index].collectionNumber;
        }
        if (collect === UNCOLLECT) {
            newCollectionNumber++;
            if (userInfo.collectRecipes) {
                userInfo.collectRecipes.push(recipeId);
            } else {
                userInfo.collectRecipes = [recipeId];
            }
        } else {
            newCollectionNumber--;
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
            collectionNumber: newCollectionNumber
        }).then(() => {
            var newData = []
            if (choose === 'left') {
                newData = this.state.leftData;
                newData[index].collectionNumber = newCollectionNumber;
                newData[index].collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
                this.setState({
                    leftData: newData
                })
            } else {
                newData = this.state.rightData;
                newData[index].collectionNumber = newCollectionNumber;
                newData[index].collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
                this.setState({
                    rightData: newData
                })
            }
        })
    }

    onMenuClick() {
        this.props.history.replace('/menuClass')
    }

    getRecipesList() {
        getRecipes().then(res => {
            if (res.data.code === 200) {
                var recipesList = res.data.data;

                var actionArr = []
                recipesList.forEach(item => {
                    if (!item.collectionNumber) {
                        item.collectionNumber = 0;
                    }

                    if (this.props.userList.collectRecipes instanceof Array) {
                        if (this.props.userList.collectRecipes.length !== 0) {
                            this.props.userList.collectRecipes.forEach(val => {
                                if (val === item._id) {
                                    item.collect = COLLECTED
                                } else {
                                    item.collect = UNCOLLECT
                                }
                            })
                        } else {
                            item.collect = UNCOLLECT
                        }
                    } else {
                        item.collect = UNCOLLECT
                    }

                    actionArr.push(getUserInfo({userId: item.userId}))
                })

                Promise.all(actionArr).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        recipesList[i].userName = userData.name;
                        recipesList[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    // console.log('recipesList', recipesList)
                    this.setState({
                        recipesList: recipesList
                    })
                    // 瀑布流分左右布局
                    getHW(recipesList, 'recipesList', this) //调用
                    finishLoading(this)

                }).catch(function (err) {
                    Toast.fail('未知错误', 1);
                })

            } else {
                Toast.fail('未知错误', 1);
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }
    
    componentDidMount() {
        // console.log('this.props.recipesList', this.props.recipesList);
        // console.log('this.props.leftData', this.props.leftData);
        // console.log('this.props.rightData', this.props.rightData);

        if (this.props.recipesList instanceof Array) {
            if (this.props.recipesList.length !== 0) {
                this.setState({
                    recipesList: this.props.recipesList,
                    leftData: this.props.leftData,
                    rightData: this.props.leftData
                })
                finishLoading(this)
            } else {
                this.getRecipesList();
            }
        } else {
            this.getRecipesList();
        }
    }
    
    componentWillUnmount() {
        let recipesList = this.state.recipesList;
        let leftData = this.state.leftData;
        let rightData = this.state.rightData;

        this.props.saveRecipesList(recipesList);
        this.props.saveLeftData(leftData);
        this.props.saveRightData(rightData);
    }
}
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList']),
        recipesList: state.getIn(['home', 'recipesList']),
        leftData: state.getIn(['home', 'leftData']),
        rightData: state.getIn(['home', 'rightData'])
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(userList) {
            dispatch(centerActionCreators.saveUserList(userList));
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(Recommend);