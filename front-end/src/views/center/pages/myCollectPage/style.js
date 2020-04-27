import styled from 'styled-components';
import { descColor, themeColor, hintColor, bgColor } from '@/styles/color';

export const CollectRecipesListWrapper = styled.div`{
    .recipesListContent {
        display: flex;
        margin-top: 1rem;
        height: 8rem;
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

export const SelectContent = styled.div`{
    margin-bottom: 1rem;
    font-size: 1rem;
    text-align: left;
    color: #000;
}`