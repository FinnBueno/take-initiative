import styled from 'styled-components'
import { Text, Title } from '../components/atoms/typography'
import { Checkbox } from '../components/atoms/checkbox'
import OBR from '@owlbear-rodeo/sdk'
import { buildRoomMetadata, castMetadata } from '../../util/general'
import { RoomMetadata } from '../../util/metadata'
import { useState } from 'react'

type Setting = 'SUBMIT_OWN_INITIATIVE'

const toggleSetting = (setting: Setting, isTrue: boolean) => {
  if (!OBR.isReady) return
  OBR.room.getMetadata().then(md => {
    const oldRoomMetadata = castMetadata<RoomMetadata>(md)
    switch (setting) {
      case 'SUBMIT_OWN_INITIATIVE':
        OBR.room.setMetadata(buildRoomMetadata({ preventPlayersFromEnteringOwnInitiative: !isTrue }, oldRoomMetadata))
        break
    }
  })
}

export const Settings = ({ open }: { open: boolean }) => {
  const [defaultSettings, setDefaultSettings] = useState<boolean[]>([false])
  return (
    <Container open={open}>
      <Title $level={4}>Settings</Title>
      <SettingRow>
        <Text>Allow players to submit their own initiative</Text>
        <Checkbox
          defaultValue={defaultSettings[0]}
          onToggle={isTrue => toggleSetting('SUBMIT_OWN_INITIATIVE', isTrue)}
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
  height: ${props => (props.open ? '50px' : '0')};
  opacity: ${props => (props.open ? '100%' : '0%')};
  transition: opacity 250ms, height 250ms;
`
