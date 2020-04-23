import styled from 'styled-components';
import { themeColor, hintColor, descColor, textColor, bgColor } from '@/styles/color';
import border from '@/styles/border';
import { InputItem } from 'antd-mobile';

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
    padding: 1rem;
    font-weight: bold;
    .classify {
        position: absolute;
        right: 1rem;
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
    .contentBox {
        margin-bottom: 1rem;
    }
    .title {
        margin: 0.5rem 0;
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
        .showBig {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: #000;
            z-index: 1000;
            img {
                position: absolute;
                top: 12.5rem;
            }
            /* 入场动画 */
            &.slide-enter,&.slide-appear{
                opacity: 0;
            }
            &.slide-enter-active,&.slide-appear-active{
                opacity: 1;
                transition: opacity 1s ease-in; 
            }
            &.slide-enter-done{
                opacity: 1;
            }
            /* 出场动画 */
            &.slide-exit{
                opacity: 1;
            }
            &.slide-exit-active{
                opacity: 0;
                transition: opacity 1s ease-in; 
            }
            &.slide-exit-done{
                opacity: 0;
            }
        }
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
        letter-spacing: .1rem;
    }
    .followRecipes {
        margin: 1rem 1rem 0 1rem;
        padding: .5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: ${bgColor};
        // color: #000;
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
        .followDynamic {
            margin-top: .5rem;
            overflow: hidden;
            overflow-x: auto;
            white-space: nowrap;
            img {
                height: 8rem;
                border-radius: .5rem;
            }
            .dynamic {
                margin: 0 .5rem;
                display: inline-block;
                .title {
                    margin: 0.5rem 0;
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
            }
        }
        .commentInput {
            margin: 1rem 0;
            display: flex;
            align-items: center;
            .avatar {
                border-radius: 50%;
                width: 2rem;
                height: 2rem;
            }
            // .send {
            //     margin-left: .5rem;
            //     color: ${themeColor};
            // }
        }
        .comment {
            // margin: .5rem 0;
            display: flex;
            width: 100%;
            align-items: center;
            line-height: 1.25rem;
            .avatar {
                border-radius: 50%;
                width: 2.5rem;
                height: 2.5rem;
            }
            .user {
                flex: 1;
                padding: .5rem 1rem;
                .name {
                    color: ${descColor};
                    margin: .5rem 0 ;
                    font-size: .8rem;
                }
            }
        }
        .reply {
            flex: 1;
            padding: .5rem 1rem;
            background: #FAFAF8;
            font-size: .8rem;
            line-height: 1.25rem;
            .name {
                color: ${descColor};
            }
        }
    }
}`;

export const SelectIcon = styled.i`{
    font-size: 1.5rem !important;
    margin-bottom: .5rem;
}`;

export const Input = styled(InputItem)`{
    flex: 1;
    margin-left: .5rem;
    height: 2rem !important;
    min-height: 1rem;
    background: #efeff4;
    border-radius: 4.5rem;
    color: #fff;
}`;

export const SelectContent = styled.div`{
    margin: .5rem;
    font-size: 1rem;
    text-align: center;
    color: #000;
    font-weight: bold;
}`