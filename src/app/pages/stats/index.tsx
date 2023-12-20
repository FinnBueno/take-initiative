import styled from 'styled-components'
import { Button } from '../../components/atoms/button'
import { Text, Title } from '../../components/atoms/typography'
import OBR, { Image } from '@owlbear-rodeo/sdk'
import { useOBR } from '../../services/use-obr-data'
import { useMemo, useState } from 'react'
import { Divider } from '../../components/atoms/divider'
import { TokenConfiguration } from './token-configuration'
import { ButtonIcon } from '../../components/atoms/button-icon'
import { Create } from '../../components/atoms/svg/create'
import { useRoomMetadata } from '../../services/metadata/use-room'

type Props = { goBack: () => void }

export const TokenStatsPage = ({ goBack }: Props) => {
  const [selection, setSelection] = useState<Image[]>([])

  const updateSelection = (newSelection: string[] | undefined) => {
    if (!newSelection || !newSelection.length) {
      setSelection([])
    } else {
      // only keep items that are still present in the new selection
      const selectionWithoutOldUnits = selection.filter(i => newSelection.includes(i.id))
      // make a version of that same list with just IDs
      const idsInCurrentSelection = selectionWithoutOldUnits.map(i => i.id)
      // find all selected items in new selection that are NOT in the old selection, and thus need to be fetched
      const newUnits = newSelection.filter(id => !idsInCurrentSelection.includes(id))
      // fetch only the new items that are images and on the character layer, then save them
      OBR.scene.items
        .getItems(item => newUnits.includes(item.id) && item.type === 'IMAGE' && item.layer === 'CHARACTER')
        .then(items => setSelection([...selectionWithoutOldUnits, ...(items as Image[])]))
    }
  }

  useOBR<string[] | undefined>({
    onChange: cb => OBR.player.onChange(p => cb(p.selection)),
    get: () => OBR.player.getSelection(),
    run: updateSelection,
  })

  const { room, updateTokenConfigurations, deleteTokenConfiguration: _ } = useRoomMetadata()
  const { tokenSettings } = room

  const tokenSettingsNames = Object.keys(tokenSettings)
  const selectedTokenNames = useMemo(
    () =>
      selection.filter((item, index) => {
        const isNotFirst = selection.findIndex(s => s.name === item.name) !== index
        if (isNotFirst) return false
        const alreadyHasConfiguration = tokenSettingsNames.includes(item.name)
        if (alreadyHasConfiguration) return false
        return true
      }),
    [selection, tokenSettingsNames]
  )

  const createConfiguration = () => {
    updateTokenConfigurations(
      selectedTokenNames.map(image => ({
        tokenName: image.name,
        tokenUrl: image.image.url,
      }))
    )
    OBR.player.deselect()
  }

  return (
    <Wrapper>
      <Title $level={3}>Token Stats</Title>
      <Divider $size={2} />
      <Title $level={5}>Selected Tokens</Title>
      {selectedTokenNames.length ? (
        <SelectedTokensContainer>
          <SelectedTokens>
            {selectedTokenNames.map(token => (
              <SelectedTokenPreview src={token.image.url} />
            ))}
          </SelectedTokens>
          <ButtonIcon onClick={createConfiguration}>
            <Create size='46px' />
          </ButtonIcon>
        </SelectedTokensContainer>
      ) : (
        <NoSelectedTokens>
          <Text>Select new tokens on the map to configure stats for them</Text>
        </NoSelectedTokens>
      )}
      <Divider $size={2} />
      {Object.values(tokenSettings).length ? (
        <ConfiguredTokensGrid>
          {Object.values(tokenSettings).map(tokenSetting => (
            <TokenConfiguration
              token={tokenSetting}
              updateConfiguration={(key, value) => {
                updateTokenConfigurations([
                  {
                    ...tokenSetting,
                    [key]: value,
                  },
                ])
              }}
            />
          ))}
        </ConfiguredTokensGrid>
      ) : (
        <Text>You don't have any token configurations yet</Text>
      )}
      <Divider $size={2} />
      <Button onClick={goBack}>Go Back</Button>
    </Wrapper>
  )
}

const ConfiguredTokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  grid-gap: 20px;
  max-width: 100%;
`

const SelectedTokenPreview = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 4px;
  z-index: -1;
`

const NoSelectedTokens = styled.div`
  height: 40px;
  display: flex;
  margin-top: 12px;
  align-items: center;
`

const SelectedTokensContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`

const SelectedTokens = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  overflow-y: scroll;
  margin-right: 4px;
  border-radius: 8px;
  position: relative;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px 8px 8px;
`
