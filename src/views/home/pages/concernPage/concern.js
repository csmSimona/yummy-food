import React, { Component } from 'react';
// import { Player } from 'video-react';
import { Player, ControlBar, ReplayControl,
    ForwardControl, CurrentTimeDisplay,
    TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import "video-react/dist/video-react.css";

class Concern extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                这是关注页
                <Player>
                    <source src="https://www.acfun.cn/bangumi/aa6000902_36188_1708585?acfr=sem_pc"/>
                {/* <ControlBar>
                  <ReplayControl seconds={10} order={1.1} />
                  <ForwardControl seconds={30} order={1.2} />
                  <CurrentTimeDisplay order={4.1} />
                  <TimeDivider order={4.2} />
                  <PlaybackRateMenuButton
                    rates={[5, 2, 1, 0.5, 0.1]}
                    order={7.1}
                  />
                  <VolumeMenuButton disabled />
                </ControlBar> */}
              </Player>
            </div>
         );
    }
}
 
export default Concern;