import OBR, { Image } from '@owlbear-rodeo/sdk'
import styled from 'styled-components'
import { Token } from '../../components/molecules/token'
import { Text } from '../../components/atoms/typography'
import { KeyboardEvent, createRef, useMemo, useState } from 'react'
import { Arrow } from '../../components/atoms/svg/arrow'
import { getMetadata, setHealthForCharacter, stringSort } from '../../../util/general'
import { CharacterMetadata, TokenSetting } from '../../../util/metadata'
import { PlayerTag } from '../../components/molecules/player-tag'
import { SmallInputField } from '../../components/atoms/small-input-field'
import { Heart } from '../../components/atoms/svg/heart'
import { StatInput } from '../../components/molecules/stat-input'
import { Shield } from '../../components/atoms/svg/shield'
import { Divider } from '../../components/atoms/divider'
import { Damage } from '../../components/atoms/svg/damage'
import { ButtonIcon } from '../../components/atoms/button-icon'
import { Statblock } from '../../components/atoms/svg/statblock'

export type InitiativeEntry = {
  name: string
  id: string
  units: Image[]
  initiative: number
  isPlayer: boolean
}

type Props = {
  entry: InitiativeEntry
  hideToken?: boolean
  startTabOnNext: () => void
  tokenSetting?: TokenSetting
}

export const InitiativeRow = ({ entry, hideToken, startTabOnNext, tokenSetting }: Props) => {
  const [isExpanded, setExpanded] = useState(false)

  const panToGroup = async () => {
    const w = await OBR.viewport.getWidth()
    const h = await OBR.viewport.getHeight()
    const scale = Math.max(await OBR.viewport.getScale(), 0.25)
    const bounds = await OBR.scene.items.getItemBounds(entry.units.map(u => u.id))
    await OBR.viewport.animateTo({
      position: {
        x: -bounds.center.x * scale + w / 2,
        y: -bounds.center.y * scale + h / 2,
      },
      scale,
    })
  }

  const panTo = async (unit: Image) => {
    const w = await OBR.viewport.getWidth()
    const h = await OBR.viewport.getHeight()
    const scale = Math.max(await OBR.viewport.getScale(), 0.25)
    await OBR.viewport.animateTo({
      position: {
        x: -unit.position.x * scale + w / 2,
        y: -unit.position.y * scale + h / 2,
      },
      scale,
    })
  }

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>, unit: Image, index: number) => {
    const metadata = getMetadata<CharacterMetadata>(unit)
    let newHP
    if (isNaN(+event.currentTarget.value) || event.currentTarget.value.length === 0) {
      if (event.key !== 'Enter') return
      try {
        const sanitizedInput = event.currentTarget.value.replace(/[^-()\d/*+.]/g, '')
        newHP = eval(sanitizedInput)
      } catch (_) {
        // ignore
        OBR.notification.show('You can only input a valid formula into the health fields', 'ERROR')
        return
      }
    } else {
      newHP = event.currentTarget.value
    }
    event.currentTarget.value = newHP ?? ''

    if (event.key === 'Enter') {
      if (index + 1 >= nextInputs.length) {
        startTabOnNext()
      } else {
        nextInputs[index + 1].current?.focus()
        nextInputs[index + 1].current?.select()
      }
    }

    if (metadata.health === newHP) return
    setHealthForCharacter(newHP, unit)
  }

  const singularUnitMetadata = useMemo(
    () => (entry.units.length === 1 ? getMetadata<CharacterMetadata>(entry.units[0]) : undefined),
    [entry.units]
  )

  const nextInputs = Array.from({ length: entry.isPlayer ? 0 : entry.units.length }, () =>
    createRef<HTMLInputElement>()
  )

  return (
    <Wrapper>
      <NameContainer>
        <Left onClick={panToGroup}>
          {!hideToken && <Token image={entry.units[0]} height='42px' width='auto' />}
          <Name>{entry.name}</Name>
          {tokenSetting?.statblockUrl ? (
            <ButtonIcon onClick={() => window.open(tokenSetting?.statblockUrl, '_blank', 'noreferrer')}>
              <Statblock size='25' />
            </ButtonIcon>
          ) : null}
        </Left>
        <Right $showPointer={entry.units.length > 1} onClick={() => entry.units.length > 1 && setExpanded(s => !s)}>
          {entry.units.length > 1 ? (
            <Rotate $rotate={isExpanded}>
              <Arrow size='30' />
            </Rotate>
          ) : entry.isPlayer || !singularUnitMetadata ? (
            <PlayerTagContainer>
              <PlayerTag />
            </PlayerTagContainer>
          ) : (
            <StatInput
              direction='RIGHT'
              icon={Damage}
              size='25'
              width={24}
              defaultValue={singularUnitMetadata.health}
              ref={nextInputs[0]}
              onKeyUp={e => onKeyUp(e, entry.units[0], 0)}
            />
          )}
        </Right>
      </NameContainer>
      {tokenSetting ? (
        <TokenSettingsContainer>
          <TokenSettings>
            <StatInput
              direction='LEFT'
              icon={Heart}
              size='20'
              width={24}
              disabled
              defaultValue={tokenSetting.maxHealth}
            />
            <StatInput direction='RIGHT' icon={Shield} size='20' width={24} disabled defaultValue={tokenSetting.ac} />
          </TokenSettings>
        </TokenSettingsContainer>
      ) : null}
      <IndividualUnitSpacing $amountOfRows={Math.ceil(entry.units.length / 4)} $isExpanded={isExpanded}>
        <IndividualUnitContainer>
          {entry.units
            .sort((a, b) => stringSort(a.text.plainText, b.text.plainText))
            .map((unit, index) => {
              const metadata = getMetadata<CharacterMetadata>(unit)
              return (
                <IndividualEntryContainer key={unit.id}>
                  <ClickableText onClick={() => panTo(unit)}>{unit.text.plainText}</ClickableText>
                  <StatInput
                    direction='RIGHT'
                    icon={Damage}
                    size='20'
                    width={24}
                    defaultValue={metadata.health}
                    ref={nextInputs[index]}
                    onKeyUp={e => onKeyUp(e, unit, index)}
                  />
                </IndividualEntryContainer>
              )
            })}
        </IndividualUnitContainer>
      </IndividualUnitSpacing>
    </Wrapper>
  )
}

const TokenSettings = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 140px;
`
const TokenSettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`

const Rotate = styled.div<{ $rotate: boolean }>`
  rotate: ${props => (props.$rotate ? '180deg' : '0deg')};
  transform-origin: 50% 40%;
  transition: rotate 0.25s;
`

const PlayerTagContainer = styled.div`
  margin-right: 12px;
`

const ClickableText = styled(Text)`
  cursor: pointer;
`

const IndividualEntryContainer = styled.div`
  padding-top: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 4px;
`

const IndividualUnitContainer = styled.div`
  width: 100%;
  display: grid;
  margin-top: 8px;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`

const IndividualUnitSpacing = styled.div<{ $amountOfRows: number; $isExpanded: boolean }>`
  height: ${props => (props.$isExpanded ? `${80 * props.$amountOfRows}px` : '0')};
  padding: 0 8px;
  transition: height 0.25s;
  overflow: hidden;
`

const Left = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-direction: row;
`

const Right = styled.div<{ $showPointer: boolean }>`
  ${props => (props.$showPointer ? 'cursor: pointer;' : '')}
  flex: 1;
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding-right: 8px;
`

const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 8px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
`

const Name = styled(Text)`
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
  margin-right: 8px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 4px;
  padding: 8px 0;
  width: 100%;
  position: relative;
`
