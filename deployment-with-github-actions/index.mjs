export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello this is updated via github actions' }),
    headers: {
      'content-type': 'application/json',
    },
  };
}
