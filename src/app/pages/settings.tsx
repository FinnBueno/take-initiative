import styled from 'styled-components'
import { Text, Title } from '../components/atoms/typography'
import { Checkbox } from '../components/atoms/checkbox'
import OBR from '@owlbear-rodeo/sdk'
import { buildRoomMetadata } from '../../util/general'
import { RoomMetadata, defaultRoomMetadata } from '../../util/metadata'
import { useRoomMetadata } from '../services/metadata/use-room'

type Setting = keyof RoomMetadata

const toggleSetting = (setting: Setting, isTrue: boolean, oldSettings: RoomMetadata) => {
  if (!OBR.isReady) return
  console.log('toggleSetting', setting)
  switch (setting) {
    case 'preventPlayersFromEnteringOwnInitiative':
      OBR.room.setMetadata(buildRoomMetadata({ preventPlayersFromEnteringOwnInitiative: !isTrue }, oldSettings))
      break
    case 'hideTokensOnInitiativeInput':
      OBR.room.setMetadata(buildRoomMetadata({ hideTokensOnInitiativeInput: isTrue }, oldSettings))
      break
  }
}

export const Settings = ({ open }: { open: boolean }) => {
  const roomSettings = useRoomMetadata()
  const { preventPlayersFromEnteringOwnInitiative, hideTokensOnInitiativeInput } = roomSettings

  return (
    <Container open={open}>
      <Title $level={4}>Settings</Title>
      <SettingRow>
        <Text>Allow players to submit their own initiative</Text>
        <Checkbox
          defaultChecked={!preventPlayersFromEnteringOwnInitiative}
          onToggle={isTrue => toggleSetting('preventPlayersFromEnteringOwnInitiative', isTrue, roomSettings)}
        />
      </SettingRow>
      <SettingRow>
        <Text>Hide tokens on initiative input</Text>
        <Checkbox
          defaultChecked={!!hideTokensOnInitiativeInput}
          onToggle={isTrue => toggleSetting('hideTokensOnInitiativeInput', isTrue, roomSettings)}
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
  height: ${props => (props.open ? '90px' : '0')};
  opacity: ${props => (props.open ? '100%' : '0%')};
  transition: opacity 250ms, height 250ms;
`
