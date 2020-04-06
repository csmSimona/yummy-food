

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
        // display: flex;
        // flex-direction: row;
        .recipes {
            margin: 0 .5rem;
            display: inline-block;
        }
        p {
            margin: 1rem;
            font-weight: bold;
            font-size: .75rem;
            text-align: center;
        }
        img {
            height: 7rem;
            // width: 100%;
            // height: 100%;
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
    padding-bottom: 1rem;
    text-align: center;
    color: ${hintColor};
    font-size: .75rem;
}`;