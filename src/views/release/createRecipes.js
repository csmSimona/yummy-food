import React, { Component } from 'react';
import Header from '../../components/header';
import { Modal, List, InputItem, Button, ImagePicker, TextareaItem, Tag, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { CreateRecipesWrapper, ButtonWrapper, recipeTitle, Tip, TagContainer, MaterialsWrapper, AddMore } from './style';
import { Input } from 'antd';
import 'antd/dist/antd.css';

const alert = Modal.alert;
const header = {
    left: '取消',
    title: '创建菜谱',
    right: '存草稿'
}
const data = [];
const tagList1 = ["煮", "炒", "蒸", "烧", "拌", "炖", "炸", "煎", "烤", "烘焙", "其他"];
const tagList2 = ["咸鲜味", "家常味", "甜味", "香辣味", "酸甜味", "麻辣味", "苦香味", "五香味", "酱香味", "咖喱味", "其他"];
const tagList3 = ["<5分钟", "<10分钟", "<15分钟", "<20分钟", "<25分钟", "<30分钟", "<60分钟", "<90分钟", "<2小时", ">2小时"];
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
            files: data,
            modal1: false,
            modal2: false,
            modal3: false,
            selected1: '请选择工艺',
            selected2: '请选择口味',
            selected3: '请选择时间',
            materialsList: [{
                ingredients: '',
                quantities: '',
                order: 0
            }],
            recommendSelected: []
         };
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleAddMoreClick = this.handleAddMoreClick.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.IngredientsChange = this.IngredientsChange.bind(this);
        this.QuantitiesChange = this.QuantitiesChange.bind(this);
    }

    render() { 
        const { getFieldProps } = this.props.form;
        return ( 
            <CreateRecipesWrapper>
                <Header header={header} leftClick={this.handleBackClick} rightClick={this.handleSaveClick}></Header>
                <Tip style={{visibility: this.state.files.length < 1 ? 'true' : 'hidden'}}>添加菜谱封面或菜谱视频</Tip>
                <ImagePicker
                    files={this.state.files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={this.state.files.length < 1}
                    length="1"
                    />
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
                        <List.Item 
                            arrow="horizontal" 
                            {...getFieldProps('selected1', {
                                initialValue: this.state.selected1
                            })}
                            onClick={this.showModal('modal1')} 
                            extra={this.state.selected1}
                        >工艺</List.Item>
                        <Modal
                            visible={this.state.modal1}
                            transparent
                            onClose={this.onClose('modal1')}
                            title="工艺"
                            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                        >
                            <TagContainer>
                                {
                                    tagList1.map((item, index) => {
                                        return <Tag key={index} 
                                        selected={this.state.selected1 === item}
                                        onChange={selected => {
                                            if (selected) {
                                                this.setState({
                                                    selected1: item
                                                })
                                                this.onClose('modal1')();
                                            }
                                        }}>{item}</Tag>
                                    })
                                }
                            </TagContainer>
                        </Modal>
                        <List.Item 
                            arrow="horizontal" 
                            {...getFieldProps('selected2', {
                                initialValue: this.state.selected2
                            })}
                            onClick={this.showModal('modal2')} 
                            extra={this.state.selected2}
                        >口味</List.Item>
                        <Modal
                            visible={this.state.modal2}
                            transparent
                            onClose={this.onClose('modal2')}
                            title="口味"
                            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                        >
                            <TagContainer>
                                {
                                    tagList2.map((item, index) => {
                                        return <Tag key={index} 
                                        selected={this.state.selected2 === item}
                                        onChange={selected => {
                                            if (selected) {
                                                this.setState({
                                                    selected2: item
                                                })
                                                this.onClose('modal2')();
                                            }
                                        }}>{item}</Tag>
                                    })
                                }
                            </TagContainer>
                        </Modal>
                        <List.Item 
                            arrow="horizontal" 
                            {...getFieldProps('selected3', {
                                initialValue: this.state.selected3
                            })} 
                            onClick={this.showModal('modal3')} 
                            extra={this.state.selected3}
                        >时间</List.Item>
                        <Modal
                            visible={this.state.modal3}
                            transparent
                            onClose={this.onClose('modal3')}
                            title="时间"
                            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                        >
                            <TagContainer>
                                {
                                    tagList3.map((item, index) => {
                                        return <Tag key={index} 
                                        selected={this.state.selected3 === item}
                                        onChange={selected => {
                                            if (selected) {
                                                this.setState({
                                                    selected3: item
                                                })
                                                this.onClose('modal3')();
                                            }
                                        }}>{item}</Tag>
                                    })
                                }
                            </TagContainer>
                        </Modal>
                        <List.Item 
                            {...getFieldProps('materials', {
                                initialValue: this.state.materialsList
                            })}
                        >用料</List.Item>
                        {/* <Input.Group compact>
                            <Input style={{ width: '50%' }} defaultValue="input content" />
                            <Input style={{ width: '50%' }} />
                        </Input.Group> */}
                        {/* <InputItem.Group compact>
                            <Input style={{ width: '50%' }} defaultValue="input content" />
                            <Input style={{ width: '50%' }} />
                        </InputItem.Group> */}
                        
                        {
                            this.state.materialsList.map((item, index)=>{
                                return (
                                    <MaterialsWrapper key={index}>
                                        <InputItem
                                            placeholder="食材：如鸡蛋"
                                            className='materialsInput'
                                            style={{borderRight: '1px solid #ccc'}}
                                            // value={item.ingredients}
                                            onChange={this.IngredientsChange()}
                                        />
                                        <InputItem
                                            placeholder="用量：如1只"
                                            className='materialsInput'
                                            value={item.quantities}
                                            onChange={(event, index) => this.QuantitiesChange(event, index)}
                                        />
                                    </MaterialsWrapper>
                                )
                            })
                        }
                        <AddMore onClick={this.handleAddMoreClick}>再添加一种食材</AddMore>
                        <TextareaItem
                            {...getFieldProps('recipeTips')}
                            rows={5}
                            count={255}
                            placeholder="分享下你做这道菜的过程中的心得和小技巧吧"
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
                    </List>
                </form>
                <ButtonWrapper>
                    <Button className='button' onClick={this.onReset}>重置</Button>
                    <Button type="primary" className='button' onClick={this.onSubmit}>发布</Button>
                </ButtonWrapper>
            </CreateRecipesWrapper>
         );
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

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            console.log(this.props.form.getFieldsValue());
          } else {
            alert('Validation failed');
          }
        });
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
            files,
        });
    }

    handleAddMoreClick() {
        console.log('addMore')
        var add = {
            ingredients: '',
            quantities: ''
        }
        let newMaterialsList = [...this.state.materialsList, add]
        this.setState({
            materialsList: newMaterialsList
        })
    }

    IngredientsChange(index, value) {
        console.log('index', index);
        console.log('value', value);
        // console.log(index, event)
        // let newMaterialsList = this.state.materialsList
        // newMaterialsList[0].ingredients = value
        // this.setState({
        //     materialsList: newMaterialsList
        // }, console.log(this.state.materialsList))
    }
    QuantitiesChange(event, index) {
        console.log('index', index)
        // let newMaterialsList = this.state.materialsList
        // newMaterialsList[index].quantities = value
        // this.setState({
        //     materialsList: newMaterialsList
        // })
    }
}

const RecipesWrapper = createForm()(CreateRecipes);
 
export default RecipesWrapper;