import React, { Component } from 'react';
import Header from '../../components/header';
import { Modal, List, InputItem, Button, ImagePicker, TextareaItem, Tag, Toast, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
import { CreateRecipesWrapper, ButtonWrapper, recipeTitle, Tip, TagContainer, MaterialsWrapper, AddMore, IconWrapper, CookStepsWrapper } from './style';

const alert = Modal.alert;
const data = [];

const header = {
    left: '取消',
    title: '动态',
    right: '发布'
}

const recommendList = ["家常菜", "烘焙", "快手菜", "肉类", "蔬菜", "汤粥主食", "早餐", "午餐", "晚餐", "一人食", "便当", "小吃", "甜品", "零食", "懒人食谱", "下酒菜", "宵夜", "其他"];

class CreateDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recommendSelected: [],
            files: data,
         }
        
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleReleaseClick = this.handleReleaseClick.bind(this);
    }
    render() { 
        const { getFieldProps } = this.props.form;
        return ( 
            <div>
                <Header header={header} leftClick={this.handleBackClick} rightClick={this.handleReleaseClick}></Header>
                <ImagePicker
                    files={this.state.files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={this.state.files.length < 9}
                    length="3"
                    />
                <form style={{marginBottom: '3rem'}}>
                    <List>
                        <InputItem
                            {...getFieldProps('dynamicName')}
                            // style={recipeTitle}
                            placeholder="添加标题"
                        />
                        <TextareaItem
                            {...getFieldProps('dynamicStory')}
                            rows={5}
                            count={255}
                            placeholder="此刻，你想说点什么......"
                        />
                        <List.Item
                            {...getFieldProps('recommend', {
                                initialValue: this.state.recommendSelected,
                              })}
                        >相关话题
                            <TagContainer>
                                {
                                    recommendList.map((item, index) => {
                                        return <Tag key={index}
                                        onChange={selected => {
                                            if (selected) {
                                                var newSelect = this.state.recommendSelected
                                                newSelect.push(item)
                                                this.setState({ 
                                                    recommendSelected: newSelect
                                                })
                                                console.log('recommendSelected', newSelect);
                                            } else {
                                                var newSelect1 = this.state.recommendSelected
                                                newSelect1.forEach((val, i) => {
                                                    if(item === val){
                                                        this.setState({ 
                                                            recommendSelected: newSelect1.splice(i, 1)
                                                        })
                                                        i--;
                                                    } 
                                                })
                                                console.log('recommendSelected', newSelect1);
                                            }
                                        }}>{item}</Tag>
                                    })
                                }
                            </TagContainer>
                        </List.Item>
                        <List.Item 
                            arrow="horizontal" 
                            extra="请选择"
                            // {...getFieldProps('selected1', {
                            //     initialValue: this.state.selected1
                            // })}
                            // onClick={this.showModal('modal1')} 
                            // extra={this.state.selected1}
                        >关联菜谱</List.Item>
                    </List>
                </form>
            </div>
         );
    }

    handleBackClick() {
        console.log('handleBackClick')
        const alertInstance = alert('', '是否保存到草稿箱', [
            { text: '否', onPress: () => {
                this.props.history.push({
                    pathname: '/tab/release',
                    selectedTab: 'release'
                })
            }, style: 'default' },
            { text: '是', onPress: () => {
                console.log('保存草稿，并跳转到上一页');
            } },
          ]);
          setTimeout(() => {
            console.log('auto close');
            alertInstance.close();
          }, 500000);
    }

    handleReleaseClick() {
        let createDynamicList = this.props.form.getFieldsValue();
        if (this.state.files.length === 0) {
            Toast.info('请选择你满意的图片吧', 1)
            return false
        } else {
            createDynamicList.imgs = this.state.files;
        }
        if (!createDynamicList.dynamicName) {
            Toast.info('标题不能为空', 1)
            return false
        }
        if (!createDynamicList.dynamicStory) {
            Toast.info('说点什么吧', 1)
            return false
        }
        console.log(createDynamicList);
        // this.props.history.push({
        //     pathname: '/tab/release',
        //     selectedTab: 'release'
        // })
    }
    
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files
        });
    }
}
 
const CreateDynamicWrapper = createForm()(CreateDynamic);
 
export default CreateDynamicWrapper;