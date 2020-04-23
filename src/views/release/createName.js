import React, { Component } from 'react';
import Header from '@/components/header';
import { recipeTitle, Border, Desc } from './style';
import { InputItem } from 'antd-mobile';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '创建菜谱',
    right: '下一步'
}

class CreateName extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            click: true
        }
        this.handleNextClick = this.handleNextClick.bind(this);
    }
    render() { 
        return ( 
            <div>
                <Header header={header} click={this.state.click} rightClick={this.handleNextClick}></Header>
                {/* <Border/> */}
                <InputItem
                    value={this.state.recipeName}
                    onChange={(val) => {
                        let newClick;
                        if (val) {
                            newClick = false
                        } else {
                            newClick = true
                        }
                        this.setState({
                            recipeName: val,
                            click: newClick
                        })
                    }}
                    style={recipeTitle}
                    placeholder="写下你的菜谱名吧"
                />
                <Border/>
                <Desc>
                    <div>提示</div>
                    <p>1.好的标题是吸引厨友关注的第一步</p>
                    <p>2.在标题中描述菜谱的特点，会吸引更多人点击。如“ 不用你饿的饭团 ”,“ 不焯水不放油的红烧肉 ”。</p>
                </Desc>
            </div>
         );
    }
    handleNextClick() {
        if (this.state.click) {
            return
        } else {
            this.props.history.replace({
                pathname: '/createRecipes',
                recipeName: this.state.recipeName
            })
        }
    }
}
 
export default CreateName;