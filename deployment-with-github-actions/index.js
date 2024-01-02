export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Deployed with GitHub Actions!!' }),
    headers: {
      'content-type': 'application/json',
    },
  };
}
