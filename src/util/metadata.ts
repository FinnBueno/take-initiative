// room metadata

export type RoomMetadata = {
  preventPlayersFromEnteringOwnInitiative?: boolean
  hideTokensOnInitiativeInput?: boolean
}

export const defaultRoomMetadata: RoomMetadata = {
  preventPlayersFromEnteringOwnInitiative: false,
  hideTokensOnInitiativeInput: false,
}

// scene metadata

export type SceneInitiativeState = 'INACTIVE' | 'STARTING' | 'RUNNING'
export type UnnamedCharacterStrategy = 'INDIVIDUAL' | 'TYPE_GROUP' | 'ONE_GROUP'

export type SceneMetadata = {
  state: SceneInitiativeState
  round: number
  unnamedCharacterStrategy: UnnamedCharacterStrategy
}

export const defaultSceneMetadata: Pick<SceneMetadata, 'round' | 'unnamedCharacterStrategy'> = {
  round: 0,
  unnamedCharacterStrategy: 'TYPE_GROUP',
}

export type RequiredSceneMetadata = Omit<SceneMetadata, keyof typeof defaultSceneMetadata> &
  Partial<typeof defaultSceneMetadata>

// character metadata

export type CharacterMetadata = {
  partOfCombat: boolean
  initiative?: number
}
