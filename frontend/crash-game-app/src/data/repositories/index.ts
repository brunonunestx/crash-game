import { gamesRepository } from './games'
import { keyCloakRepositories } from './keycloak'
import { walletsRepository } from './wallets'

export const repositories = {
  games: gamesRepository,
  wallets: walletsRepository,
  keyCloak: keyCloakRepositories,
}
