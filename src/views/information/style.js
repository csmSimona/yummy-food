

import styled from 'styled-components';
import { hintColor, themeColor, bgColor, descColor } from '@/styles/color';
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
    align-item: center;
    justify-content: center;
    .am-search {
        background: #FFFFFF;
        width: 22rem;
        flex: 1;
    }
    .am-search-input {
        background: #efeff4
    }
    .searchButton {
        margin: .8rem .2rem;
        color: ${themeColor};
    }
}`;

export const TodayInformationWrapper = styled.div`{
    .title {
        margin: .5rem;
        display: flex;
        align-item: center;
        line-height: 1.75rem;
        p {
            margin-left: .5rem;
            font-weight: bold;
        }
    }
    .weather {
        margin: .5rem 1rem;
        span {
            display: inline-block;
            margin: .5rem .25rem;
        }
    }
    .recommend {
        margin-top: .5rem;
        overflow: hidden;
        overflow-x: auto;
        white-space: nowrap;
        .recipes {
            margin: 0 .5rem;
            display: inline-block;
        }
        p {
            margin: .5rem;
            font-weight: bold;
            font-size: .75rem;
            text-align: center;
        }
        img, video {
            height: 7rem;
            border-radius: .5rem;
        }
        .season {
            height: 10rem;
        }
    }
}`;

export const IconFont = styled.i`{
    font-size: 1.75rem !important;
    color: ${themeColor};
}`;

export const BlankWrapper = styled.div`{
    height: .75rem;
    background: ${bgColor};
}`;

export const More = styled.div`{
    padding: 1rem;
    text-align: center;
    color: ${hintColor};
    font-size: .75rem;
}`;

export const SituationDetailWrapper = styled.div`{
    margin: 1rem;
    p {
        line-height: 1.5rem;
        letter-spacing: .1rem;
        margin: 1rem 0;
        white-space: pre-wrap;
    }
    span {
        font-weight: bold;
    }
    .ingredient {
        height: 100%;
        padding: 1rem .5rem;
        .am-tag-active {
            margin: .25rem;
            font-size: 1rem;
        }
        .am-tag-normal {
            margin: .25rem;
            color: #000;
            font-size: 1rem;
        }
    }
}`;

export const RecipesListWrapper = styled.div`{
    display: flex;
    img {
        border-radius: .3125rem;
    }
    .left {
        width: 49%;
        margin: 1rem 1rem 1rem 0;
    }
    .right {
        width: 49%;
        margin: 1rem 0 1rem 0;
    }
    .contentBox {
        margin-bottom: 1rem;
    }
    .title {
        margin: 0.5rem 0;
        font-weight: bold;
        text-align: center;
    }
}`;

export const NoDataWrapper = styled.div`{
    margin-top: 50%;
    text-align: center;
    font-size: 1.25rem;
    line-height: 2rem;
}`;


export const BackIcon = styled.i`{
    font-size: 1.4rem !important;
    margin-top: 0.65rem;
}`;