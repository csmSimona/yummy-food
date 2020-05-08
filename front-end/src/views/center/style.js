import styled from 'styled-components';
import { descColor, themeColor, hintColor, bgColor } from '@/styles/color';
import border from '@/styles/border';

export const Border = border({
    component: styled.div`{
      margin: 1rem 0;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  });

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

export const CenterWrapper = styled.div`{
    .showBigImg {
        background: #000;
        z-index: 999;
        height: 800px;
    }
    .topHeader {
        margin: 1rem;
        overflow: hidden;
        .editWrapper {
            display: flex;
            // margin: 0 1rem;
            .avatar {
                width: 5rem;
                height: 5rem;
                border-radius: 50%;
                text-align: center;
            }
            .editContent {
                width: 100%;
                text-align: center;
                padding: 0 1rem 1rem 1rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .userName {
                    padding: .5rem;
                    font-size: 1.25rem;
                    font-weight: bold;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .editButton {
                    display: inline-block;
                    flex: 5;
                    padding: .5rem;
                    font-size: .75rem;
                    color: ${themeColor};
                    border-radius: 3rem;
                    border: 1px solid ${themeColor};
                }
            }
            .userName {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .userDesc {
            margin: 1rem;
            line-height: 1.75rem;
            .am-list-item {
                padding: 0;
                overflow: visible;
                color: #000;
                min-height: 1rem;
                height: 1.75rem;
            }
            .am-list-item .am-list-line .am-list-extra {
                padding: 0;
                overflow: visible;
                color: #000;
            }
            .place {
                display: flex;
                align-items: center;
            }
        }
        .userData {
            margin: 0 1rem;
            display: flex;
            .dataItem {
                flex: 1;
                text-align: center;
                font-size: .75rem;
                .dataNumber {
                    margin-bottom: .5rem;
                    font-weight: bold;
                }
            }
        }
    }
}`;


export const SettingIcon = styled.i`{
    font-size: 1.45rem !important;
    display: inline-block;
    flex: 1;
    padding-left: 1rem;
    color: ${descColor};
}`;

export const SettingWrapper = styled.div`{
    background-color: ${bgColor};
    height: ${props => props.height}px;
    .text {
        margin-bottom: .1rem; 
        padding: 1rem;
        background: #fff;
        font-weight: bold;
        vertical-align: middle;
    }
    .logout {
        margin: 1rem 0;
        padding: 1rem;
        background: #fff;
        color: ${themeColor};
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
    }
    .blank {
        background: ${bgColor};
        padding: 1rem;
    }
}`;

export const BlankWrapper = styled.div`{
    margin-top: 30%;
    font-weight: normal;
    text-align: center;
    p {
        padding: 1rem;
    }
    .create {
        color: ${themeColor}
    }
}`;

export const UserListWrapper = styled.div`{
    display: flex;
    align-items: center;
    margin: 1rem;
    .am-button-active {
        background: ${themeColor};
    }
    .avatar {
        margin-right: 1rem;
        border-radius: 50%;
        width: 3rem;
        height: 3rem;
    }
    .desc {
        flex: 1;
        font-weight: bold;
    }
    .button {
        width: 6rem;
    }
}`;

export const EditIcon = styled.i`{
    padding: .25rem;
    position: absolute;
    font-size: 1.25rem !important;
    top: .25rem;
    right: .25rem;
    color: #fff;
    background: #797574;
    border-radius: 50%;
    opacity: .7;
    border: 1px solid #fff;
    z-index: 99;
}`;

export const phoneLogin = {
    margin: '1rem 1.25rem',
    background: `${themeColor}`,
    color: '#FFFFFF'
}
