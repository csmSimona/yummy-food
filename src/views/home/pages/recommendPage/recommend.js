import React, { Component } from 'react';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from '@/views/home/style';
import { Carousel, Toast, ActivityIndicator } from 'antd-mobile';
import { getRecipes, addCollectRecipes } from '@/api/recipesApi';
import { getUserInfo, checkUser } from '@/api/userApi';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';
import { actionCreators } from '@/views/home/store';

// import RecipesDetail from './recipesDetail';

const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ['1', '2', '3'],
            imgHeight: 176,
            // recipesList: [],
            // leftData:[],//左边的数据
            // rightData:[],//右边的数据
            animating: true
        }
        this.onMenuClick = this.onMenuClick.bind(this);
        this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
    }

    render() { 
        let {leftData, rightData} = this.props;
        return ( 
            <div>
                <Carousel
                    style={{marginBottom: '1rem', overflow: 'hidden'}}
                    autoplay
                    infinite
                    frameOverflow="visible"
                    slideWidth={0.8}
                    cellSpacing={10}
                    >
                    {this.state.data.map(val => (
                        <a
                            key={val}
                            href="http://www.baidu.com"
                            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                        >
                        <img
                            src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                        </a>
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
                                            <img src={item.album[0].url} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} />
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={item.avatar} className='avatar' />
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
                                            <img src={item.album[0].url} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} />
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} >{item.recipeName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={item.avatar} className='avatar' />
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
            pathname: '/recipesDetail',
            recipeId: recipeId
        })
    }

    handleCollectionClick = (recipeId, index, choose, collect) => () => {
        var token = localStorage.getItem('token');
        var user_name = localStorage.getItem('user_name');

        checkUser({token, user_name}).then(res => {
            var userInfo = res.data.userList[0];
            if (!userInfo.collectRecipes) {
                userInfo.collectRecipes = [recipeId];
            } else {
                if (collect === UNCOLLECT) {
                    userInfo.collectRecipes.push(recipeId);
                } else {
                    userInfo.collectRecipes.forEach((item, i) => {
                        if (item === recipeId) {
                            userInfo.collectRecipes.splice(i, 1);
                            i--;
                        }
                    })
                }
                this.props.saveUserList(userInfo);
            }
            return userInfo;
        }).then(userInfo => {
            var newCollectionNumber;
            if (choose === 'left') {
                newCollectionNumber = this.props.leftData[index].collectionNumber;
            } else {
                newCollectionNumber = this.props.rightData[index].collectionNumber;
            }
            if (collect === UNCOLLECT) {
                newCollectionNumber++;
            } else {
                newCollectionNumber--;
            }
            
            addCollectRecipes({
                userId: userInfo._id,
                recipeId: recipeId,
                collectRecipes: userInfo.collectRecipes,
                collectionNumber: newCollectionNumber
            }).then(res => {
                var newData = []
                if (choose === 'left') {
                    newData = this.props.leftData;
                    newData[index].collectionNumber = newCollectionNumber;
                    newData[index].collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
                    // this.setState({
                    //     leftData: newData
                    // })
                    this.props.saveLeftData(newData);
                } else {
                    newData = this.props.rightData;
                    newData[index].collectionNumber = newCollectionNumber;
                    newData[index].collect = collect === UNCOLLECT ? COLLECTED : UNCOLLECT;
                    // this.setState({
                    //     rightData: newData
                    // })
                    this.props.saveRightData(newData);
                }
            })
        }).catch((err) => {
            console.log('error', err);
            this.props.history.push('/login');
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

                    this.props.userList.collectRecipes ? 
                    this.props.userList.collectRecipes.forEach(val => {
                        val === item._id ? item.collect = COLLECTED : item.collect = UNCOLLECT
                    }) : item.collect = UNCOLLECT

                    actionArr.push(getUserInfo({userId: item.userId}))
                })

                Promise.all(actionArr).then(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        var userData = res[i].data.data[0];
                        recipesList[i].userName = userData.name;
                        recipesList[i].avatar = userData.img[0].url;
                    }
                }).then(() => {
                    console.log('recipesList', recipesList)
                    this.setState({
                        animating: false
                    })
                    this.props.saveRecipesList(recipesList);
                    this.getHW(recipesList) //调用
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

    getHW(recipesList){
        var that = this
        let heightDate = [0, 0];//接收累计高度的容器数组
        let rightData = []//渲染右侧盒子的数组
        let leftData = []//渲染左侧盒子的数组

        function loadImg(item) {
            const promise = new Promise(function(resolve, reject) {
                var img = new Image();
                img.src = item.album[0].url;
                img.onload = function() {
                    resolve(img)
                }
                img.onerror = function() {
                    reject()
                }
            })
            return promise
        }
        async function test(item) {
            var result = await loadImg(item).then(function(img) {
                let height = img.height;
                let minNum = Math.min.apply(null, heightDate)// 从heighetData筛选最小项
                let minIndex = heightDate.indexOf(minNum);// 获取 最小项的小标 准备开始进行累加
                heightDate[minIndex] = heightDate[minIndex] + height;//从 heightData 中找到最小的项后进行累加， 
                if(minIndex===0){//[0]加到left [1]加到 right
                    leftData.push(item)
                }else{
                    rightData.push(item)
                }
            }, function() {
                console.log('failed')
            })
            // that.setState({ leftData, rightData });
            that.props.saveLeftData(leftData);
            that.props.saveRightData(rightData);
        }

        recipesList.forEach(item => {
            test(item);
        })
        
        // this.setState({ leftData, rightData });//重新set state
    }
    
    componentWillMount() {
        console.log('this.props.recipesList', this.props.recipesList);
        console.log('this.props.userList', this.props.userList);
        if (this.props.recipesList instanceof Array) {
            return
        } else {
            this.getRecipesList();
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
            });
        }, 100);
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