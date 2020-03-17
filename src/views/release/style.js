import styled from 'styled-components';
import { themeColor, hintColor, textColor } from '../../styles/color';

export const CreateRecipesWrapper = styled.div`{
  .am-modal-alert-content, .am-modal-propmt-content {
    font-size: 1.125rem;
    color: #000000;
  }

  .am-modal-button-group-h .am-modal-button {
      font-size: 1rem;
  }
}`

export const Slogan = styled.div`{
  text-align: center;
  position: absolute;
  top: 10rem;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.25rem;
}`

export const ReleaseMenu = styled.div`{
  display: flex;
  text-align: center;
  position: absolute;
  top: 15rem;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.25rem;
  .releaseButton {
    flex: 1;
    font-size: 1.125rem;
  }
}`

export const create = {
  marginBottom: '2rem',
  width: '8rem',
  height: '13rem'
}

export const ButtonWrapper = styled.div`{
  display: flex;
  text-align: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  .am-button::before, .button {
    flex: 1;
    border-radius: 0 !important;
  }
}`


export const recipeTitle = {
  textAlign: 'center',
  fontSize: '1.5rem'
}

export const Tip = styled.div`{
  height: 1.25rem;
  text-align: center;
  position: absolute;
  top: 10rem;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 1.25rem;
  z-index: 99;
  color: ${hintColor};
}`

export const TagContainer = styled.div`{
  display: flex;
  padding-top: 9px;
  flex-direction: row;
  flex-wrap: wrap;
  & > div {
      height: 1.75rem;
      line-height: 1.75rem;
      margin: .45rem;
    }
}`;

export const MaterialsWrapper = styled.div`{
  display: flex;
  .materialInput {
    flex: 1;
    padding: 0 !important;
    margin: 0 !important;
  }
  .am-list-item .am-list-line {
    padding-left: 0;
    padding-right: 0;
  }
}`

export const AddMore = styled.div`{
  margin: 1rem;
  color: ${themeColor};
  text-align: center;
}`
