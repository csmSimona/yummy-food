import React, { Component } from 'react';
import { Toast, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { findRecipesByUseId } from '@/api/recipesApi';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from '@/views/home/pages/recommendPage/style';

class MyRecipes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true
        }
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
    }
    render() { 
        let {userList, leftData, rightData} = this.props;
        return ( 
            <div>
                <TitleWrapper>
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
                                                    <img src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} className='avatar' alt=""/>
                                                    <span className='userName'>{userList.name}</span>
                                                </div>
                                                <div className='collection'>
                                                    <CollectionIcon 
                                                        className="iconfont" 
                                                        style={{color: '#888888'}} 
                                                    >&#xe60f;</CollectionIcon>
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
                                            <img src={item.album[0].url} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} alt=""/>
                                            <div className='title' onClick={this.getRecipesDetail(item._id)} alt="">{item.recipeName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} className='avatar' alt=""/>
                                                    <span className='userName'>{userList.name}</span>
                                                </div>
                                                <div className='collection'>
                                                    <CollectionIcon 
                                                        className="iconfont" 
                                                        style={{color: '#888888'}} 
                                                    >&#xe60f;</CollectionIcon>
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
    
    findRecipesByUseId(userId) {
        findRecipesByUseId({userId}).then(res => {
            if (res.data.code === 200) {
                let recipesList = res.data.data;
                recipesList.forEach(item => {
                    if (!item.collectionNumber) {
                        item.collectionNumber = 0;
                    }
                })
                recipesList.forEach(item => {
                    if (!item.followNumber) {
                        item.followNumber = 0;
                    }
                })
                this.props.saveRecipesList(recipesList);
                // 瀑布流分左右布局
                getHW(recipesList, 'recipesList', this)
                finishLoading(this)
            }
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
        if ((this.props.leftData instanceof Array) && (this.props.rightData instanceof Array)) {
            finishLoading(this);
        } else {
            this.findRecipesByUseId(localStorage.getItem('userId'));
        }
        // console.log('this.props.userList', this.props.userList);
        // console.log('this.props.recipesList', this.props.recipesList);
        // console.log('this.props.leftData', this.props.leftData);
        // console.log('this.props.rightData', this.props.rightData);
    }
    
    componentWillUnmount() {
        let recipesList = this.props.recipesList;
        let leftData = this.props.leftData;
        let rightData = this.props.rightData;

        this.props.saveRecipesList(recipesList);
        this.props.saveLeftData(leftData);
        this.props.saveRightData(rightData);
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
 