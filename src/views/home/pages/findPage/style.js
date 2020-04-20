import styled from 'styled-components';
import { hintColor, descColor, bgColor, themeColor } from '@/styles/color';
import border from '@/styles/border';

export const Border = border({
    component: styled.div`{
        // margin: 1rem;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
});

export const TagWrapper = styled.div`{
    display: flex;
    overflow: hidden;
    overflow-x: auto;
    white-space: nowrap;
    .tag {
        margin: 0 .5rem;
        padding: .5rem;
        text-align: center;
        font-size: .875rem;
        border: .5px solid #ddd;
        border-radius: 3px;
        // color: ${themeColor};
    }
}`;

export const JoinWrapper = styled.div`{
    display: inline-block;
    padding: .5rem;
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem;
    background: ${themeColor};
    color: #fff;
}`;