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
        margin: .5rem;
    }
}`;
