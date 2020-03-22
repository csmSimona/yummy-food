import React, { Component } from 'react';
import Header from '@/components/header';
import { Modal, ImagePicker } from 'antd-mobile';
const header = {
    left: '取消',
    title: '标题',
    right: '···'
}

class RecipesDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        }
    }

    render() { 
       return (
           <div>
               <Header header={header}></Header>
            </div>
       )
    }
}
 
export default RecipesDetail;