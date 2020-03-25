import styled from 'styled-components';
import { descColor } from '@/styles/color';

export const TagContainer = styled.div`{
    display: flex;
    padding-top: 9px;
    flex-direction: row;
    flex-wrap: wrap;
    & > div {
        height: 1.75rem;
        line-height: 1.75rem;
        margin: .45rem;
      }
}`;

export const PersonInfoWrapper = styled.div`{
  .am-image-picker-item-content, .am-image-picker-list .am-image-picker-upload-btn {
    border-radius: 50% !important;
  }

  .am-image-picker-list .am-image-picker-item {
      left: 150% !important;
      z-index: 99 !important;
  }

  .am-list-body {
      margin-top: 1.5rem !important;
  }

  input::-webkit-input-placeholder {
      color: ${descColor} !important;
      font-size: 16px !important;
      line-height: 1.5 !important;
  }

  .am-list-item .am-list-line .am-list-extra {
      text-align: left;
      flex: 1;
      color: #000000;
  }

  .am-list-item .am-input-label {
      flex: 1;
  }

}`;
