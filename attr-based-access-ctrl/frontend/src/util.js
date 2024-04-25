import path from "node:path";
import { fileURLToPath } from "node:url";

import editJsonFile from "edit-json-file";

import awsConfig from "../config/aws.json" assert { type: "json" };
import usersConfig from "../config/users.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersConfigPath = path.resolve(__dirname, "..", "config", "users.json");

export async function writeTempAWSCredentials(userType, tempCredentials = {}) {
  console.log("saving temporary credentials to the file: ", usersConfigPath);
  editJsonFile(usersConfigPath)
    .set(`${userType}.awsTempCredentials`, tempCredentials)
    .save();
  console.log("credentials successfully saved");
}

export async function writeTokens(userType, tokens = {}) {
  console.log("saving tokens to the file: ", usersConfigPath);
  editJsonFile(usersConfigPath).set(`${userType}.tokens`, tokens).save();
  console.log("tokens successfully saved");
}

export function getUserPoolConfig() {
  return {
    UserPoolId: awsConfig.userPoolId,
    ClientId: awsConfig.userPoolClientId,
  };
}

export function getSessionUser(userType) {
  if (!userType.trim()) {
    throw new Error("userType is required");
  }

  return usersConfig[userType];
}

export function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  const parsedArgsObj = args.reduce((accumulator, currentValue) => {
    const [key, value] = currentValue.trim().split("=");
    accumulator[key.trim()] = value.trim();

    return accumulator;
  }, {});

  const { userType } = parsedArgsObj;
  if (!userType) {
    throw new Error(
      "Required argument 'user' is missing. Usage: npm run signup user=<free|premium>",
    );
  }

  if (!["free", "premium"].includes(userType)) {
    throw new Error(
      "Invalid argument 'user'. Usage: npm run signup user=<free|premium>",
    );
  }

  return parsedArgsObj;
}
