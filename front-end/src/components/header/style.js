import styled from 'styled-components';
import { themeColor, hintColor } from '@/styles/color';
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
  
export const Header = styled.div`{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: #FFFFFF;
  overflow: hidden;
  height: 3.4rem;
  text-align: center;
  vertical-align：middle;
  .left {
    display: inline-block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    color: ${themeColor};
  }
  .title {
    margin-top: 1rem;
    display: inline-block;
    font-weight: bold;
    line-height: 1.25rem;
    font-size: 1.125rem;
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .right {
    display: inline-block;
    position: fixed;
    top: 1rem;
    right: 1rem;
    color: ${themeColor};
  }
}`;
