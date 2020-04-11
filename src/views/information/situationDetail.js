import React, { Component } from 'react';
import { getSituationDetail } from '@/api/searchApi';
import Header from '@/components/header';
import { SituationDetailWrapper, Border, RecipesListWrapper, NoDataWrapper, HeaderFix, BackIcon } from './style';
import { Tag, Toast, ActivityIndicator, SearchBar } from 'antd-mobile';
import { getRecipesById } from '@/api/recipesApi';
import getHW from '@/utils/getHW';
import { finishLoading } from '@/utils/loading';

class SituationDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            situationDetail: {},
            recipesList: [],
            leftData: [],
            rightData: [],
            animating: true,
            tip: '',
            noData: false,
            searchContent: ''
        }
        this.goBack = this.goBack.bind(this);
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
    }
    render() { 
        let { situationDetail, leftData, rightData, noData, searchContent } = this.state;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: situationDetail.name,
            right: ' '
        };
        const Blank = 
        <div>
            <HeaderFix>
                <BackIcon 
                    className='iconfont back' 
                    onClick={() => {
                    this.props.history.replace('/tab/information')
                }}>&#xe61f;</BackIcon>
                <SearchBar 
                    placeholder="搜索 吃什么 场景"
                    cancelText=" "
                    value={searchContent}
                    onChange={(val) => {
                        this.setState({
                            searchContent: val
                        })
                    }}
                />
                <div className='searchButton' onClick={() => {this.getSituationDetail(searchContent)}}>搜索</div>
            </HeaderFix>
            <NoDataWrapper>
                <p>暂无关于“{this.props.location.name}”的资讯</p>
                <p>您可以换个关键词试试</p>
            </NoDataWrapper>
        </div>
        const Situation = <div>
            <Header header={header} leftClick={this.goBack}></Header>
                <Border/>
                <SituationDetailWrapper>
                    <span>为您介绍</span>
                    <p>{situationDetail.desc}</p>
                    <span>推荐食材</span>
                    <div className='ingredient'>
                        {
                            situationDetail.ingredients && situationDetail.ingredients.map((val, i) => {
                                return (
                                    <Tag key={i} selected onChange={() => {this.getSearchDetail(val)}}>{val}</Tag>
                                )
                            })
                        }
                    </div>
                    <span>推荐食谱</span>
                    <RecipesListWrapper>
                        <div className='left'>
                            {
                                leftData && leftData.map((item, index) => {
                                    return (
                                        <div key={index} className='contentBox'>
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
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </RecipesListWrapper>
                </SituationDetailWrapper>
        </div>
        return ( 
            <div>
                <ActivityIndicator
                    toast
                    text="Loading..."
                    animating={this.state.animating}
                />
                { noData ? Blank : Situation}
            </div>
         );
    }

    getSearchDetail(val) {
        let historySearch = JSON.parse(localStorage.getItem('historySearch'));
        let searchInput = val;
        this.props.history.replace({
            pathname: '/searchDetail',
            searchInput: searchInput
        })
        if (historySearch) {
            if (historySearch.indexOf(searchInput) === -1) {
                historySearch.push(searchInput);
            }
        } else {
            historySearch = [searchInput];
        }
        localStorage.setItem('historySearch', JSON.stringify(historySearch));
    }
    
    getSituationDetail(name) {
        this.props.history.replace({
            pathname: '/situationDetail',
            name: name
        })
    }

    getRecipesDetail = (recipeId) => () => {
        this.props.history.push({
            pathname: '/recipesDetail/' + recipeId,
            type: 'look'
        })
    }

    goBack() {
        this.props.history.replace('/tab/information')
    }

    getSituationDetail() {
        getSituationDetail({name: this.props.location.name}).then(res => {
            if (res.data.code === 200) {
                let situationDetail = res.data.data;
                if (situationDetail) {
                    let actionArr = [];
                    let recipesList = [];
                    situationDetail.recipes.forEach(item => {
                        actionArr.push(getRecipesById({id: item}))
                    })
                    Promise.all(actionArr).then(function (res) {
                        for (var i = 0; i < res.length; i++) {
                            recipesList.push(res[i].data.data);
                        }
                    }).then(() => {
                        this.setState({
                            recipesList: recipesList,
                            situationDetail: situationDetail
                        })
                        // 瀑布流分左右布局
                        getHW(recipesList, 'recipesList', this); //调用
                        finishLoading(this);
                    }).catch(function (err) {
                        Toast.fail('未知错误', 1);
                    })
                } else {
                    finishLoading(this);
                    this.setState({
                        noData: true,
                        searchContent: this.props.location.name
                    })
                }
            }
        })
    }

    componentDidMount() {
        this.getSituationDetail();
    }
}
 
export default SituationDetail;