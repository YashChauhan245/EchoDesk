// Test Scalekit credentials directly
const { ScalekitClient } = require('@scalekit-sdk/node');

// Get credentials from environment variables directly passed
const envUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
const clientId = process.env.SCALEKIT_CLIENT_ID;
const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

console.log('Credentials:');
console.log('URL:', envUrl);
console.log('ID:', clientId);
console.log('Secret length:', clientSecret ? clientSecret.length : 0);

try {
  const client = new ScalekitClient(envUrl, clientId, clientSecret);
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const url = client.getAuthorizationUrl(redirectUri, {
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  });
  console.log('SUCCESS generating URL:', url);
} catch (error) {
  console.error('ERROR during Scalekit Client initialization:', error.message);
}
