import React, { Component } from 'react';
import { Toast, ActivityIndicator } from 'antd-mobile';
import { connect } from 'react-redux';
import { actionCreators } from '../../store';
import { finishLoading } from '@/utils/loading';
import getHW from '@/utils/getHW';
import { findDynamicByUseId } from '@/api/dynamicApi';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from '@/views/home/pages/recommendPage/style';

class MyDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            leftData:[],//左边的数据
            rightData:[],//右边的数据
            animating: true
         }
        this.getDynamicDetail = this.getDynamicDetail.bind(this);
    }
    render() { 
        let {userList, leftDynamic: leftData, rightDynamic: rightData} = this.props;
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
                                        <div key={index} className='contentBox'>
                                            <img src={require('@/' + item.imgs[0].url)} width="100%" height="100%"  key={index} onClick={this.getDynamicDetail(item._id)} alt=""/>
                                            <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                    <img src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} className='avatar' alt=""/>
                                                    <span className='userName'>{userList.name}</span>
                                                </div>
                                                <div className='collection'>
                                                    <CollectionIcon 
                                                        className="iconfont" 
                                                        style={{color: '#888888'}} 
                                                    >&#xe63a;</CollectionIcon>
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
                                            <img src={require('@/' + item.imgs[0].url)} width="100%" height="100%"  key={index} onClick={this.getDynamicDetail(item._id)} alt=""/>
                                            <div className='title' onClick={this.getDynamicDetail(item._id)} >{item.dynamicName}</div>
                                            <div className='otherInfo'>
                                                <div className='user'>
                                                <img src={userList.img ? require('@/' + userList.img[0].url) : require('@/statics/img/title.png')} className='avatar' alt=""/>
                                                    <span className='userName'>{userList.name}</span>
                                                </div>
                                                <div className='collection'>
                                                    <CollectionIcon 
                                                        className="iconfont" 
                                                        style={{color: '#888888'}} 
                                                    >&#xe63a;</CollectionIcon>
                                                    <span>{item.likeNumber}</span>
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

    getDynamicDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/dynamicDetail/' + recipeId
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
                })
                console.log('index dynamicList', dynamicList);
                this.props.saveDynamicList(dynamicList);
                // 瀑布流分左右布局
                getHW(dynamicList, 'dynamicList', this);
                finishLoading(this);

            }
        })
    }

    componentDidMount() {
        if ((this.props.leftDynamic instanceof Array) && (this.props.rightDynamic instanceof Array)) {
            finishLoading(this);
        } else {
            this.findDynamicByUseId(localStorage.getItem('userId'));
        }
        // console.log('this.props.dynamicList', this.props.dynamicList);
        // console.log('this.props.leftDynamic', this.props.leftDynamic);
        // console.log('this.props.rightDynamic', this.props.rightDynamic);
    }
    
    componentWillUnmount() {
        let dynamicList = this.props.dynamicList;
        let leftDynamic = this.props.leftDynamic;
        let rightDynamic = this.props.rightDynamic;

        this.props.saveDynamicList(dynamicList);
        this.props.saveLeftDynamic(leftDynamic);
        this.props.saveRightDynamic(rightDynamic);
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