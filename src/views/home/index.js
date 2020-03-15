import React, { Component } from 'react';

import { Tabs } from 'antd-mobile';

const tabs = [
  { title: '关注' },
  { title: '推荐' },
  { title: '发现' },
];

const TabExample = () => (
  <div>
    <Tabs tabs={tabs}
      initialPage={1}
      onChange={(tab, index) => { console.log('onChange', index, tab); }}
      onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: 'red' }}>
        Content of first tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: 'yellow' }}>
        Content of second tab
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: 'blue' }}>
        Content of third tab
      </div>
    </Tabs>
  </div>
);

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            
        }
    }
    render() { 
        return ( 
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50px', backgroundColor: 'yellow' }}>这里要放一个搜索框</div>
            <TabExample />
        </div>
        );
    }
}
 
export default Home;