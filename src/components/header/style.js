import styled from 'styled-components';
import { themeColor, hintColor } from '../../styles/color';
import border from '../../styles/border';

export const Border = border({
    component: styled.div`{
      margin: 1rem 0;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  })
  
  export const Header = styled.div`{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background: #FFFFFF;
    height: 3.5rem;
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
      margin-top: 0.9rem;
      display: inline-block;
      font-weight: bold;
      font-size: 1.125rem;
    }
    .right {
      display: inline-block;
      position: fixed;
      top: 1rem;
      right: 1rem;
      color: ${themeColor};
    }
  }`