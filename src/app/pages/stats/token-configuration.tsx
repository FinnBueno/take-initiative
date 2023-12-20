import styled from 'styled-components'
import { TokenSetting } from '../../../util/metadata'
import { SmallInputField } from '../../components/atoms/small-input-field'
import { Heart } from '../../components/atoms/svg/heart'
import { Shield } from '../../components/atoms/svg/shield'
import { Text } from '../../components/atoms/typography'
import { ChangeEvent } from 'react'
import { Statblock } from '../../components/atoms/svg/statblock'
import { ButtonIcon } from '../../components/atoms/button-icon'
import { StatInput } from '../../components/molecules/stat-input'

type TokenOption = keyof Pick<TokenSetting, 'maxHealth' | 'ac' | 'statblockUrl'>

type Props = {
  token: TokenSetting
  updateConfiguration: (key: TokenOption, value: number | string) => void
}

export const TokenConfiguration = ({ token, updateConfiguration }: Props) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>, key: TokenOption) =>
    updateConfiguration(
      key,
      isNaN(event.currentTarget.valueAsNumber) ? event.currentTarget.value : event.currentTarget.valueAsNumber
    )

  return (
    <Container>
      <Avatar src={token.tokenUrl} />
      <CappedText>{token.tokenName}</CappedText>
      <Options>
        <StatInput
          direction='LEFT'
          icon={Heart}
          size='20'
          noMargin
          noBackground
          width={24}
          type='number'
          defaultValue={token.maxHealth}
          onChange={e => onChange(e, 'maxHealth')}
        />
        <StatInput
          direction='RIGHT'
          icon={Shield}
          size='20'
          noMargin
          noBackground
          width={24}
          type='number'
          defaultValue={token.ac}
          onChange={e => onChange(e, 'ac')}
        />
      </Options>
      <StatInput
        direction='LEFT'
        icon={Statblock}
        size='30'
        noMargin
        noBackground
        width={107}
        defaultValue={token.statblockUrl}
        onChange={e => onChange(e, 'statblockUrl')}
      />
    </Container>
  )
}

const CappedText = styled(Text)`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Options = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  & > * {
    margin: 0 12px;
  }
  margin-top: 8px;
`

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 4px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 0;
`
