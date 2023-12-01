import styled from "styled-components";

export const Title = styled.h1<{ size?: string }>`
  line-height: 1;
  margin: 0;
  ${props => props.size ? `font-size: ${props.size};` : ''}
`

export const Text = styled.p`
  line-height: 1;
`

export const HandwritingTitle = styled(Title)`
  /* font-family: 'Homemade Apple', bold;
  margin-top: 40px;
  font-size: 48px; */
`

export const HandwritingText = styled(Text)`
  font-family: 'Homemade Apple', cursive;
  font-size: 14px;
`