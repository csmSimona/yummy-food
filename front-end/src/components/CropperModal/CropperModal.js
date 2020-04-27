import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper'; // 引入Cropper
import 'cropperjs/dist/cropper.css'; // 引入Cropper对应的css
import { Modal } from 'antd-mobile';

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

class CropperModal extends Component {
  static propTypes = {
    uploadedImageFile: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      src: null
    }
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

  componentDidMount() {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      const dataURL = e.target.result
      this.setState({ src: dataURL })
    }
    fileReader.readAsDataURL(this.props.uploadedImageFile);
  }

  handleSubmit = () => {
    if (!this.state.submitting) {
      // let url = `/homepage_images` // 你要上传的url
      // 拿到文件名
      // let filename = this.props.uploadedImageFile.name

      // console.log('正在上传图片')
      // TODO: 这里可以尝试修改上传图片的尺寸
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        // // 创造提交表单数据对象
        // const formData = new FormData()
        // // 添加要上传的文件
        // formData.append('file', blob, filename)
        // 提示开始上传 (因为demo没有后端server, 所以这里代码我注释掉了, 这里是上传到服务器并拿到返回数据的代码)
        // this.setState({submitting: true})
        // 上传图片
        // const resp = await http.post(url, formData)
        // 拿到服务器返回的数据(resp)
        // console.log(resp)
        // 提示上传完毕
        // this.setState({submitting: false})

        //把选中裁切好的的图片传出去
        this.props.onSubmit(blob);

        // 关闭弹窗
        this.props.onClose()
      })
    }
  }
 
  render() {
    return (
      <div>
        <Modal
            visible={this.props.classModalVisible}
            transparent
            maskClosable={false}
            onClose={this.handleSubmit}
            title="编辑图片"
            footer={[{ text: '确定', onPress: () => { this.handleSubmit() } }]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        >
          <Cropper
            src={this.state.src}
            ref={cropper => (this.cropper = cropper)}
            viewMode={1}
            zoomable={false}
            // aspectRatio={0.5} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
            guides={false}
            preview=".cropper-preview"
            style={{height: 200, width: '100%'}}
          />
        </Modal>
      </div>
    );
  }
}

export default CropperModal;