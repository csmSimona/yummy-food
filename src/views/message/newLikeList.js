import React, { Component } from 'react';
import Header from '@/components/header';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '收到的赞',
    right: ''
};

class NewLikeList extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <Header header={header}></Header>
            </div>
         );
    }
}
 
export default NewLikeList;