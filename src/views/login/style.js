import styled from 'styled-components';
import { themeColor, hintColor, textColor } from '@/styles/color';
import border from '@/styles/border';

export const SmsCheckWrapper = styled.div`{
  position: relative;
  .am-button::before {
    border: none !important;
  }
}`

export const Cancel = styled.div`{
  display: inline-block;
  margin-top: 1rem;
  margin-left: 1rem;
  color: ${themeColor};
}`

export const wechatLogin = {
  margin: '20rem 1.25rem 1rem 1.25rem',
  background: '#70BD53',
  color: '#FFFFFF'
}

export const phoneLogin = {
  margin: '1rem 1.25rem',
  background: `${themeColor}`,
  color: '#FFFFFF'
}

export const logo = {
  margin: 'auto',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '7.5rem',
  height: '2.5rem'
}

export const Slogan = styled.div`{
  text-align: center;
  position: absolute;
  top: 17rem;
  left: 0;
  right: 0;
  bottom: 0;
  color: ${hintColor};
}`

export const Border = border({
  component: styled.div`{
    margin: 1rem 0;
  }`,
  color: `${hintColor}`,
  width: '0 0 1px 0',
  style: 'solid',
  radius: '0px'
})

export const Tip = styled.div`{
  margin: 2rem;
  text-align: center;
  color: ${hintColor};
}`

export const PhoneNumber = styled.div`{
  margin: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.125rem;
}`

export const sendButton = {
  flex: 'auto', 
  width: '4rem', 
  border: 'none', 
  textAlign: 'center',
  color: `${textColor}`
}

export const inputValid = {
  flex: 'auto',
  marginLeft: '1rem'
}