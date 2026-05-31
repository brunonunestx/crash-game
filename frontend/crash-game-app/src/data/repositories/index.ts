import { gamesRepository } from './games'
import { keyCloakRepositories } from './keycloak'

export const repositories = {
  games: gamesRepository,
  keyCloak: keyCloakRepositories,
}
