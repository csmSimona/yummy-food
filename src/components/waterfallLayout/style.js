import styled from 'styled-components';
import { themeColor, hintColor, descColor, textColor } from '@/styles/color';
import border from '@/styles/border';

export const Border = border({
    component: styled.div`{
        margin: 1rem 0;
    }`,
    color: `${hintColor}`,
    width: '0 0 1px 0',
    style: 'solid',
    radius: '0px'
  })

export const TitleWrapper = styled.div`{
    position: relative;
    font-weight: bold;
    .classify {
        position: absolute;
        right: 0;
        color: ${descColor};
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
        color: ${descColor};
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

export const RecipesDetailWrapper = styled.div`{
    overflow: hidden;
    .am-button::before, .button {
        flex: 1;
        border-radius: 0 !important;
    }
    .am-button-active {
        background: ${themeColor};
    }
    .recipesDetailContent {
        margin-bottom: 3.5rem;
    }
    .fixedFooter {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3.5rem;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 999;
        .fixedIcon {
            flex: 1;
            span {
                color: ${textColor};
                margin-right: .5rem;
                font-size: 1.5rem;
            }
        }
    }
    .album {
        width: 100%;
    }
    .recipeName {
        margin: 1rem;
        font-weight: bold;
        text-align: center;
        font-size: 1.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 2rem;
    }
    .createDate {
        margin: 1rem;
        text-align: center;
        color: ${descColor};
    }
    .writer {
        margin: 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .avatar {
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
        }
        .concern {
            width: 20%;
            margin-right: 2rem;
        }
        .writerName {
            margin: 0 1rem;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            p {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            p:nth-child(2) {
                margin-top: .5rem;
                color: ${descColor};
                font-size: .75rem;
            }
        }
    }
    .select {
        display: flex;
        padding-top: 1rem;
        align-items: center;
        justify-content: center;
        font-size: .75rem;
        .icon {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }
    .story {
        padding: 1rem 1rem 0 1rem;
        line-height: 1.25rem;
    }
    .materials {
        margin: 1rem;
        .materialItem {
            display: flex;
            line-height: 2rem;
            div {
                flex: 1;
            }
        }
    }
    .subject {
        padding: 1rem 0 .5rem;
        font-weight: bold;
        font-size: 1.25rem;
    }
    .cookSteps {
        margin: 1rem;
        .stepItem {
            margin-bottom: 1rem;
            img {
                width: 100%;
                border-radius: .25rem;
            }
            .stepNumber {
                font-weight: bold;
                font-size: 1.125rem;
                margin: .5rem 0;
            }
            .stepDesc {
                line-height: 2rem;
            }
        }
        .tips {
            line-height: 1.25rem;
        }
    }
}`;

export const SelectIcon = styled.i`{
    font-size: 1.5rem !important;
    margin-bottom: .5rem;
}`;