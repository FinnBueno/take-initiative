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

export type SceneMetadata = {
  state: SceneInitiativeState
  round: number
}

export const defaultSceneMetadata: Pick<SceneMetadata, 'round'> = {
  round: 0,
}

export type RequiredSceneMetadata = Omit<SceneMetadata, keyof typeof defaultSceneMetadata> &
  Partial<typeof defaultSceneMetadata>

// character metadata

export type CharacterMetadata = {
  partOfCombat: boolean
  initiative?: number
}
