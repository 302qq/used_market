const env = import.meta.env || {};

export const SEPOLIA_CHAIN_ID = env.VITE_SEPOLIA_CHAIN_ID || "0xaa36a7";
export const USED_MARKET_CONTRACT_ADDRESS = env.VITE_USED_MARKET_CONTRACT_ADDRESS || "";
export const CONTRACT_DEPLOY_BLOCK = Number(env.VITE_CONTRACT_DEPLOY_BLOCK || 0);

export function getDeploymentConfig() {
  return {
    contractAddress: USED_MARKET_CONTRACT_ADDRESS,
    sepoliaChainId: SEPOLIA_CHAIN_ID,
    deployBlock: CONTRACT_DEPLOY_BLOCK,
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
    return chainId.startsWith("0x") ? chainId.toLowerCase() : `0x${Number(chainId).toString(16)}`;
  }
  return "";
}

export function isSepoliaChain(chainId) {
  return normalizeChainId(chainId) === normalizeChainId(SEPOLIA_CHAIN_ID);
}
