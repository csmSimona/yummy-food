import React, { Component } from 'react';
import Header from '@/components/header';
import { List, InputItem, ImagePicker, Picker, DatePicker, TextareaItem, Tag, Toast, Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { TagContainer, PersonInfoWrapper } from './style';
import { addUser, updateUserInfo, checkWechatUser} from '@/api/userApi';
import { connect } from 'react-redux';
import { actionCreators } from './store';
import { actionCreators as tabActionCreators} from '@/views/tabBar/store';
import CropperModal from '@/components/CropperModal/CropperModal';
import antdDistrict from '@/utils/antdDistrict';
import axios from 'axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 文件最大限制为5M
const AppID = 'wxf5fff2aa6e0b1af7';
const AppSecret = 'f396ab92d74c2ba72021d102aa67750b';

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}

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

const header1 = {
    left: '下次再说',
    title: '编辑个人资料',
    right: '保存'
}

const header2 = {
    left: "<span class='iconfont back'>&#xe61f;</span>",
    title: '编辑个人资料',
    right: '保存'
};

const gender = [
    {
        label: '未知',
        value: 0,
    },
    {
        label: '男',
        value: 1,
    },
    {
        label: '女',
        value: 2,
    }
];

const tagList = ["海鲜", "辛辣", "内脏", "肉类", "酸涩", "蛋类", "酒类", "生冷", "油腻", "腥膻", "香菜", "甜食", "味精", "烧烤", "腌制品"];

class personInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classModalVisible: false,
            classModalFile: null,
            classResultImgUrl: null,
            showBigModal: false,
            showBigUrl: '',
            files: [],
            tagSelected: true,
            selectedList: ['无'],
            userData: {},
            addTagList: [],
            inputVisible: false,
            inputValue: '',
            gender: ''
        };
        this.back = this.back.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleSelectedClick = this.handleSelectedClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleGetResultImgUrl = this.handleGetResultImgUrl.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.showInput = this.showInput.bind(this);
        this.handleInputConfirm = this.handleInputConfirm.bind(this);
    }

    render() { 
        const { getFieldProps, getFieldError } = this.props.form;
        let { userList } = this.props;
        let { addTagList, inputVisible, inputValue } = this.state;
        return ( 
            <PersonInfoWrapper>
                <Header header={userList ? header2 : header1} leftClick={userList ? this.back : this.handleSaveClick} rightClick={this.handleSaveClick}></Header>
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
                    title="查看头像"
                    footer={[{ text: '关闭', onPress: () => { this.onClose('showBigModal')(); } }]}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <img src={this.state.showBigUrl} alt="查看图片" width="100%" />
                </Modal>
                <form>
                    <List
                        renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
                    >
                        <InputItem
                            {...getFieldProps('name', {
                                initialValue: userList.name ? userList.name : this.props.location.phone ? '用户' + this.props.location.phone : this.state.userData.nickname,
                              })}
                            placeholder="请输入用户名"
                        >用户名</InputItem>
                        <InputItem
                            type="phone"
                            {...getFieldProps('phone', {
                                initialValue: this.props.location.phone,
                              })}
                            disabled={this.props.location.phone ? true : false}
                            placeholder="请输入手机号"
                        >手机号</InputItem>
                        <Picker
                            data={gender}
                            cols={1}
                            // value={this.state.gender}
                            {...getFieldProps('gender', {
                                initialValue: this.state.gender
                            })}
                            extra="请选择性别"
                            onChange={this.onChangeGender}
                            >
                            <List.Item>性别</List.Item>
                        </Picker>
                        {/* <Picker
                            data={colors}
                            value={this.state.colorValue}
                            cols={1}
                            onChange={this.onChangeColor}
                        >
                            <List.Item arrow="horizontal">Complex Labels</List.Item>
                        </Picker> */}
                        <DatePicker
                            mode="date"
                            title="出生日期"
                            {...getFieldProps('birthday', {
                                initialValue: userList.birthday ? new Date(userList.birthday) : ''
                              })}
                            extra="请选择出生日期"
                            minDate={new Date(1900, 1, 1, 0, 0, 0)}
                            maxDate={new Date()}
                            >
                            <List.Item>生日</List.Item>
                        </DatePicker>
                        <Picker extra="请选择家乡"
                            data={antdDistrict}
                            title="家乡"
                            {...getFieldProps('hometown', {
                                initialValue: userList.hometown ? userList.hometown : ''
                              })}
                            >
                            <List.Item>家乡</List.Item>
                        </Picker>
                        <Picker extra="请选择现居地"
                            data={antdDistrict}
                            title="现居地"
                            {...getFieldProps('livingPlace', {
                                initialValue: userList.livingPlace ? userList.livingPlace : '',
                              })}
                            >
                            <List.Item>现居地</List.Item>
                        </Picker>
                        <List.Item
                            {...getFieldProps('avoidFood', {
                                initialValue: this.state.selectedList
                              })}
                        >忌口
                            <TagContainer>
                                <Tag 
                                    selected={this.state.tagSelected}
                                    onChange={this.handleSelectedClick}
                                >无</Tag>
                                {
                                    tagList.map((item, index) => {
                                        return <Tag disabled={this.state.tagSelected} key={index}
                                        selected={
                                            this.state.selectedList.some((val, i) => {
                                                if(item === val){
                                                    return true
                                                } 
                                            })
                                        }
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
                                {
                                    addTagList && addTagList.map((val, i) => {
                                        return <Tag key={i}
                                            disabled={this.state.tagSelected} 
                                            className='close'
                                            selected
                                            closable={this.state.tagSelected ? false : true}
                                            onClose={() => {
                                                console.log(val, i);
                                                let { addTagList, selectedList } = this.state;
                                                let n = selectedList.indexOf(val)
                                                if (n !== -1) {
                                                    selectedList.splice(n, 1);
                                                }
                                                addTagList.splice(i, 1)

                                                this.setState({ 
                                                    selectedList,
                                                    addTagList
                                                })
                                                // console.log('addTagList', addTagList)
                                                // console.log('selectedList',  selectedList)
                                            }}
                                        >{val}</Tag>
                                    })
                                }
                                <span style={{display: this.state.tagSelected ? 'none' : 'block' }}>
                                    {inputVisible && (
                                        <InputItem
                                            ref={ref => this.input = ref}
                                            type="text"
                                            size="small"
                                            className="tagInput"
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                        />
                                    )}
                                    {!inputVisible && (
                                        <div className='addMore' onClick={this.showInput}>
                                            其他
                                        </div>
                                    )}
                                </span>
                            </TagContainer>
                        </List.Item>
                        <TextareaItem
                            {...getFieldProps('profile', {
                                initialValue: userList.profile ? userList.profile : '',
                              })}
                            rows={5}
                            count={100}
                            placeholder="添加个人简介，让厨友更了解你"
                        />
                    </List>
                </form>
            </PersonInfoWrapper>
        )
    }

    onChangeGender = (gender) => {
        console.log('gender', gender)
        this.setState({gender});
    };

    handleInputConfirm() {
        const { inputValue } = this.state;
        let { addTagList, selectedList } = this.state;
        if (inputValue && addTagList.indexOf(inputValue) === -1 && tagList.indexOf(inputValue) === -1) {
            addTagList = [...addTagList, inputValue];
        }
        if (inputValue && selectedList.indexOf(inputValue) === -1) {
            selectedList = [...selectedList, inputValue];
        }
        this.setState({
            addTagList,
            selectedList,
            inputVisible: false,
            inputValue: '',
        });
      };
  
    handleInputChange(value) {
        this.setState({ inputValue: value });
    };

    showInput() {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    back() {
        window.history.back(-1)
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
        information.img = this.state.files;
        information.gender = information.gender ? information.gender : [0];

        var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (information.phone) {
            information.phone = information.phone.replace(/\s*/g,"");
            if (phone.test(information.phone) === false) {
              Toast.info('请输入正确的手机号码', 1);
              return false;
            }
        }

        if (JSON.stringify(this.state.userData) !== '{}') {
            // information.access_token = this.state.userData.access_token
            information.openid = this.state.userData.openid
        }

        if (!information.name) {
            Toast.info('用户名不能为空', 1)
            return false
        }
        if (information.avoidFood[0] === '无') {
            information.avoidFood = ['无']
        }
        if (information.img.length === 0) {
            Toast.info('请上传头像', 1);
            return false;
        }
        console.log(information, this.props.userList);

        if (this.props.userList.size !== 0) {
            information._id = this.props.userList._id;
            if (information.img[0].url.substring(0, 4) !== 'data') {
                information.img[0].url = this.props.userList.img[0].url;
            }
            updateUserInfo(information).then(res => {
                if (res.data.code === 200) {
                    Toast.success('编辑成功！', 1);
                    this.props.history.replace('/tab/center/myRecipes');
                }
            }).catch((err) => {
                console.log('error', err);
            })
        } else {
            addUser(information).then(res => {
                console.log('addUser', res);
                if (res.data.code === 200) {
                    localStorage.setItem('token', res.data.token);
                    // localStorage.setItem('userPhone', res.data.data.phone);
                    localStorage.setItem('userId', res.data.data._id);
                    this.props.saveUserList(res.data.data);
                }
            Toast.success('注册成功！', 1);
                this.props.history.replace('/tab/home/recommend');
            }).catch((err) => {
                console.log('error', err);
            })
        }
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

    getWeChatInfo(code) {
        let user;
        axios.get('https://api.weixin.qq.com/sns/oauth2/access_token?appid='+AppID+'&secret='+AppSecret+'&code='+code+'&grant_type=authorization_code')
        .then((res) => {
            user = res.data;
            console.log(user)
            return checkWechatUser({openid: user.openid})
        }).then(res => {
            if (res.data.msg === 'find it') {
                localStorage.setItem('token', res.data.userList.token);
                localStorage.setItem('userId', res.data.userList._id);
                this.props.saveUserList(res.data.userList);
                this.props.saveSelectedTab('home');
                this.props.history.replace('/tab/home/recommend');
            } else {
                axios.get('https://api.weixin.qq.com/sns/userinfo?access_token='+ user.access_token +'&openid='+ user.openid +'&lang=zh_CN')
                .then(res => {
                    let userData = res.data;
                    this.setState({
                        userData: userData,
                        files: [{
                            url: userData.headimgurl
                        }]
                    })
                    console.log('userData', userData);
                })
            }
        }).catch(err => {
            console.log('err', err);
        });
    }

    componentDidMount() {
        let userList = this.props.userList;
        let code = getQueryString('code');
        if (code) {
            this.getWeChatInfo(code);
        }
        if (userList.size !== 0) {
            let tabSelected, url;
            let addTagList = []
            userList.avoidFood && (tabSelected = userList.avoidFood[0] === '无' ? true : false);
            userList.img && (url = userList.img[0].url.substring(0, 4) === 'http' ? userList.img[0].url : require('@/' + userList.img[0].url));
            userList.avoidFood.forEach(item => {
                if (tagList.indexOf(item) === -1) {
                    addTagList = [...addTagList, item];
                }
            })
            console.log('userList.gender', userList.gender);
            this.setState({
                files: [{url: url}],
                selectedList: userList.avoidFood,
                tagSelected: tabSelected,
                gender: userList.gender,
                addTagList
            })
        }
        document.body.addEventListener('keyup', (e) => {
            if (window.event) {
                e = window.event
            }
            let code = e.charCode || e.keyCode;
            if (code === 13) {
                this.handleInputConfirm();
            }		
        })
    }
}
 
const personInfoWrapper = createForm()(personInfo);

const mapStateToProps = (state) => {
    return {
        userList: state.getIn(['center', 'userList'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserList(information) {
            console.log(information);
            dispatch(actionCreators.saveUserList(information));
        },
        saveSelectedTab(selectedTab) {
            dispatch(tabActionCreators.saveSelectedTab(selectedTab));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(personInfoWrapper);