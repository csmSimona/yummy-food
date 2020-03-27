import React, { Component } from 'react';
import { TitleWrapper, RecipesListWrapper, CollectionIcon } from './style';

const UNCOLLECT = '&#xe60f;';
const COLLECTED = '&#xe661;';

class WaterFallLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        // this.handleCollectionClick = this.handleCollectionClick.bind(this);
        this.getRecipesDetail = this.getRecipesDetail.bind(this);
    }
    render() { 
        let { leftData, rightData, handleCollectionClick} = this.props;
        return ( 
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
                                            <img src={require('@/' + item.avatar)}  className='avatar' alt=""/>
                                            <span className='userName'>{item.userName}</span>
                                        </div>
                                        <div className='collection'>
                                            <CollectionIcon 
                                                className="iconfont" 
                                                onClick={() => handleCollectionClick(item._id, index, 'left', item.collect)} 
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
                                    <img src={item.album[0].url} width="100%" height="100%"  key={index} onClick={this.getRecipesDetail(item._id)} alt=""/>
                                    <div className='title' onClick={this.getRecipesDetail(item._id)} alt="">{item.recipeName}</div>
                                    <div className='otherInfo'>
                                        <div className='user'>
                                            <img src={require('@/' + item.avatar)}  className='avatar' alt=""/>
                                            <span className='userName'>{item.userName}</span>
                                        </div>
                                        <div className='collection'>
                                            <CollectionIcon 
                                                className="iconfont" 
                                                onClick={() => handleCollectionClick(item._id, index, 'right', item.collect)} 
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
        );
    }
    // getRecipesDetail() {
    //     this.props.getRecipesDetail();
    // }
    // handleCollectionClick() {
    //     this.props.handleCollectionClick();
    // }

    getRecipesDetail = (recipeId) => () => {
        var that = this.props.that
        that.props.history.push({
            pathname: '/recipesDetail/' + recipeId
        })
    }

    // handleCollectionClick = (recipeId, index, choose, collect) => () => {
    //     this.props.handleCollectionClick(recipeId, index, choose, collect);
    // }

}
 
export default WaterFallLayout;