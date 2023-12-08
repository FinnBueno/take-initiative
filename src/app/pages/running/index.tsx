import styled from 'styled-components'
import { useTurnTakers } from '../../services/metadata/use-turn-takers'
import { buildSceneMetadata, getMetadata } from '../../../util/general'
import { CharacterMetadata } from '../../../util/metadata'
import { Text } from '../../components/atoms/typography'
import OBR, { Image } from '@owlbear-rodeo/sdk'
import { Button } from '../../components/atoms/button'

export const RunningPage = () => {
  const turnTakers = useTurnTakers()
  const goBack = () => OBR.scene.setMetadata(buildSceneMetadata({ state: 'STARTING' }))
  return (
    <Wrapper>
      <Button onClick={goBack}>Clear</Button>
      {turnTakers
        .reduce(
          (total, next) => {
            const md = getMetadata<CharacterMetadata>(next)
            total.push([next, md])
            return total
          },
          [] as [Image, CharacterMetadata][]
        )
        .sort((a, b) => (b[1]?.initiative ?? 0) - (a[1]?.initiative ?? 0))
        .map(([tt, md]) => {
          return (
            <Text key={tt.id}>
              {md?.initiative} - {tt.text?.plainText}
            </Text>
          )
        })}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
