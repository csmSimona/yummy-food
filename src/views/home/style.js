import styled from 'styled-components';
import { themeColor, hintColor, textColor } from '@/styles/color';
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
    margin-top: 6rem;
    padding: 1rem;
    width: 100%;
}`;

export const TitleWrapper = styled.div`{
    position: relative;
    font-weight: bold;
    .classify {
        position: absolute;
        right: 0;
        color: #888;
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
    .title {
        margin: 0.5rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #000;
        font-weight: bold;
    }
    .otherInfo {
        display: flex;
        position: relative;
        padding-bottom: 0.5rem;
        color: #888;
        font-weight: normal; 
        font-size: 0.75rem;
        .userName {
            position: absolute;
            top: .125rem;
            width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .avatar {
        display: inline-block;
        margin-right: 0.25rem;
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
    }
    .user {
        flex: 2;
    }
    .collection {
        flex: 1;
        text-align: right;
    }
}`;


export const CollectionIcon = styled.i`{
    font-size: 1rem !important;
    margin-right: 0.25rem;
}`;
