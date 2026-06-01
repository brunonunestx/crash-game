import { AuthRepository } from './auth/repository'

export const keyCloakRepositories = {
  auth: new AuthRepository(),
}
