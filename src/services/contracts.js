import { Contract, FallbackProvider, JsonRpcProvider } from "ethers";
import { SEPOLIA_READ_RPC_URLS, USED_MARKET_CONTRACT_ADDRESS } from "../config/chain.js";
import { usedMarketAbi } from "../contracts/usedMarketAbi.js";
import { createBrowserProvider } from "./wallet.js";

export function assertContractAddress(address = USED_MARKET_CONTRACT_ADDRESS) {
  if (!address) {
    throw new Error("UsedMarket contract address is not configured");
  }
}

export function createReadOnlyProvider() {
  const providers = SEPOLIA_READ_RPC_URLS.map((url) => new JsonRpcProvider(url, 11155111));
  if (!providers.length) {
    throw new Error("Sepolia read-only RPC URL is not configured");
  }
  return providers.length === 1 ? providers[0] : new FallbackProvider(providers, 11155111);
}

export function getReadOnlyUsedMarketContract(address = USED_MARKET_CONTRACT_ADDRESS) {
  assertContractAddress(address);
  return new Contract(address, usedMarketAbi, createReadOnlyProvider());
}

export async function getSignerUsedMarketContract(ethereum, address = USED_MARKET_CONTRACT_ADDRESS) {
  assertContractAddress(address);
  const provider = createBrowserProvider(ethereum);
  const signer = await provider.getSigner();
  return new Contract(address, usedMarketAbi, signer);
}