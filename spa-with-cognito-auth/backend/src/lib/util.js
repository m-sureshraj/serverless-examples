export function getAccessTokenFromReqContext(event) {
  // sls-offline plugin injects authorizer context into `authorizer` key, whereas in lambda env, the context
  // is under `authorizer.lambda` key. https://github.com/dherault/serverless-offline/issues/1697
  const { accessToken } =
    event.requestContext.authorizer.lambda ?? event.requestContext.authorizer;

  return accessToken;
}
