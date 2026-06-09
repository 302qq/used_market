const env = import.meta.env || {};

export const SEPOLIA_CHAIN_ID = env.VITE_SEPOLIA_CHAIN_ID || "0xaa36a7";
export const USED_MARKET_CONTRACT_ADDRESS = env.VITE_USED_MARKET_CONTRACT_ADDRESS || "";
export const CONTRACT_DEPLOY_BLOCK = Number(env.VITE_CONTRACT_DEPLOY_BLOCK || 0);
export const DEFAULT_SEPOLIA_READ_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const BLOCKED_BROWSER_RPC_HOSTS = ["rpc.sepolia.org"];

function isBrowserBlockedRpcUrl(url = "") {
  try {
    const parsed = new URL(url);
    return BLOCKED_BROWSER_RPC_HOSTS.includes(parsed.hostname.toLowerCase());
  } catch {
    return true;
  }
}

function getReadRpcUrl() {
  const configuredUrl = String(env.VITE_SEPOLIA_READ_RPC_URL || "").trim();
  if (configuredUrl && !isBrowserBlockedRpcUrl(configuredUrl)) {
    return configuredUrl;
  }
  return DEFAULT_SEPOLIA_READ_RPC_URL;
}

export const SEPOLIA_READ_RPC_URLS = [getReadRpcUrl()];

export function getDeploymentConfig() {
  return {
    contractAddress: USED_MARKET_CONTRACT_ADDRESS,
    sepoliaChainId: SEPOLIA_CHAIN_ID,
    deployBlock: CONTRACT_DEPLOY_BLOCK,
    readRpcUrl: SEPOLIA_READ_RPC_URLS[0] || "",
    isContractConfigured: Boolean(USED_MARKET_CONTRACT_ADDRESS),
    hasDeployBlock: CONTRACT_DEPLOY_BLOCK > 0
  };
}

export function normalizeChainId(chainId) {
  if (typeof chainId === "bigint") {
    return `0x${chainId.toString(16)}`;
  }
  if (typeof chainId === "number") {
    return `0x${chainId.toString(16)}`;
  }
  if (typeof chainId === "string") {
    const normalized = chainId.trim().toLowerCase();
    if (!normalized) return "";
    return normalized.startsWith("0x") ? normalized : `0x${Number(normalized).toString(16)}`;
  }
  return "";
}

export function isSepoliaChain(chainId) {
  return normalizeChainId(chainId) === normalizeChainId(SEPOLIA_CHAIN_ID);
}