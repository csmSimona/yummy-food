import React, { Component } from 'react';
import { ImagePicker, Modal } from 'antd-mobile';
import CropperModal from '@/components/CropperModal/CropperModal';
import { uploadVideo } from '@/api/recipesApi';

import { Player, ControlBar, ReplayControl,
  ForwardControl, CurrentTimeDisplay,
  TimeDivider, PlaybackRateMenuButton, VolumeMenuButton } from 'video-react';
import "video-react/dist/video-react.css";


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

class Concern extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classModalVisible: false,
            classModalFile: null,
            classResultImgUrl: null,
            files: [],
            showBigModal: false,
            showBigUrl: '',
            videoUrl: ''
        }
        this.onChange = this.onChange.bind(this)
        this.handleGetResultImgUrl = this.handleGetResultImgUrl.bind(this)
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
        let file;

        if (files.length) {
            file = files[files.length - 1].file;
            var uploadType = files[0].url.split('/')[0];
        }
        console.log(files, type, index)
        
        if (type === 'add') {
          if (uploadType === 'data:video') {
            uploadVideo({
              video: files[0].url
            }).then(res => {
              this.setState({
                // files: [{url: res.data.videoUrl}],
                videoUrl: res.data.videoUrl
              })
              // res.data.videoUrl statics/video/1585055722129.mp4
              console.log('res.data.videoUrl', res.data.videoUrl);
            }).catch((err) => {
              console.log('error', err);
            })
          } else {
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

    render() {
        return (
          <div>
            <ImagePicker
                accept='*'
                files={this.state.files}
                onChange={this.onChange}
                onImageClick={(index, fs) => {
                    console.log(index, fs);
                    this.setState({
                        showBigModal: true,
                        showBigUrl: fs[index].url
                    })
                }}
                selectable={this.state.files.length < 3}
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
                <Player>
                  <source src={require('@/' + this.state.videoUrl)}/>
                </Player>
                {/* <video src={require('@/statics/video/1585055722129.mp4')} controls="controls">
                  您的浏览器不支持 video 标签。
                </video> */}
          </div>
        )
    }
}
 
export default Concern;