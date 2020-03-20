import styled from 'styled-components';
import { themeColor, hintColor } from '../../styles/color';
import border from '../../styles/border';

export const Border = border({
    component: styled.div`{
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  })

export const HeaderFix = styled.div`{
    // position: fixed;
    // top: 0;
    // right: 0;
    // left: 0;
    display: flex;
    padding: 0.5rem;
    height: 3.75rem;
    
    .am-search {
        // border: #efeff4;
        background: #FFFFFF;
        width: 22rem;
        // display: inline-block;
    }
    .am-search-input {
        background: #efeff4
    }
}`;

export const IconFont = styled.i`{
    font-size: 1.75rem !important;
    margin: 0.5rem 0.5rem 0 0.5rem;
    color: #888;
}`;

export const HomeWrapper = styled.div`{
    .am-tabs-default-bar-top .am-tabs-default-bar-tab::after {
        background: #FFFFFF !important;
    }
    .am-tabs-default-bar-tab-active {
        font-weight: bold !important;
    }
}`;

export const PageWrapper = styled.div`{
    padding: 1rem;
    width: 100%;
}`;

export const TitleWrapper = styled.div`{
    position: relative;
    font-weight: bold;
    .right {
        position: absolute;
        right: 0;
        color: #888;
    }
}`;