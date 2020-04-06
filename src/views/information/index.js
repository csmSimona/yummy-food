import React, { Component } from 'react';
import { SearchBar } from 'antd-mobile';
import { HeaderFix, TodayInformationWrapper, IconFont, Border, BlankWrapper, More } from './style';
import axios from 'axios';
import getJQ from '@/utils/getJQ';
// let situationList = require('@/utils/situation');
import { getSituationList } from '@/api/searchApi';

class Information extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            weatherList: {},
            situationList: []
         }
    }
    render() { 
        let { weatherList } = this.state;
        return ( 
            <div>
                <HeaderFix>
                    <SearchBar 
                        // ref={ref => this.searchInput = ref} 
                        placeholder="搜索 吃什么 场景"
                        // onCancel={() => {
                        //     this.props.history.replace('/tab/home/recommend')
                        // }}
                        cancelText=" "
                        // value={searchContent}
                        // onChange={(val) => {
                        //     this.setState({
                        //         searchContent: val
                        //     })
                        // }}
                    />
                    {/* <div className='searchButton' onClick={this.getSearchDetail(searchContent)}>搜索</div> */}
                    <div className='searchButton'>搜索</div>
                </HeaderFix>
                <Border/>
                <TodayInformationWrapper>
                    <div className='title'>
                        <IconFont className='iconfont'>&#xe72d;</IconFont>
                        <p>今天吃什么</p>
                    </div>
                    <div className='weather'>
                        <span>{weatherList.city}</span>
                        <span>{weatherList.date}</span>
                        <span>{weatherList.solarTerm}</span>
                        <span>{weatherList.min}~{weatherList.max}℃</span>
                        <span>{weatherList.desc}</span>
                        <span>{weatherList.brf}</span>
                    </div>
                    <div className='recommend'>
                        <div className='recipes'>
                            <img src={require('@/statics/images/recipes/15857106929620.png')}/>
                            <p>菜谱名称</p>
                        </div>
                        <div className='recipes'>
                            <img src={require('@/statics/images/recipes/15857106929620.png')}/>
                            <p>菜谱名称</p>
                        </div>
                        <div className='recipes'>
                            <img src={require('@/statics/images/recipes/15857106929620.png')}/>
                            <p>菜谱名称</p>
                        </div>
                    </div>
                </TodayInformationWrapper>
                {
                    this.state.situationList.map((item, index) => {
                        return (
                            <div key={index}>
                                <BlankWrapper/>
                                <TodayInformationWrapper>
                                    <div className='title'>
                                        <IconFont className='iconfont' dangerouslySetInnerHTML={{__html: item.icon}}/>
                                        <p>{item.type}</p>
                                    </div>
                                    <div className='recommend'>
                                        {
                                            item.list.map((val, i) => {
                                                return (
                                                    <div className='recipes' key={i}>
                                                        <img src={require('@/' + val.img)} className={item.type.length === 5 ? 'season' : ''}/>
                                                        <p>{val.name}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </TodayInformationWrapper>
                            </div>
                        )
                    })
                }
                <More> - 更多丰富场景尽情期待 - </More>
            </div>
        );
    }

    componentDidMount() {
        // let newSituationList = situationList.map(item => {
        //     item.list.map(val => {
        //         let url = require(val.img);
        //         val.img = url;
        //     })
        // })
        getSituationList().then(res => {
            console.log('res',res.data.data)
            
        this.setState({
            situationList: res.data.data
        })
        })
        // console.log('situation', newSituationList);

        var BMap = window.BMap; //取出window中的BMap对象
        var myCity = new BMap.LocalCity();
        let weatherList = {};
        let that = this;
        myCity.get(function (result) {
            if (result.name) {
                /*通过当前位置城市信息获取天气*/
                // axios.get('https://free-api.heweather.com/v5/weather?key=19713447578c4afe8c12a351d46ea922', {
                axios.get('https://free-api.heweather.net/s6/weather?', {
                    params: {
                        location: result.name,
                        key: 'f50fe752261144f8858b5e5b6a5cc561'
                    }
                }).then(function (res) {
                    let weatherInfo = res.data.HeWeather6[0];
                    let dateData = weatherInfo.daily_forecast[0].date.split('-');
                    let solarTerm = getJQ(dateData[0], +dateData[1], +dateData[2]);
                    weatherList = {
                        city: weatherInfo.basic.location,
                        min: weatherInfo.daily_forecast[0].tmp_min,
                        max: weatherInfo.daily_forecast[0].tmp_max,
                        desc: weatherInfo.daily_forecast[0].cond_txt_d,
                        brf: weatherInfo.lifestyle[1].brf,
                        date: `${+dateData[1]}月${+dateData[2]}日`,
                        solarTerm: solarTerm
                    }
                    that.setState({
                        weatherList: weatherList
                    })
                    // console.log(weatherInfo);
                });
            }
        });
    }
}
 
export default Information;