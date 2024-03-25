import { URL } from 'node:url'

import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";

import awsConfig from "../config/aws.json" assert { type: "json" };
import { getSessionUser } from "./util.js";

const url = new URL(`${awsConfig.apiEndpoint}/membership`);
const request = new HttpRequest({
  path: url.pathname,
  method: "POST", // must be capitalized
  headers: {
    host: url.host,
    'Content-Type': 'application/json',
  },
});

const { awsTempCredentials } = getSessionUser("premiumUser");
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
} catch (error) {
  console.log(error);
}
