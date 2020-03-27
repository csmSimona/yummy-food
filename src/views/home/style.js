import styled from 'styled-components';
import { hintColor, descColor } from '@/styles/color';
import border from '@/styles/border';

export const Border = border({
    component: styled.div`{
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  })

export const HeaderFix = styled.div`{
    display: flex;
    padding: 0.5rem;
    height: 3.75rem;
    background: #FFFFFF;
    .am-search {
        background: #FFFFFF;
        width: 22rem;
        flex: 1;
    }
    .am-search-input {
        background: #efeff4
    }
}`;

export const IconFont = styled.i`{
    font-size: 1.75rem !important;
    margin: 0.5rem 0.5rem 0 0.5rem;
    color: ${descColor};
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
    margin-top: 6rem;
    padding: 1rem;
    width: 100%;
}`;
