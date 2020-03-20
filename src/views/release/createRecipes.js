import React, { Component } from 'react';
import Header from '../../components/header';
import { Modal, List, InputItem, Button, ImagePicker, TextareaItem, Tag, Toast, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
import { CreateRecipesWrapper, ButtonWrapper, recipeTitle, Tip, TagContainer, MaterialsWrapper, AddMore, IconWrapper, CookStepsWrapper, NoBorder } from './style';
// import { Input } from 'antd';
// import 'antd/dist/antd.css';

const alert = Modal.alert;
const header = {
    left: '取消',
    title: '创建菜谱',
    right: '存草稿'
}
const stepImgs = [];
const tagList = [
    {
        id: 1,
        name: '工艺',
        tag: ["煮", "炒", "蒸", "烧", "拌", "炖", "炸", "煎", "烤", "烘焙", "其他"]
    },
    {
        id: 2,
        name: '口味',
        tag: ["咸鲜味", "家常味", "甜味", "香辣味", "酸甜味", "麻辣味", "苦香味", "五香味", "酱香味", "咖喱味", "其他"]
    },
    {
        id: 3,
        name: '时间',
        tag: ["<5分钟", "<10分钟", "<15分钟", "<20分钟", "<25分钟", "<30分钟", "<60分钟", "<90分钟", "<2小时", ">2小时"]
    },
    {
        id: 4,
        name: '难度',
        tag: ["初级", "中级", "高级"]
    }
]

const recommendList = ["家常菜", "烘焙", "快手菜", "肉类", "蔬菜", "汤粥主食", "早餐", "午餐", "晚餐", "一人食", "便当", "小吃", "甜品", "零食", "懒人食谱", "下酒菜", "宵夜", "其他"];

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
  
class CreateRecipes extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            files: [],
            recipeTips: '',
            modal: [false, false, false, false],
            selected: ['请选择工艺', '请选择口味', '请选择时间', '请选择难度'],
            materialsList: [{
                ingredients: '',
                quantities: ''
            }],
            recommendSelected: [],
            stepImgs: stepImgs,
            cookStepsList: [{
                img: [],
                step: ''
            }]
         };
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleAddMoreClick = this.handleAddMoreClick.bind(this);
        this.handleAddStepClick = this.handleAddStepClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onStepImgChange = this.onStepImgChange.bind(this);
        this.onWrapTouchStart = this.onWrapTouchStart.bind(this);
        
    }

    render() { 
        const { getFieldProps } = this.props.form;
        return ( 
            <CreateRecipesWrapper>
                <Header header={header} leftClick={this.handleBackClick} rightClick={this.handleSaveClick}></Header>
                <Tip style={{visibility: this.state.files.length < 1 ? 'true' : 'hidden'}}>添加菜谱封面或菜谱视频</Tip>
                <NoBorder>
                    <ImagePicker
                        files={this.state.files}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={this.state.files.length < 1}
                        length="1"
                        />
                </NoBorder>
                <form style={{marginBottom: '3rem'}}>
                    <List>
                        <InputItem
                            {...getFieldProps('recipeName')}
                            style={recipeTitle}
                            placeholder="写下你的菜谱名吧"
                        />
                        <TextareaItem
                            {...getFieldProps('recipeStory')}
                            rows={5}
                            count={255}
                            placeholder="输入这道美食背后的故事"
                        />
                        {
                            tagList.map((item, index) => {
                                return (
                                    <div key={index}>
                                    <List.Item 
                                        arrow="horizontal" 
                                        {...getFieldProps(`selected${item.id}`, {
                                            initialValue: this.state.selected[index]
                                        })} 
                                        onClick={
                                            () => {
                                                console.log('index', index)
                                                let newModal = this.state.modal;
                                                newModal[index] = true;
                                                this.setState({
                                                    modal: newModal
                                                });
                                            }
                                        }
                                        extra={this.state.selected[index]}
                                    >{item.name}</List.Item>
                                    <Modal
                                        visible={this.state.modal[index]}
                                        transparent
                                        onClose={
                                            () => {
                                                console.log('index111', index)
                                                let newModal = this.state.modal;
                                                newModal[index] = false;
                                                this.setState({
                                                    modal: newModal
                                                });
                                            }
                                        }
                                        title={item.name}
                                        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                                    >
                                        <TagContainer>
                                            {
                                                item.tag.map((val, i) => {
                                                    return <Tag key={i} 
                                                    selected={this.state.selected[index] === val}
                                                    onChange={selected => {
                                                        if (selected) {
                                                            let newSelected = this.state.selected;
                                                            let newModal = this.state.modal;
                                                            newSelected[index] = val
                                                            newModal[index] = false;
                                                            this.setState({
                                                                selected: newSelected,
                                                                modal: newModal
                                                            })
                                                        }
                                                    }}>{val}</Tag>
                                                })
                                            }
                                        </TagContainer>
                                    </Modal>
                                    </div>
                                )
                            })
                        }
                        <List.Item 
                            {...getFieldProps('materials', {
                                initialValue: this.state.materialsList
                            })}
                        >用料</List.Item>
                        {
                            this.state.materialsList.map((item, index)=>{
                                return (
                                    <MaterialsWrapper key={index}>
                                        <InputItem
                                            placeholder="食材：如鸡蛋"
                                            style={{borderRight: '1px solid #ccc'}}
                                            value={item.ingredients}
                                            onChange={(value) => {
                                                let newMaterialsList = this.state.materialsList
                                                newMaterialsList[index].ingredients = value
                                                this.setState({
                                                    materialsList: newMaterialsList
                                                })
                                            }}
                                        />
                                        <InputItem
                                            placeholder="用量：如1只"
                                            value={item.quantities}
                                            onChange={(value) => {
                                                let newMaterialsList = this.state.materialsList
                                                newMaterialsList[index].quantities = value
                                                this.setState({
                                                    materialsList: newMaterialsList
                                                })
                                            }}
                                        />
                                        <IconWrapper>
                                            <Icon type="cross" onClick={() => {
                                                let newMaterialsList = this.state.materialsList
                                                if (newMaterialsList.length === 1) {
                                                    Toast.info('用料不能少于一项！', 1)
                                                } else {
                                                    newMaterialsList.splice(index, 1)
                                                    this.setState({
                                                        materialsList: newMaterialsList
                                                    })
                                                }
                                            }}/>
                                        </IconWrapper>
                                    </MaterialsWrapper>
                                )
                            })
                        }
                        <AddMore onClick={this.handleAddMoreClick}>再添加一种食材</AddMore>
                        <List.Item
                            {...getFieldProps('cookSteps', {
                                initialValue: this.state.cookStepsList
                            })}
                        >烹饪步骤</List.Item>
                        {
                            this.state.cookStepsList.map((item, index)=>{
                                return (
                                    <CookStepsWrapper key={index}>
                                        <div>第 {index + 1} 步
                                            <IconWrapper>
                                                <Icon type="cross" className='icon' 
                                                    onClick={() => {
                                                    let newCookStepsList = this.state.cookStepsList
                                                    if (newCookStepsList.length === 2) {
                                                        Toast.info('烹饪步骤不能少于两步！', 1)
                                                    } else {
                                                        newCookStepsList.splice(index, 1)
                                                        this.setState({
                                                            cookStepsList: newCookStepsList
                                                        })
                                                    }
                                                }}/>
                                            </IconWrapper>
                                        </div>
                                        <ImagePicker
                                            key={index}
                                            files={item.img}
                                            onChange={(files, type) => {
                                                console.log(files, type, index);
                                                let newCookStepsList = this.state.cookStepsList
                                                newCookStepsList[index].img = files
                                                this.setState({
                                                    cookStepsList: newCookStepsList
                                                })
                                            }}
                                            onImageClick={(index, fs) => console.log(index, fs)}
                                            selectable={item.img.length < 1}
                                            length="1"
                                        />
                                        <TextareaItem
                                            rows={3}
                                            count={180}
                                            placeholder="请填写步骤描述，烹饪步骤不能少于两步"
                                            value={item.step}
                                            onChange={(value) => {
                                                let newCookStepsList = this.state.cookStepsList
                                                newCookStepsList[index].step = value
                                                this.setState({
                                                    cookStepsList: newCookStepsList
                                                })
                                            }}
                                        />
                                    </CookStepsWrapper>
                                )
                            })
                        }
                        <AddMore onClick={this.handleAddStepClick}>再添加一步</AddMore>
                        <List.Item
                            {...getFieldProps('recipeTips', {
                                initialValue: this.state.recipeTips
                            })}
                        >小贴士</List.Item>
                        <TextareaItem
                            rows={5}
                            count={255}
                            placeholder="分享下你做这道菜的过程中的心得和小技巧吧"
                            onChange={(value) => {
                                this.setState({
                                    recipeTips: value
                                })
                            }}
                        />
                        <List.Item
                            {...getFieldProps('recommend', {
                                initialValue: this.state.recommendSelected,
                              })}
                        >推荐至分类
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
                    </List>
                </form>
                <ButtonWrapper>
                    <Button className='button' onClick={this.onReset}>重置</Button>
                    <Button type="primary" className='button' onClick={this.onSubmit}>发布</Button>
                </ButtonWrapper>
            </CreateRecipesWrapper>
         );
    }

    onWrapTouchStart = (e) => {
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    onSubmit = () => {
        let createRecipesList = this.props.form.getFieldsValue();
        createRecipesList.selected = [createRecipesList.selected1, createRecipesList.selected2, createRecipesList.selected3, createRecipesList.selected4];
        delete createRecipesList.selected1;
        delete createRecipesList.selected2;
        delete createRecipesList.selected3;
        delete createRecipesList.selected4;
        
        if (this.state.files.length === 0) {
            Toast.info('菜谱封面不能为空', 1)
            return false
        } else {
            createRecipesList.album = this.state.files;
        }
        if (!createRecipesList.recipeName) {
            Toast.info('菜谱标题不能为空', 1)
            return false
        }
        let materialsHasEmpty = createRecipesList.materials.some(item => {
            if (!item.ingredients || !item.quantities) {
                return true
            }
        });
        if (materialsHasEmpty) {
            Toast.info('用料中不能有空', 1)
            return false
        }
        let stepsHasEmpty = createRecipesList.cookSteps.some(item => {
            if (item.img.length === 0 || !item.step) {
                return true
            }
        });
        if (stepsHasEmpty) {
            Toast.info('烹饪步骤中不能有空', 1)
            return false
        }
        if (createRecipesList.cookSteps.length < 2) {
            Toast.info('烹饪步骤不能少于两步', 1)
            return false
        }
        if (createRecipesList.recommend.length === 0) {
            Toast.info('请选择分类', 1)
            return false
        }
        console.log('createRecipesList', createRecipesList);
    }

    onReset = () => {
        this.props.form.resetFields();
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
                this.handleSaveClick()
            } },
          ]);
          setTimeout(() => {
            console.log('auto close');
            alertInstance.close();
          }, 500000);
    }

    handleSaveClick() {
        console.log('保存草稿，并跳转到上一页');
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

    onStepImgChange = (files, type, index) => {
        console.log(files, type, index);

        let newCookStepsList = this.state.cookStepsList
        newCookStepsList[index].img = files
        this.setState({
            cookStepsList: newCookStepsList
        })

        // this.setState({
        //     stepImgs: files
        // });
    }

    handleAddMoreClick() {
        var add = {
            ingredients: '',
            quantities: ''
        }
        let newMaterialsList = [...this.state.materialsList, add]
        this.setState({
            materialsList: newMaterialsList
        })
    }
    
    handleAddStepClick() {
        console.log('addmore')
        var add = {
            img: [],
            step: ''
        }
        let newCookStepsList = [...this.state.cookStepsList, add]
        this.setState({
            cookStepsList: newCookStepsList
        })
    }
}

const RecipesWrapper = createForm()(CreateRecipes);
 
export default RecipesWrapper;