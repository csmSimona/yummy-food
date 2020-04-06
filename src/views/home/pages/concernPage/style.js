import styled from 'styled-components';
import { hintColor, descColor, bgColor } from '@/styles/color';
import border from '@/styles/border';
import { InputItem } from 'antd-mobile';

export const Border = border({
    component: styled.div`{
        // margin: 1rem;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  })

export const ConcernListWrapper = styled.div`{
    overflow: hidden;
    .writer {
        display: flex;
        padding: 1rem;
        align-item: center;
        line-height: 2rem;
        .avatar {
            margin-right: 1rem;
            border-radius: 50%;
            width: 2rem;
            height: 2rem;
        }
    }
    .concernContent {
        padding: 1rem;
        p {
            margin: 1rem 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        p:nth-child(1) {
            font-weight: bold;
            white-space: nowrap;
        }
        .concernDesc {
            .concernDate {
                float: left;
                color: ${descColor};
            }
            text-align: right;
        }
        .followRecipes {
            margin: 1rem 1rem 0 1rem;
            padding: .5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: ${bgColor};
        }
        .comment {
            margin: 1rem 0;
            display: flex;
            align-item: center;
            .avatar {
                border-radius: 50%;
                width: 2rem;
                height: 2rem;
            }
        }
    }
}`;

export const Icon = styled.i`{
    font-size: 1.25rem !important;
    margin-right: .5rem;
    color: #888888;
}`;

export const Input = styled(InputItem)`{
    flex: 1;
    margin-left: 1rem;
    height: 2rem !important;
    min-height: 1rem;
    background: #efeff4;
    border-radius: 4.5rem;
    color: #fff;
}`;