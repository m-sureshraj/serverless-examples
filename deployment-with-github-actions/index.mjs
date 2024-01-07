export const handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'foo bar baz' }),
    headers: {
      'content-type': 'application/json',
    },
  };
}
