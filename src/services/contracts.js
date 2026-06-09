import { Contract, JsonRpcProvider } from "ethers";
import { SEPOLIA_READ_RPC_URLS, USED_MARKET_CONTRACT_ADDRESS } from "../config/chain.js";
import { usedMarketAbi } from "../contracts/usedMarketAbi.js";
import { createBrowserProvider } from "./wallet.js";

export function assertContractAddress(address = USED_MARKET_CONTRACT_ADDRESS) {
  if (!address) {
    throw new Error("UsedMarket contract address is not configured");
  }
}

export function createReadOnlyProvider() {
  const rpcUrl = SEPOLIA_READ_RPC_URLS[0];
  if (!rpcUrl) {
    throw new Error("Sepolia read-only RPC URL is not configured");
  }
  return new JsonRpcProvider(rpcUrl, 11155111, { staticNetwork: true });
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