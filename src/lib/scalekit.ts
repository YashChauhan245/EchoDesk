// ===========================================
// Scalekit Client Singleton
// ===========================================
// Initializes the Scalekit SDK client with environment credentials.
// The client is lazily created on first access to avoid errors
// during build time when env vars may not be available.
// ===========================================

import { ScalekitClient } from '@scalekit-sdk/node';

let _client: ScalekitClient | null = null;

export function getScalekitClient(): ScalekitClient {
  if (!_client) {
    const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
    const clientId = process.env.SCALEKIT_CLIENT_ID;
    const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

    if (!envUrl || !clientId || !clientSecret) {
      throw new Error(
        'Missing Scalekit credentials. Please set SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, and SCALEKIT_CLIENT_SECRET in .env.local'
      );
    }

    _client = new ScalekitClient(envUrl, clientId, clientSecret);
  }

  return _client;
}

export default getScalekitClient;
