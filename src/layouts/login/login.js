import React, { Component } from "react";
import { getUser, addUser } from '../../utils/api';
import { Tabs, WhiteSpace, Badge, Button } from 'antd-mobile';

const tabs = [
  { title: <Badge text={'3'}>First Tab</Badge> },
  { title: <Badge text={'今日(20)'}>Second Tab</Badge> },
  { title: <Badge dot>Third Tab</Badge> },
];

const tabs2 = [
  { title: 'First Tab', sub: '1' },
  { title: 'Second Tab', sub: '2' },
  { title: 'Third Tab', sub: '3' },
];

const TabExample = () => (
  <div>
    <Tabs tabs={tabs}
      initialPage={1}
      onChange={(tab, index) => { console.log('onChange', index, tab); }}
      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        Content of first tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        Content of second tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        Content of third tab
      </div>
    </Tabs>
    <WhiteSpace />
    <Tabs tabs={tabs2}
      initialPage={1}
      tabBarPosition="bottom"
      renderTab={tab => <span>{tab.title}</span>}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        Content of first tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        Content of second tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
        Content of third tab
      </div>
    </Tabs>
    <WhiteSpace />
  </div>
);

// ReactDOM.render(<TabExample />, mountNode);

class login extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    // 增加数据
    // var user = {
    //   "name": "王五",
    //   "gender": "女",
    //   "age": 18,
    //   "hobbies": "跳舞"
    // }
    // addUser(user).then(res => {
    //   console.log('addUser', res);
    // }).catch((err) => {
    //   console.log('error', err);
    // })

    // 查询数据
    getUser().then(res => {
      return this.setState({ apiResponse: JSON.stringify(res.data) })
    }).catch((err) => {
      console.log('error', err);
    })
  }

  componentDidMount() {
    this.callAPI();
  }

  
  render() {
    return (
      <div>
        <div>I'M READY TO USE THE BACK END APIS! :-)</div>
        <p>{this.state.apiResponse}</p>
        <Button>按钮</Button>
        <TabExample />
      </div>
    );
  }
}

export default login;
