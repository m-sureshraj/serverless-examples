import { URL } from 'node:url'

import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";

import awsConfig from "../config/aws.json" assert { type: "json" };
import { getSessionUser, parseCommandLineArgs } from "./util.js";
import { refreshSession } from './refresh-session.js';

const { userType } = parseCommandLineArgs();
const { awsTempCredentials } = getSessionUser(userType);

const url = new URL(`${awsConfig.apiEndpoint}/membership`);
const request = new HttpRequest({
  path: url.pathname,
  method: "POST", // must be capitalized
  headers: {
    host: url.host,
    'Content-Type': 'application/json',
  },
});

const signer = new SignatureV4({
  credentials: awsTempCredentials,
  service: "execute-api",
  region: awsConfig.region,
  sha256: Sha256,
});

try {
  const { method, headers, body } = await signer.sign(request);
  const res = await fetch(url.href, {
    method,
    headers,
    body,
  });

  const json = await res.json();
  console.log(json);

  console.log('\nRefreshing session');
  await refreshSession(userType);
} catch (error) {
  console.log(error);
}
