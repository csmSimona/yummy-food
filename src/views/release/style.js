import styled from 'styled-components';
import { themeColor, hintColor, textColor, descColor } from '@/styles/color';
import border from '@/styles/border';
import {Icon} from 'antd-mobile';

export const Border = border({
    component: styled.div`{
      // margin: 1rem 0;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  });
  
export const CreateRecipesWrapper = styled.div`{
  .am-modal-alert-content, .am-modal-propmt-content {
    font-size: 1.125rem;
    color: #000000;
  }

  .am-modal-button-group-h .am-modal-button {
      font-size: 1rem;
  }
  
}`

export const Slogan = styled.div`{
  text-align: center;
  position: absolute;
  top: 10rem;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.25rem;
}`

export const ReleaseMenu = styled.div`{
  display: flex;
  text-align: center;
  position: absolute;
  top: 15rem;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.25rem;
  .releaseButton {
    flex: 1;
    font-size: 1.125rem;
  }
}`

export const create = {
  marginBottom: '2rem',
  width: '8rem',
  height: '13rem'
}

export const ButtonWrapper = styled.div`{
  display: flex;
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  .am-button::before, .button {
    flex: 1;
    border-radius: 0 !important;
  }
  .am-button-active {
    background: ${themeColor};
  }
}`


export const recipeTitle = {
  textAlign: 'center',
  fontSize: '1.5rem'
}

export const Tip = styled.div`{
  height: 1.25rem;
  text-align: center;
  position: absolute;
  top: 10rem;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.25rem;
  z-index: 99;
  // color: ${hintColor};
  color: #989896;
}`

export const TagContainer = styled.div`{
  display: flex;
  padding: 9px;
  flex-direction: row;
  flex-wrap: wrap;
  & > div {
    height: 1.75rem;
    line-height: 1.75rem;
    margin: .45rem;
  }
  .am-tag-closable {
    color: ${themeColor};
    border: .5px solid ${themeColor} !important;
  }
  .am-tag-close {
    color: ${themeColor};
  }
  .am-tag-close .am-tag-normal::before {
    border: none !important;
  }
  .am-list-item {
    min-height: 2px;
  }
  .am-list-item.am-input-item {
    height: 1.75rem;
  }
  .am-list-item .am-input-control input {
    font-size: 14px;
  }
  .addMore {
    font-size: .875rem;
    border: .5px solid #ddd;
    border-radius: 3px;
    color: #888888;
    width: 3.5rem;
    height: 1.75rem;
    line-height: 1.75rem;
    margin: .45rem;
    text-align: center;
  }
  .tagInput {
    font-size: .875rem;
    border: .5px solid #ddd;
    border-radius: 3px;
    color: #888888;
    width: 7rem;
    margin: .45rem;
  }
}`;

export const MaterialsWrapper = styled.div`{
  display: flex;
  .am-list-item .am-list-line {
    padding-left: 0;
    padding-right: 0;
  }
}`

export const AddMore = styled.div`{
  margin: 1rem;
  color: ${themeColor};
  text-align: center;
}`

export const IconWrapper = styled.div`{
  margin: 0.4rem;
  color: ${hintColor};
  font-size: 2rem;
}`

export const CookStepsWrapper = styled.div`{
  position: relative;
  margin: 0 1rem;
  padding: 1rem 0.5rem;
  font-weight: bold;
  .icon {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: ${textColor};
  }
}`

export const NoBorder = styled.div`{
  .am-image-picker-list .am-image-picker-upload-btn {
    border: none !important;
    background-color: #EFEFED;
    color: #989896;
  }
}`

export const Desc = styled.div`{
  margin: 2rem;
  line-height: 1.5rem;
  p {
    color: ${descColor};
  }
}`;

export const DeleteDynamic = styled.div`{
  color: ${themeColor};
  font-size: 1.25rem;
  margin: 1rem;
  text-align: center;
}`;

export const VideoWrapper = styled.div`{
  position: relative;
}`;

export const DeleteIcon = styled(Icon)`{
    position: absolute;
    top: .5rem;
    right: .5rem;
    color: #fff;
    z-index: 99;
}`