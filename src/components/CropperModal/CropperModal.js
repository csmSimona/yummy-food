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
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        this.props.onSubmit(blob); //把选中裁切好的的图片传出去
        this.props.onClose(); // 关闭弹窗
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