// room metadata

export type TokenSetting = {
  ac?: number
  maxHealth?: number
  tokenName: string
  tokenUrl: string
  statblockUrl?: string
}

export type RoomMetadata = {
  preventPlayersFromEnteringOwnInitiative?: boolean
  hideTokensOnInitiativeInput?: boolean
  addIdentifiersToUnnamedTokens?: boolean
  replaceHPWithDamageTaken?: boolean
  tokenSettings: { [key: string]: TokenSetting }
}

export const defaultRoomMetadata: RoomMetadata = {
  preventPlayersFromEnteringOwnInitiative: false,
  hideTokensOnInitiativeInput: false,
  addIdentifiersToUnnamedTokens: true,
  replaceHPWithDamageTaken: false,
  tokenSettings: {},
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
  health?: number
}
