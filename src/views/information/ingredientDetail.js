import React, { Component } from 'react';
import Header from '@/components/header';
import { IngredientDetailWrapper } from '../home/pages/searchPage/style';
import { Tabs } from 'antd-mobile';

const tabs = [
    {
      title: '适宜搭配',
    //   path: '/tab/home/concern',
      id: 0
    },
    { 
      title: '不宜搭配',
    //   path: '/tab/home/recommend',
      id: 1
    }
  ];

class IngredientDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ingredientDetail: {}
         }
         this.goBack = this.goBack.bind(this);
    }
    render() { 
        let { ingredientDetail } = this.state;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: ingredientDetail.name,
            right: ' '
        };
        return ( 
            <IngredientDetailWrapper>
                <Header header={header} leftClick={this.goBack}></Header>
                {/* <Header header={header}></Header> */}
                {ingredientDetail.img && <img src={require('@/' + ingredientDetail.img)} width="100%" /> }
                <div className='content'>
                    <div className='name'>{ingredientDetail.name}</div>
                    <div className='desc'>
                        <p>【别名】：{ingredientDetail.alias}</p>
                        <p>【食量建议】：{ingredientDetail.intake}</p>
                        <p>【适宜人群】：{ingredientDetail.suitable}</p>
                        <p>【禁忌人群】：{ingredientDetail.avoid}</p>
                    </div>
                    <div className='title'>介绍</div>
                    <div className='desc'>{ingredientDetail.introduce}</div>
                    <div className='title'>营养价值</div>
                    <div className='desc'>{ingredientDetail.value}</div>
                    <div className='title'>选购</div>
                    <div className='desc'>{ingredientDetail.choose}</div>
                    <div className='title'>存储</div>
                    <div className='desc'>{ingredientDetail.store}</div>
                    <div className='title'>烹饪小技巧</div>
                    <div className='desc'>{ingredientDetail.tip}</div>
                    <Tabs tabs={tabs}
                        initialPage={0}
                        onChange={(tab, index) => { console.log('onChange', index, tab); }}
                        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                    >
                        <div  className='desc'>
                            {ingredientDetail.goodCollocation}
                        </div>
                        <div  className='desc'>
                            {ingredientDetail.babCollocation}
                        </div>
                    </Tabs>
                </div>
            </IngredientDetailWrapper>
         );
    }

    goBack() {
        this.props.history.replace({
            pathname: '/searchDetail',
            searchInput: this.state.ingredientDetail.name
        })
    }

    componentDidMount() {
        this.setState({
            ingredientDetail: this.props.location.ingredientDetail
        })
        console.log(this.props.location.ingredientDetail);
    }
}
 
export default IngredientDetail;