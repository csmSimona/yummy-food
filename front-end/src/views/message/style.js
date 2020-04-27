import styled from 'styled-components';
import { descColor, themeColor, hintColor, bgColor } from '@/styles/color';
import border from '@/styles/border';

export const Border = border({
    component: styled.div`{
    //   margin: 1rem 0;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  });

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
        .right {
            display: flex;
            flex: 1;
            align-items: center;
            flex-direction: row-reverse;
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

export const GoIcon = styled.div`{
    margin-left: .5rem;
    transform: rotate(180deg) !important;
}`;

export const CommentListWrapper = styled.div`{
    // margin: 0 1rem;
    .list {
        display: flex;
        margin: 1rem;
        overflow: hidden;
        align-items: center;
        .avatar {
            flex: 1;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
        }
        .album {
            flex: 4;
            width: 4rem;
        }
        .user {
            margin: .5rem 1rem;
            flex: 4;
            display: flex;
            flex-direction: column;
            .name {
                font-weight: bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 1rem;
            }
            .comment {
                flex: 1;
            }
            .time {
                margin-top: 1rem;
                font-size: .8rem;
                color: ${descColor};
            }
        }
        .desc {
            flex: 2;
            line-height: 1.5rem;
            margin: .5rem;
            color: ${descColor};
        }
    }
}`;

export const NewFanListWrapper = styled.div`{
    margin: 1rem;
    .am-button-active {
        background: ${themeColor};
    }
    .fanList {
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        .avatar {
            margin-right: 1rem;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
        }
        .desc {
            flex: 1;
        }
        .name {
            font-weight: bold;
        }
        .time {
            margin-top: 1rem;
            font-size: .8rem;
            color: ${descColor};
        }
    }
}`;