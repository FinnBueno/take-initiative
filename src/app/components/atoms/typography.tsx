import styled from 'styled-components'

const titleSizeLevels = {
  1: '42px',
  2: '36px',
  3: '28px',
  4: '22px',
}

type TitleSizeOptions = keyof typeof titleSizeLevels

export const Title = styled.h1<{ level?: TitleSizeOptions }>`
  line-height: 1;
  margin: 0;
  ${props => `font-size: ${titleSizeLevels[props.level ?? 1]};`}
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
