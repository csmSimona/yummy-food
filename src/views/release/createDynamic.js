import React, { Component } from 'react';
import Header from '@/components/header';
import { List, InputItem, ImagePicker, TextareaItem, Tag, Toast, Modal, ActivityIndicator } from 'antd-mobile';
import { createForm } from 'rc-form';
import { TagContainer } from './style';
import { connect } from 'react-redux';
import { createDynamic } from '@/api/dynamicApi';
import CropperModal from '@/components/CropperModal/CropperModal';
import { startLoading, finishLoading } from '@/utils/loading';

const header = {
    left: '取消',
    title: '动态',
    right: '发布'
}

const recommendList = ["家常菜", "烘焙", "快手菜", "肉类", "蔬菜", "汤粥主食", "早餐", "午餐", "晚餐", "一人食", "便当", "小吃", "甜品", "零食", "懒人食谱", "下酒菜", "宵夜", "其他"];


const MAX_FILE_SIZE = 5 * 1024 * 1024 // 文件最大限制为5M

function blobToBase64(blob, callback) {
    let a = new FileReader();
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
}

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
}

class CreateDynamic extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            recommendSelected: [],
            files: [],
            classModalVisible: false,
            classModalFile: null,
            classResultImgUrl: null,
            showBigModal: false,
            showBigUrl: '',
            animating: false
         }
        
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleReleaseClick = this.handleReleaseClick.bind(this);
        this.handleGetResultImgUrl = this.handleGetResultImgUrl.bind(this)
    }
    render() { 
        const { getFieldProps } = this.props.form;
        return ( 
            <div>
                <Header header={header} leftClick={this.handleBackClick} rightClick={this.handleReleaseClick}></Header>
                {/* <ImagePicker
                    files={this.state.files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={this.state.files.length < 9}
                    length="3"
                    capture="camera"
                    /> */}
                <ImagePicker
                    accept='*'
                    files={this.state.files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => {
                        console.log(index, fs);
                        this.setState({
                            showBigModal: true,
                            showBigUrl: fs[index].url
                        })
                    }}
                    length="3"
                    selectable={this.state.files.length < 9}
                    capture="camera"
                />
                {this.state.classModalVisible && (
                <CropperModal
                    uploadedImageFile={this.state.classModalFile}
                    onClose={() => {
                    this.setState({ classModalVisible: false })
                    }}
                    onSubmit={this.handleGetResultImgUrl}
                    classModalVisible={this.state.classModalVisible}
                />
                )}
                <Modal
                    visible={this.state.showBigModal}
                    transparent
                    maskClosable={true}
                    onClose={this.onClose('showBigModal')}
                    title="查看图片"
                    footer={[{ text: '关闭', onPress: () => { this.onClose('showBigModal')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <img src={this.state.showBigUrl} alt='查看图片' width="100%" height="100%" />
                </Modal>

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
                <ActivityIndicator
                    toast
                    text="正在发布..."
                    animating={this.state.animating}
                />
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
        startLoading(this);
        createDynamic(createDynamicList).then(res => {
            finishLoading(this);
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
    
    
    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
          [key]: true,
        });
      }
      onClose = key => () => {
        this.setState({
          [key]: false,
        });
      }
    
      onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
          return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
          e.preventDefault();
        }
      }

    
      onChange = (files, type, index) => {
        let file
        if (files.length) {
            file = files[files.length - 1].file
        }
        console.log(files, type, index)

        if (type === 'add') {
            if (file.size <= MAX_FILE_SIZE) {
                this.setState(
                    {
                        classModalFile: file // 先把上传的文件暂存在state中
                    },
                    () => {
                        this.setState({
                            classModalVisible: true // 然后弹出modal
                        })
                    }
                )
            } else {
                console.log('文件过大')
            }
        } else {
            this.setState({
                files: files // 然后弹出modal
            })
        }
    }
    
    handleGetResultImgUrl = blob => {
        // blob转base64
        blobToBase64(blob, (str) => {
            var newFile = this.state.files
            newFile.push({
                url: str
            })
            this.setState({
                classResultImgUrl: str,
                files: newFile
            })
        })
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