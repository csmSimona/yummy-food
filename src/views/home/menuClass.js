import React, { Component } from 'react';
import Header from '../../components/header';


const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '菜谱分类',
    right: ''
}

class MenuClass extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
        this.handleBackClick = this.handleBackClick.bind(this);
    }
    render() { 
        return ( 
            <div>
                <Header header={header} leftClick={this.handleBackClick}></Header>
            </div>
         );
    }
    handleBackClick() {
        this.props.history.replace('/tab/home/recommend');
    }
}
 
export default MenuClass;