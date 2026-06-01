import { generateKeyPair, exportJWK, SignJWT } from "jose";

type TestAuth = {
  token: (email: string) => Promise<string>;
  jwks: object;
};

let cached: TestAuth | null = null;

export async function getTestAuth(): Promise<TestAuth> {
  if (cached) return cached;

  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const jwk = await exportJWK(publicKey);
  const jwks = { keys: [{ ...jwk, kid: "test-key", use: "sig" }] };

  cached = {
    jwks,
    token: (email: string) =>
      new SignJWT({ email })
        .setProtectedHeader({ alg: "RS256", kid: "test-key" })
        .setExpirationTime("1h")
        .sign(privateKey),
  };

  return cached;
}
