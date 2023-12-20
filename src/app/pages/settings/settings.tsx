import styled from 'styled-components'
import { Text, Title } from '../../components/atoms/typography'
import { Checkbox } from '../../components/atoms/checkbox'
import OBR from '@owlbear-rodeo/sdk'
import { buildRoomMetadata } from '../../../util/general'
import { RoomMetadata } from '../../../util/metadata'
import { useRoomMetadata } from '../../services/metadata/use-room'

type Setting = keyof RoomMetadata

const toggleSetting = (setting: Setting, isTrue: boolean, oldSettings: RoomMetadata) => {
  if (!OBR.isReady) return

  if (setting === 'preventPlayersFromEnteringOwnInitiative') isTrue = !isTrue

  OBR.room.setMetadata(buildRoomMetadata({ [setting]: isTrue }, oldSettings))
}

export const Settings = ({ open }: { open: boolean }) => {
  const roomSettings = useRoomMetadata('settings')
  const { room } = roomSettings
  const {
    preventPlayersFromEnteringOwnInitiative,
    hideTokensOnInitiativeInput,
    addIdentifiersToUnnamedTokens,
    replaceHPWithDamageTaken,
  } = room

  return (
    <Container open={open}>
      <Title $level={4}>Settings</Title>
      <SettingRow>
        <Text>Allow players to submit their own initiative</Text>
        <Checkbox
          defaultChecked={!preventPlayersFromEnteringOwnInitiative}
          onToggle={isTrue => toggleSetting('preventPlayersFromEnteringOwnInitiative', isTrue, room)}
        />
      </SettingRow>
      <SettingRow>
        <Text>Hide tokens on initiative input</Text>
        <Checkbox
          defaultChecked={!!hideTokensOnInitiativeInput}
          onToggle={isTrue => toggleSetting('hideTokensOnInitiativeInput', isTrue, room)}
        />
      </SettingRow>
      <SettingRow>
        <Text>Apply labels to unnamed tokens</Text>
        <Checkbox
          defaultChecked={!!addIdentifiersToUnnamedTokens}
          onToggle={isTrue => toggleSetting('addIdentifiersToUnnamedTokens', isTrue, room)}
        />
      </SettingRow>
      <SettingRow>
        <Text>Treat HP input as damage taken</Text>
        <Checkbox
          defaultChecked={!!replaceHPWithDamageTaken}
          onToggle={isTrue => toggleSetting('replaceHPWithDamageTaken', isTrue, room)}
        />
      </SettingRow>
    </Container>
  )
}

const SettingRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  margin-top: 8px;
`

const Container = styled.div<{ open: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 8px 12px 0 12px;
  height: ${props => (props.open ? '110px' : '0')};
  opacity: ${props => (props.open ? '100%' : '0%')};
  transition: opacity 250ms, height 250ms;
  pointer-events: ${props => (props.open ? 'all' : 'none')};
`
