import styled from 'styled-components';
import { themeColor, textColor } from '@/styles/color';

export const Iconfont = styled.i`
  font-size: 1.75rem !important;
  color: ${textColor};
`;

export const IconfontSelected = styled.i`
  font-size: 1.75rem !important;
  color: ${themeColor};
`;

export const TabBarWrapper = styled.div`
  .am-tabs-content-wrap {
    display: none !important;
  }
`;
