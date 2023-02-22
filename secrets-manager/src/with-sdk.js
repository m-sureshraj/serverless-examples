import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'; 

const client = new SecretsManagerClient({});

const { SECRET_NAME } = process.env;
console.log(`The secret name is: ${SECRET_NAME}`);
const command = new GetSecretValueCommand({
    SecretId: SECRET_NAME
});

console.log('Retrieving secret during top-level await');
const secret = await client.send(command);
console.log('Secret has been fetched');

export async function handler() {
    console.log('Using secret in handler');
    return secret.SecretString;
}
