import styled from 'styled-components'
import { ButtonIcon } from '../../components/atoms/button-icon'
import { Cogs } from '../../components/atoms/svg/cogs'
import { useGMData } from '../../services/gm-data/hook'

export const SettingsButton = ({ onPress }: { onPress: () => void }) => {
  const { isGM } = useGMData()
  return (
    isGM && (
      <CogsContainer>
        <CogsButton onClick={onPress}>
          <Cogs />
        </CogsButton>
      </CogsContainer>
    )
  )
}

const CogsContainer = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
`

const CogsButton = styled(ButtonIcon)`
  position: relative;
  z-index: 10;
`
