const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");

function readRootEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return { envPath, values: {}, exists: false };
  }

  const values = {};
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const rawValue = trimmed.slice(separator + 1).trim();
    values[key] = rawValue.replace(/^["']|["']$/g, "");
  }

  return { envPath, values, exists: true };
}

function getEnvValue(name, values) {
  return process.env[name] || values[name] || "";
}

function isPlaceholder(value = "") {
  return !value || value.includes("YOUR_") || value.includes("OPTIONAL_") || value.includes("...");
}

function requireDeploymentEnv() {
  const parsed = readRootEnv();
  const sepoliaRpcUrl = getEnvValue("SEPOLIA_RPC_URL", parsed.values);
  const privateKey = getEnvValue("PRIVATE_KEY", parsed.values);
  const missing = [];

  if (!parsed.exists && (!process.env.SEPOLIA_RPC_URL || !process.env.PRIVATE_KEY)) {
    missing.push(".env");
  }
  if (isPlaceholder(sepoliaRpcUrl)) missing.push("SEPOLIA_RPC_URL");
  if (isPlaceholder(privateKey)) missing.push("PRIVATE_KEY");

  if (missing.length > 0) {
    throw new Error(`Missing Sepolia deployment configuration: ${missing.join(", ")}`);
  }

  return {
    sepoliaRpcUrl,
    privateKey
  };
}

module.exports = {
  getEnvValue,
  isPlaceholder,
  readRootEnv,
  requireDeploymentEnv
};
