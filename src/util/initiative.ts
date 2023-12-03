export type SceneInitiativeState = 'INACTIVE' | 'STARTING' | 'RUNNING'

export type SceneMetadata = {
  state: SceneInitiativeState
  round: number
}

export const defaultSceneMetadata: Pick<SceneMetadata, 'round'> = {
  round: 0,
}

export type RequiredSceneMetadata = Omit<SceneMetadata, keyof typeof defaultSceneMetadata> &
  Partial<typeof defaultSceneMetadata>

export type CharacterMetadata = {
  partOfCombat: boolean
  initiative?: number
}
