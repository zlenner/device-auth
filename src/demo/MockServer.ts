import { CredentialKey } from "../passwordless/types";
import { DeviceAuth } from "../server";
import { AuthenticatePayload, RegisterPayload } from "types";

class MockDatabase {
  // We don't need to make this async, but we are so it looks like a real database
  async get(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async set(key: string, object: any) {
    localStorage.setItem(key, JSON.stringify(object));
  }
}

class MockServer {
  private device_auth: DeviceAuth
  private database: MockDatabase
  private access_tokens: {
    [key: string]: string
  } = {}

  constructor() {
    this.device_auth = new DeviceAuth()
    this.database = new MockDatabase()
  }

  private generate_access_token(credential_id: string) {
    const randomKey = Math.random().toString(36)
    this.access_tokens[randomKey] = credential_id
    return randomKey;
  }

  async issue_challenge() {
    return this.device_auth.issue_challenge();
  }

  async verify_authentication(payload: AuthenticatePayload) {
    // We don't need to validate as this will throw an error if it's invalid
    const credential = await this.database.get(payload.credential_id) as CredentialKey
    const authentication_parsed = await this.device_auth.verify_authentication(payload, credential);

    return this.generate_access_token(authentication_parsed.credentialId);
  }

  async verify_registration(payload: RegisterPayload) {
    // We don't need to validate as this will throw an error if it's invalid
    const registration = await this.device_auth.verify_registration(payload);
    await this.database.set(payload.credential_id, registration.credential);

    return this.generate_access_token(registration.credential.id);
  }
}

export default MockServer;