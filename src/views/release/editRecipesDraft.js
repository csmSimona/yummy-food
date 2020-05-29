import React, { Component } from 'react';
import Header from '@/components/header';
import { List } from 'antd-mobile';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '我的草稿',
    right: ''
};
class EditRecipesDraft extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recipesDraft: []
         }
        this.goBack = this.goBack.bind(this);
        this.editRecipes = this.editRecipes.bind(this);
    }
    render() { 
        return ( 
            <div>
                <Header header={header} leftClick={this.goBack}></Header>
                {
                    this.state.recipesDraft.map((item, index) => {
                        return (
                            <div key={index}>
                                <List.Item arrow="horizontal" onClick={this.editRecipes(index)}>{item.recipeName}</List.Item>
                            </div>
                        )
                    })
                }
            </div>
         );
    }

    editRecipes = (index) => () => {
        this.props.history.replace({
            pathname: '/createRecipes',
            recipeDraft: this.state.recipesDraft[index],
            type: 'recipeDraft'
        })
    }

    goBack() {
        this.props.history.replace('/tab/center/myRecipes')
    }

    componentDidMount() {
        let recipesDraft = this.props.location.recipesDraft;
        this.setState({
            recipesDraft
        })
        console.log('recipesDraft', recipesDraft)
    }
}
 
export default EditRecipesDraft;