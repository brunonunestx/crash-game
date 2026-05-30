import { KeyCloakBaseRepository } from '../base.repository'

export class AuthRepository extends KeyCloakBaseRepository {
  constructor() {
    super()
  }

  async login(username: string, password: string) {
    this.keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256' })

    const response = await fetch(
      `${this.config.url}/realms/${this.config.realm}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          grant_type: 'password',
          username,
          password,
        }),
      },
    )

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(errors.invalidCredentials.friendlyMessage)
      }

      throw new Error(errors.unexpectedError.friendlyMessage)
    }

    const data = await response.json()

    localStorage.setItem(
      'user_tokens',
      JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }),
    )
  }

  async loginWithGoogle() {
    this.keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256' })
    try {
      await this.keycloak.login({ idpHint: 'google' })
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Login failed')
    }
  }
}
