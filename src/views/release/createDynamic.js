import React, { Component } from 'react';
import Header from '@/components/header';
import { List, InputItem, ImagePicker, TextareaItem, Tag, Toast, Modal, ActivityIndicator } from 'antd-mobile';
import { createForm } from 'rc-form';
import { TagContainer, DeleteDynamic } from './style';
import { connect } from 'react-redux';
import { createDynamic, getDynamicDetail, editDynamic, deleteDynamic } from '@/api/dynamicApi';
import CropperModal from '@/components/CropperModal/CropperModal';
import { startLoading, finishLoading } from '@/utils/loading';
import { addFollowRecipes } from '@/api/recipesApi';

const alert = Modal.alert;
const header1 = {
    left: '取消',
    title: '发布动态',
    right: '发布'
}
const header2 = {
    left: '取消',
    title: '编辑动态',
    right: '保存'
}
// const recommendList = ["家常菜", "烘焙", "快手菜", "肉类", "蔬菜", "汤粥主食", "早餐", "午餐", "晚餐", "一人食", "便当", "小吃", "甜品", "零食", "懒人食谱", "下酒菜", "宵夜", "其他"];


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
            animating: false,
            followRecipes: {},
            dynamicDetail: {},
            recommendList: ["家常菜", "烘焙", "快手菜", "肉类", "蔬菜", "汤粥主食", "早餐", "午餐", "晚餐", "一人食", "便当", "小吃", "甜品", "零食", "懒人食谱", "下酒菜", "宵夜"]
         }
        
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleReleaseClick = this.handleReleaseClick.bind(this);
        this.handleGetResultImgUrl = this.handleGetResultImgUrl.bind(this);
        this.deleteDynamic = this.deleteDynamic.bind(this);
    }
    render() { 
        let { getFieldProps } = this.props.form;
        let dynamicId = this.props.location.dynamicId;
        let { dynamicDetail, recommendList } = this.state;
        return ( 
            <div>
                <Header header={dynamicId ? header2 : header1} leftClick={this.handleBackClick} rightClick={this.handleReleaseClick}></Header>
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
                            {...getFieldProps('dynamicName', {
                                initialValue: dynamicId ? dynamicDetail.dynamicName : ''
                              })}
                            // style={recipeTitle}
                            placeholder="添加标题"
                        />
                        <TextareaItem
                            {...getFieldProps('dynamicStory', {
                                initialValue: dynamicId ? dynamicDetail.dynamicStory : ''
                              })}
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
                                        selected={
                                            this.state.recommendSelected.some((val, i) => {
                                                if(item === val){
                                                    return true
                                                } 
                                            })
                                        }
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
                            style={{display: JSON.stringify(this.state.followRecipes) === "{}" ? 'none' : 'block'}}
                            arrow="horizontal" 
                            {...getFieldProps('followRecipes', {
                                initialValue: this.state.followRecipes
                            })}
                            extra={JSON.stringify(this.state.followRecipes) !== "{}" ? this.state.followRecipes.recipeName : '请选择'}
                            // onClick={this.showModal('modal1')} 
                        >关联菜谱</List.Item>
                        {dynamicId ? <DeleteDynamic onClick={this.deleteDynamic}>删除该动态</DeleteDynamic> : ''}
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

    deleteDynamic() {
        alert('', '是否删除该动态', [
            { text: '否', onPress: () => {
                // this.props.history.replace('/tab/center/myRecipes');
            }, style: 'default' },
            { text: '是', onPress: () => {
                deleteDynamic({dynamicId: this.props.location.dynamicId}).then(res => {
                    if (res.data.code === 200) {
                        Toast.success('删除成功！', 1);
                        this.props.history.replace('/tab/center/myDynamic');
                        window.location.reload();
                    }
                }).catch((err) => {
                    console.log('error', err);
                })
            } },
        ]);
    }

    handleBackClick() {
        console.log('handleBackClick')
        this.props.history.push({
            pathname: '/tab/release'
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
        if (this.props.location.dynamicId) {
            createDynamicList.dynamicId = this.props.location.dynamicId;
            let dynamicDetail = this.state.dynamicDetail;
            createDynamicList.imgs.forEach((item, index) => {
                if (item.url.substring(0, 4) !== 'data') {
                    item.url = dynamicDetail.imgs[index].url;
                }
            })
            console.log('createRecipesList', createDynamicList)
            editDynamic(createDynamicList).then(res => {
                finishLoading(this);
                if (res.data.code === 200) {
                    console.log('res.data', res.data);
                    Toast.success('更新成功！', 1)
                    this.props.history.replace('/tab/center/myDynamic');
                    window.location.reload();
                }
            }).catch((err) => {
                console.log('error', err);
            })
        } else {
            createDynamic(createDynamicList).then(res => {
                if (res.data.code === 200) {
                    console.log('res.data', res.data);
                    var id = res.data.data._id;
                    if (JSON.stringify(this.state.followRecipes) === "{}" || !this.state.followRecipes) {
                        finishLoading(this);
                        Toast.success('发布成功！', 1)
                        this.props.history.replace({
                            pathname: '/dynamicDetail/' + id
                        })
                    } else {
                        let collectRecipe = this.props.location.collectRecipe;
                        collectRecipe.followNumber++;
                        collectRecipe.followList.push(res.data.data._id);
                        addFollowRecipes({
                            recipeId: collectRecipe._id, 
                            followNumber: collectRecipe.followNumber,
                            followList: collectRecipe.followList
                        }).then(() => {
                            finishLoading(this);
                            Toast.success('发布成功！', 1)
                            this.props.history.replace({
                                pathname: '/dynamicDetail/' + id
                            })
                        })
                    }
                }
                // return res.data.data._id
            }).catch((err) => {
                console.log('error', err);
            })
        }
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

    getDynamicDetail() {
        getDynamicDetail({
            id: this.props.location.dynamicId
        }).then(res => {
            if (res.data.code === 200) {
                let dynamicDetail = res.data.data;
                let imgs = JSON.parse(JSON.stringify(dynamicDetail.imgs)); 
                imgs.forEach(item => {
                    item.url = require('@/' + item.url)
                })
                this.setState({
                    dynamicDetail,
                    files: imgs,
                    recommendSelected: dynamicDetail.recommend
                })
                console.log('dynamicDetail', dynamicDetail)
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    componentDidMount() {
        if (this.props.location.dynamicId) {
            this.getDynamicDetail();
        }
        if (this.props.location.collectRecipe) {
            let collectRecipe = this.props.location.collectRecipe
            let followRecipes = {
                recipeId: collectRecipe._id,
                recipeName: collectRecipe.recipeName
            }
            this.setState({
                followRecipes: followRecipes
            }, () => {
                console.log('followRecipes', this.state.followRecipes)
            })
        }
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