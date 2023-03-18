const { AWS_SESSION_TOKEN, SECRET_NAME } = process.env

// Using this header indicates that the caller is within the Lambda environment.
const headers = {
    // AWS_SESSION_TOKEN is provided by Lambda for all running functions
    'X-Aws-Parameters-Secrets-Token': AWS_SESSION_TOKEN
}

const endpoint = `http://localhost:2773/secretsmanager/get?secretId=${SECRET_NAME}`

export async function handler() {
    console.log(`fetching the secret from: ${endpoint}`)
    const secret = await fetch(endpoint, {
        headers,
    }).then(res => res.json())
    console.log('secret has been retrieved', { secret })

    return JSON.stringify({
        secret: secret.SecretString
    })
}
