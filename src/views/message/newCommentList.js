import React, { Component } from 'react';
import Header from '@/components/header';

const header = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '评论',
    right: ''
};

class NewCommentList extends Component {
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
 
export default NewCommentList;