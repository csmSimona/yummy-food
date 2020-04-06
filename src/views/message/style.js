import styled from 'styled-components';
import { descColor, themeColor, hintColor, bgColor } from '@/styles/color';

export const MessageWrapper = styled.div`{
    background-color: ${bgColor};
    height: ${props => props.height}px;
    .text {
        margin-bottom: .1rem; 
        padding: 1rem;
        background: #fff;
        display: flex;
        align-items: center;
        .title {
            margin-left: 1rem;
            font-size: 1.125rem;
            text-align: right;
        }
        .icon {
            transform: rotate(180deg);
            flex: 1;
        }
    }
    .blank {
        background: ${bgColor};
        padding: 1rem;
    }
}`;

export const IconFont = styled.div`{
    padding: .5rem;
    font-size: 1.5rem !important;
    color: #fff;
    border-radius: 50%;
    background: ${themeColor}
}`;