import React, { Component } from 'react';
import { getDynamicDetail, addLikeDynamic } from '@/api/dynamicApi';
import { getUserInfo, addConcernUser } from '@/api/userApi';
import formatDate from '@/utils/formatDate';
import { Toast, Button, InputItem, Carousel } from 'antd-mobile';
import Header from '@/components/header';
import { RecipesDetailWrapper, Border } from '../recommendPage/style';
import { connect } from 'react-redux';
import { actionCreators as centerActionCreators } from '@/views/center/store';

const UNLIKE = '&#xe63a;';
const LIKE = '&#xe60c;';

class DynamicDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
          dynamicDetail: {},
          writer: {},
          imgHeight: 176,
        }
        this.handleLikeClick = this.handleLikeClick.bind(this);
        this.handleConcernClick = this.handleConcernClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
    }

    render() {
        let {dynamicDetail, writer} = this.state;
        const header = {
            left: "<span class='iconfont back'>&#xe61f;</span>",
            title: dynamicDetail.dynamicName,
            right: ''
        };
        return (
          <RecipesDetailWrapper>
              <div className='recipesDetailContent'>
                <Header header={header} leftClick={this.handleBackClick} ></Header>
                <Carousel
                    style={{touchAction: 'none'}}
                    autoplay
                    infinite
                    frameOverflow="visible"
                >
                    {dynamicDetail.imgs && dynamicDetail.imgs.map((val, index) => (
                        <img
                            src={require('@/' + val.url)}
                            alt=""
                            style={{ width: '100%', verticalAlign: 'top' }}
                            onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                                this.setState({ imgHeight: 'auto' });
                            }}
                            key={index}
                        />
                    ))}
                </Carousel>
                {/* <img className='album' src={dynamicDetail.imgs ? require('@/' + dynamicDetail.imgs[0].url) : require('@/statics/img/title.png')} alt=""/> */}
                <p className='recipeName'>{dynamicDetail.dynamicName}</p>
                <p className='createDate'>
                    {formatDate(dynamicDetail.createDate)}
                    {dynamicDetail.likeNumber ? ` · ${dynamicDetail.likeNumber} 点赞` : ''}
                </p>
                <div className='writer'>
                    <img className='avatar' src={writer.img ? writer.img[0].url : require('@/statics/img/title.png')} alt=""/>
                    <div className='writerName'>
                        <p>{writer.name}</p>
                        <p>{writer.profile}</p>
                    </div>
                    <Button 
                        type='primary' 
                        className='concern' 
                        size='small' 
                        onClick={this.handleConcernClick}
                    >{writer.concern ? '已关注' : '关注'}</Button>
                </div>
                <p className='story'>{dynamicDetail.dynamicStory}</p>
                <div className='cookSteps'>
                    <p className='subject'>评论</p>
                </div>
                <Border/>
            </div>
            <div className='fixedFooter'>
              <div className='fixedIcon' style={{flex: '2'}}>
                <InputItem
                  // {...getFieldProps('input3')}
                  placeholder="写评论..."
                />
              </div>
                <div 
                    className='fixedIcon' 
                    onClick={() => this.handleLikeClick(dynamicDetail._id, dynamicDetail.like)}
                    style={{
                        color: dynamicDetail.like === UNLIKE ? '#000000' : '#FB6650'
                    }}
                >
                    <span 
                        className='iconfont'
                        dangerouslySetInnerHTML={{__html: dynamicDetail.like}} 
                        style={{
                            color: dynamicDetail.like === UNLIKE ? '#000000' : '#FB6650'
                        }}
                    />{dynamicDetail.likeNumber === 0 ? '赞' : dynamicDetail.likeNumber}
                </div>
                <div className='fixedIcon'><span className='iconfont'>&#xe648;</span>评论</div>
            </div>
          </RecipesDetailWrapper>
        )
    }

    handleBackClick() {
        this.props.history.push({
            pathname: '/tab/home/find',
            homeTab: 2
        })
    }

    handleConcernClick() {
        var writer = this.state.writer;
        var user = this.props.userList;
        if (writer.concern) {
            writer.fanList.forEach((item, i) => {
                if (item === user._id) {
                    writer.fanList.splice(i, 1);
                    i--;
                    return;
                }
            })
            user.concernList.forEach((item, i) => {
                if (item === writer._id) {
                    user.concernList.splice(i, 1);
                    i--;
                    return;
                }
            })
        } else {
            writer.fanList.push(user._id);
            if (user.concernList) {
                user.concernList.push(writer._id);
            } else {
                user.concernList = [writer._id];
            }
        }

        addConcernUser({
            writerId: writer._id, 
            userId: user._id,
            concernList: user.concernList,
            fanList: writer.fanList
        }).then(res => {
            if (res.data.code === 200) {
                this.props.saveUserList(user);
                writer.concern = !writer.concern
                this.setState({
                    writer: writer
                })
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    handleLikeClick(dynamicId, like) {
        console.log('userList', this.props.userList);

        var user = this.props.userList;
        var newLikeNumber = this.state.dynamicDetail.likeNumber;

        if (like === UNLIKE) {
            newLikeNumber++;
            if (user.likeDynamic) {
                user.likeDynamic.push(dynamicId);
            } else {
                user.likeDynamic = [dynamicId];
            }
        } else {
            newLikeNumber--;
            user.likeDynamic.forEach((item, i) => {
                if (item === dynamicId) {
                    user.likeDynamic.splice(i, 1);
                    i--;
                }
            })
        }
        this.props.saveUserList(user);
        addLikeDynamic({
            userId: user._id,
            dynamicId: dynamicId,
            likeDynamic: user.likeDynamic,
            likeNumber: newLikeNumber
        }).then(() => {
            var newDynamicDetail = this.state.dynamicDetail;
            newDynamicDetail.likeNumber = newLikeNumber;
            newDynamicDetail.like = like === UNLIKE ? LIKE : UNLIKE;
            this.setState({
              dynamicDetail: newDynamicDetail
            })
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getDynamicDetail() {
      getDynamicDetail({
            id: this.props.match.params.id
        }).then(res => {
            if (res.data.code === 200) {
                let dynamicDetail = res.data.data;

                if (!dynamicDetail.likeNumber) {
                  dynamicDetail.likeNumber = 0;
                }
                if (this.props.userList.likeDynamic instanceof Array) {
                    if (this.props.userList.likeDynamic.length !== 0) {
                        this.props.userList.likeDynamic.forEach(val => {
                            if (val === dynamicDetail._id) {
                              dynamicDetail.like = LIKE
                            } else {
                              dynamicDetail.like = UNLIKE
                            }
                        })
                    } else {
                      dynamicDetail.like = UNLIKE
                    }
                } else {
                  dynamicDetail.like = UNLIKE
                }

                this.setState({
                  dynamicDetail: dynamicDetail
                })
                this.getUserInfo(dynamicDetail.userId);
            }
        }).catch((err) => {
            console.log('error：', err);
        })
    }

    getUserInfo(userId) {
        getUserInfo({userId: userId}).then(res => {
            let writer = res.data.data[0];

            var user = this.props.userList;
            if (writer.fanList instanceof Array) {
                if (writer.fanList.length !== 0) {
                    writer.fanList.forEach(item => {
                        if (item === user._id) {
                            writer.concern = true;
                        } else {
                            writer.concern = false;
                        }
                    })
                } else {
                    writer.concern = false;
                }
            } else {
                writer.concern = false;
                writer.fanList = [];
            }
            this.setState({
              writer: writer
            })
            console.log('writer', writer);
        }).catch(function (err) {
            Toast.fail('未知错误', 1);
        })
    }

    componentDidMount() {
      this.getDynamicDetail();
    }
}
 
const mapStateToProps = (state) => {
  return {
      userList: state.getIn(['center', 'userList'])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      saveUserList(information) {
          dispatch(centerActionCreators.saveUserList(information));
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DynamicDetail);