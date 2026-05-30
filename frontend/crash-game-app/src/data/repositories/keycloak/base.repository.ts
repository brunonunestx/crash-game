import Keycloak from 'keycloak-js'

export class KeyCloakBaseRepository {
  protected keycloak: Keycloak
  protected config: {
    url: string
    realm: string
    clientId: string
  }

  constructor() {
    this.config = this.getConfig()
    this.keycloak = this.getKeyCloakInstance()
  }

  private getKeyCloakInstance(): Keycloak {
    const { url, realm, clientId } = this.getConfig()

    if (!url || !realm || !clientId) {
      throw new Error(
        'Keycloak configuration is missing in environment variables.',
      )
    }

    return new Keycloak({
      url,
      realm,
      clientId,
    })
  }

  private getConfig() {
    return {
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    }
  }
}
