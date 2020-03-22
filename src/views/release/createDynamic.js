import React, { Component } from 'react';
import Header from '@/components/header';
import { List, InputItem, ImagePicker, TextareaItem, Tag, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { TagContainer } from './style';
import { connect } from 'react-redux';
import { createDynamic } from '@/api/dynamicApi';


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
            files: [{
                url: 'http://img.juhe.cn/cookbook/t/0/45_854851.jpg',
                id: '1'
            },
            {
                url: 'http://img.juhe.cn/cookbook/s/1/45_0824e37faf00b71e.jpg',
                id: '1'
            }],
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
                    capture="camera"
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
                                                    if(item === val) {
                                                        newSelect1.splice(i, 1)
                                                        this.setState({ 
                                                            recommendSelected: newSelect1
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
        this.props.history.push({
            pathname: '/tab/release',
            selectedTab: 'release'
        })
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
        createDynamicList.userId = this.props.userList._id;
        console.log('createDynamicList', createDynamicList);
        createDynamic(createDynamicList).then(res => {
            if (res.data.code === 200) {
                console.log('res.data', res.data);
                Toast.success('发布成功！', 1)
                this.props.history.push({
                    pathname: '/tab/release'
                })
            }
        }).catch((err) => {
            console.log('error', err);
        })
    }
    
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files
        });
    }
}
 
const CreateDynamicWrapper = createForm()(CreateDynamic);
 
const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDynamicWrapper);