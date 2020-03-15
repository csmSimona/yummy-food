import React, { Component } from 'react';
import Header from '../../components/header';
import { List, InputItem, ImagePicker, Button, Picker, DatePicker, TextareaItem } from 'antd-mobile';
import { district } from 'antd-mobile-demo-data';
import { createForm } from 'rc-form';
import './antdFix.css';
// import { textRight } from './style';

const Item = List.Item;

const header = {
    left: '下次再说',
    title: '编辑个人资料',
    right: '保存'
}

const data = [{
    url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
    id: '2121'
  }];

  const sex = [
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

class personInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: data,
            value: 1
        };
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.onChange = this.onChange.bind(this)
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

    validateAccount = (rule, value, callback) => {
        if (value && value.length > 4) {
          callback();
        } else {
          callback(new Error('At least four characters for account'));
        }
    }

    render() { 
        const { getFieldProps, getFieldError } = this.props.form;
        return ( 
            <div>
                <Header header={header} leftClick={this.handleLeftClick} rightClick={this.handleRightClick}></Header>
                <ImagePicker
                    files={this.state.files}
                    onChange={this.onChange}
                    onImageClick={(index, fs) => console.log(index, fs)}
                    selectable={this.state.files.length < 1}
                    />
                <form>
                    <List
                        renderFooter={() => getFieldError('account') && getFieldError('account').join(',')}
                    >
                        {/* <InputItem
                        {...getFieldProps('account', {
                            // initialValue: 'little ant',
                            rules: [
                            { required: true, message: 'Please input account' },
                            { validator: this.validateAccount },
                            ],
                        })}
                        clear
                        >Account</InputItem> */}
                        
                        <InputItem
                            {...getFieldProps('name')}
                            placeholder="请输入用户名"
                        >用户名</InputItem>
                        <InputItem
                            {...getFieldProps('phone')}
                            placeholder="请输入手机号"
                        >手机号</InputItem>
                        <Picker
                            data={sex}
                            title="性别"
                            {...getFieldProps('sex')}
                            cascade={false}
                            extra="请选择性别"
                            // value={this.state.sex}
                            // onChange={v => {
                            //     this.setState({ sex: v })
                            //     console.log(v)
                            // }}
                            onOk={v => console.log(v)}
                            >
                            <List.Item>性别</List.Item>
                        </Picker>
                        <DatePicker
                            mode="date"
                            title="出生日期"
                            {...getFieldProps('birthday')}
                            extra="请选择出生日期"
                            // value={this.state.date}
                            // onChange={date => {
                            //     this.setState({ date: date })
                            //     console.log(date)
                            // }}
                            onOk={v => console.log(v)}
                            maxDate={new Date()}
                            >
                            <List.Item>生日</List.Item>
                        </DatePicker>
                        <Picker extra="请选择家乡"
                            data={district}
                            title="家乡"
                            {...getFieldProps('hometown')}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('dismiss', e)}
                            >
                            <List.Item>家乡</List.Item>
                        </Picker>
                        <Picker extra="请选择现居地"
                            data={district}
                            title="现居地"
                            {...getFieldProps('livingPlace')}
                            onOk={e => console.log('ok', e)}
                            onDismiss={e => console.log('error', e)}
                            >
                            <List.Item>现居地</List.Item>
                        </Picker>
                        <InputItem
                            {...getFieldProps('avoidFood')}
                            placeholder="请输入忌口"
                        >忌口</InputItem>
                        <TextareaItem
                            {...getFieldProps('profile')}
                            rows={5}
                            count={100}
                            placeholder="添加个人简介，让厨友更了解你"
                        />
                        <Item>
                            <Button type="primary" size="small" inline onClick={this.onSubmit}>Submit</Button>
                            <Button size="small" inline style={{ marginLeft: '2.5px' }} onClick={this.onReset}>Reset</Button>
                        </Item>
                    </List>
                </form>
            </div>
        )
    }
    handleLeftClick() {
        this.props.history.push({
            pathname: '/',
            selectedTab: 'center'
        })
    }
    handleRightClick() {
        this.props.history.push({
            pathname: '/',
            selectedTab: 'center'
        })
    }
    onChange = (files, type, index) => {
        console.log(files, type, index);
        this.setState({
            files,
        });
    }
}
 
const personInfoWrapper = createForm()(personInfo);

export default personInfoWrapper;