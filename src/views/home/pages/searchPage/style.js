

import styled from 'styled-components';
import { hintColor, themeColor, descColor } from '@/styles/color';
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

export const IconFont = styled.i`{
    font-size: 1.4rem !important;
    margin-top: 0.65rem;
}`;

export const SearchRecordWrapper = styled.div`{
    margin: 1rem;
    p {
        font-weight: bold;
        display: inline-block;
    }
    span {
        float: right;
        color: ${themeColor}
    }
    .tagSearch {
        padding: 1rem .5rem;
    }
    .am-tag-active {
        margin: .25rem;
    }
    .am-tag-normal {
        margin: .25rem;
        color: #000;
    }
}`;


export const SearchRecipesListWrapper = styled.div`{
    margin: 1rem;
    .recipesListContent {
        display: flex;
        margin-top: 1rem;
        height: 7rem;
        .album {
            width: 40%;
        }
        .avatar {
            display: inline-block;
            margin-right: 0.25rem;
            border-radius: 50%;
            width: 1.5rem;
            height: 1.5rem;
        }
        .center {
            display: flex;
            flex-direction: column;
            text-align: center;
            margin: .25rem;
            box-sizing: border-box;
            .recipeName {
                flex: 1;
                font-weight: bold;
                padding: .75rem; 
            }
            .desc {
                font-size: .75rem;
                flex: 1;
                padding-left: 1rem;
            }
            .writer {
                flex: 1;
                display: flex;
                padding: .5rem;
                align-items: center;
                justify-content: center;
                font-size: .75rem;
                color: ${descColor};
                img {
                    margin: 0 .5rem;
                }
            }
        }
        .right {
            flex: 1;
            text-align: right;
            line-height: 6rem;
        }
    }
}`;

export const BlankWrapper = styled.div`{
    margin-top: 30%;
    font-weight: normal;
    text-align: center;
    p {
        padding: 1rem;
    }
    .create {
        color: ${themeColor}
    }
}`;