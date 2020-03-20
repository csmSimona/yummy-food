import React, { Component } from 'react';
import { TitleWrapper } from '../../style';
import { Carousel } from 'antd-mobile';

class Recommend extends Component {
    
      componentDidMount() {
        // simulate img loading
        setTimeout(() => {
          this.setState({
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
          });
        }, 100);
      }

    constructor(props) {
        super(props);
        this.state = {
            data: ['1', '2', '3'],
            imgHeight: 176,
          }
        this.onMenuClick = this.onMenuClick.bind(this);
    }
    render() { 
        return ( 
            <div>
                <Carousel
                    style={{marginBottom: '1rem'}}
                    autoplay
                    infinite
                    frameOverflow="visible"
                    slideWidth={0.8}
                    cellSpacing={10}
                    // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    // afterChange={index => console.log('slide to', index)}
                    >
                    {this.state.data.map(val => (
                        <a
                            key={val}
                            href="http://www.baidu.com"
                            style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
                        >
                        <img
                            src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                        />
                        </a>
                    ))}
                </Carousel>
                <TitleWrapper>
                    <span>为你推荐</span>
                    <span className='right' onClick={this.onMenuClick}>菜谱分类</span>
                </TitleWrapper>
            </div>
         );
    }
    onMenuClick() {
        this.props.history.replace('/menuClass')
    }
}
 
export default Recommend;