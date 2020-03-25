import React, { Component } from 'react';
import Header from '@/components/header';
import { List, InputItem, ImagePicker, Picker, DatePicker, TextareaItem, Tag, Toast, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { TagContainer, PersonInfoWrapper } from './style';
import { addUser} from '@/api/userApi';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import CropperModal from '@/components/CropperModal/CropperModal';

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

const header = {
    left: '下次再说',
    title: '编辑个人资料',
    right: '保存'
}

const gender = [
    [
      {
        label: '未知',
        value: '未知',
      },
      {
        label: '男',
        value: '男',
      },
      {
        label: '女',
        value: '女',
      }
    ],
];

const tagList = ["海鲜", "辛辣", "内脏", "肉类", "酸涩", "蛋类", "酒类", "生冷", "油腻", "腥膻", "香菜", "甜食", "味精", "烧烤", "腌制品", "其他"];

let antdDistrict =[];
let districtData = require('@/utils/location');
Object.keys(districtData).forEach((index)=>{
    let itemLevel1 ={};
    let itemLevel2 ={};
    itemLevel1.value = districtData[index].code;
    itemLevel1.label = districtData[index].name;
    itemLevel1.children = [];
    let data = districtData[index].cities;
    Object.keys(data).forEach((index)=>{
        itemLevel2.value = data[index].code;
        itemLevel2.label = data[index].name;
        itemLevel2.children = [];
        let data2 = data[index].districts;
        let itemLevel3 ={};
        itemLevel3.children = [];
        Object.keys(data2).forEach((index)=>{
            itemLevel3.value = index;
            itemLevel3.label = data2[index];
            itemLevel2.children.push(itemLevel3);
            itemLevel3 ={};
        });
        itemLevel1.children.push(itemLevel2);
        itemLevel2 ={};
    });
    antdDistrict.push(itemLevel1)
});

class personInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classModalVisible: false,
            classModalFile: null,
            classResultImgUrl: null,
            showBigModal: false,
            showBigUrl: '',
            files: [
                // {
                //     url: require('@/statics/img/avatar.jpeg'),
                //     id: '1'
                // }
            ],
            // value: 1,
            tagSelected: true,
            selectedList: ['无']
        };
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleSelectedClick = this.handleSelectedClick.bind(this);
        this.onChange = this.onChange.bind(this)
        this.handleGetResultImgUrl = this.handleGetResultImgUrl.bind(this)
    }

    render() { 
        const { getFieldProps, getFieldError } = this.props.form;

        return ( 
            <PersonInfoWrapper>
                <Header header={header} leftClick={this.handleSaveClick} rightClick={this.handleSaveClick}></Header>
                <ImagePicker
                    files={this.state.files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => {
                        console.log(index, fs);
                        this.setState({
                            showBigModal: true,
                            showBigUrl: fs[index].url
                        })
                    }}
                    selectable={this.state.files.length < 1}
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
                    <img src={this.state.showBigUrl} alt="查看图片" width="100%" height="100%" />
                </Modal>
                <form>
                    <List
                        renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
                    >
                        <InputItem
                            {...getFieldProps('name', {
                                initialValue: '用户' + this.props.location.phone,
                              })}
                            placeholder="请输入用户名"
                        >用户名</InputItem>
                        <InputItem
                            type="phone"
                            {...getFieldProps('phone', {
                                initialValue: this.props.location.phone,
                              })}
                            disabled
                            placeholder="请输入手机号"
                        >手机号</InputItem>
                        <Picker
                            data={gender}
                            title="性别"
                            {...getFieldProps('gender')}
                            cascade={false}
                            extra="请选择性别"
                            >
                            <List.Item>性别</List.Item>
                        </Picker>
                        <DatePicker
                            mode="date"
                            title="出生日期"
                            {...getFieldProps('birthday')}
                            extra="请选择出生日期"
                            minDate={new Date(1900, 1, 1, 0, 0, 0)}
                            maxDate={new Date()}
                            >
                            <List.Item>生日</List.Item>
                        </DatePicker>
                        <Picker extra="请选择家乡"
                            data={antdDistrict}
                            title="家乡"
                            {...getFieldProps('hometown')}
                            >
                            <List.Item>家乡</List.Item>
                        </Picker>
                        <Picker extra="请选择现居地"
                            data={antdDistrict}
                            title="现居地"
                            {...getFieldProps('livingPlace')}
                            >
                            <List.Item>现居地</List.Item>
                        </Picker>
                        <List.Item
                            {...getFieldProps('avoidFood', {
                                initialValue: this.state.selectedList,
                              })}
                        >忌口
                            <TagContainer>
                                <Tag selected
                                    onChange={this.handleSelectedClick}>无</Tag>
                                {
                                    tagList.map((item, index) => {
                                        return <Tag disabled={this.state.tagSelected} key={index}
                                        onChange={selected => {
                                            if (selected) {
                                                var newSelect = this.state.selectedList
                                                this.setState({ 
                                                    selectList: newSelect.push(item)
                                                })
                                                console.log('selectedList', newSelect);
                                            } else {
                                                var newSelect1 = this.state.selectedList
                                                newSelect1.forEach((val, i) => {
                                                    if(item === val){
                                                        this.setState({ 
                                                            selectList: newSelect1.splice(i, 1)
                                                        })
                                                        i--;
                                                    } 
                                                })
                                                console.log('selectedList', newSelect1);
                                            }
                                        }}>{item}</Tag>
                                    })
                                }
                            </TagContainer>
                        </List.Item>
                        <TextareaItem
                            {...getFieldProps('profile')}
                            rows={5}
                            count={100}
                            placeholder="添加个人简介，让厨友更了解你"
                        />
                    </List>
                </form>
            </PersonInfoWrapper>
        )
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

    handleSaveClick() {
        var information = this.props.form.getFieldsValue()
        information.img = this.state.files
        information.gender = information.gender ? information.gender[0] : '未知'
        // information.phone = information.phone.replace(/\s*/g,"")
        // var phone = /^[1][3,4,5,7,8][0-9]{9}$/

        if (!information.name) {
            Toast.info('用户名不能为空', 1)
            return false
        }
        // if (phone.test(information.phone) === false) {
        //     Toast.info('请输入正确的手机号码', 1);
        //     return false;
        // }
        if (information.avoidFood[0] === '无') {
            information.avoidFood = ['无']
        }
        if (information.img.length === 0) {
            Toast.info('请上传头像', 1);
            return false;
        }
        console.log(information);
        
        addUser(information).then(res => {
            console.log('addUser', res);
            if (res.data.code === 200) {
                localStorage.setItem('token', res.data.token);
                information.token = res.data.token;
                information.userId = res.data.userId;
                this.props.saveUserList(information);
            }
            this.props.history.push({
                pathname: '/tab/center',
                selectedTab: 'center'
            })
        }).catch((err) => {
          console.log('error', err);
        })
    }

    handleSelectedClick(selected) {
        if (selected) {
            var newSelect = this.state.selectedList
            this.setState({ 
                tagSelected: true,
                selectList: newSelect.unshift('无')
                })
            console.log('selectedList', newSelect);
        } else {
            var newSelect1 = this.state.selectedList
            this.setState({ 
                tagSelected: false,
                selectList: newSelect1.shift('无')
                })
            console.log('selectedList', newSelect1);
        }
    }

    componentDidMount() {
        console.log('this.props.location.phone', this.props.location.phone);
        if (this.props.location.phone === undefined) {
            this.props.history.replace('/tab/home/recommend');
        }
    }
}
 
const personInfoWrapper = createForm()(personInfo);

const mapStateToProps = (state) => {
    return {
        // files: state.getIn(['center', 'files']),
        // value: state.getIn(['center', 'value']),
        // tagSelected: state.getIn(['center', 'tagSelected']),
        // selectedList: state.getIn(['center', 'selectedList']),
        userList: state.getIn(['center', 'userList'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(information) {
            console.log(information);
            dispatch(actionCreators.saveUserList(information));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(personInfoWrapper);