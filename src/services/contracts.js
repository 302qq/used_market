import { Contract } from "ethers";
import { USED_MARKET_CONTRACT_ADDRESS } from "../config/chain.js";
import { usedMarketAbi } from "../contracts/usedMarketAbi.js";
import { createBrowserProvider } from "./wallet.js";

export function assertContractAddress(address = USED_MARKET_CONTRACT_ADDRESS) {
  if (!address) {
    throw new Error("UsedMarket contract address is not configured");
  }
}

export function getReadOnlyUsedMarketContract(ethereum, address = USED_MARKET_CONTRACT_ADDRESS) {
  assertContractAddress(address);
  const provider = createBrowserProvider(ethereum);
  return new Contract(address, usedMarketAbi, provider);
}

export async function getSignerUsedMarketContract(ethereum, address = USED_MARKET_CONTRACT_ADDRESS) {
  assertContractAddress(address);
  const provider = createBrowserProvider(ethereum);
  const signer = await provider.getSigner();
  return new Contract(address, usedMarketAbi, signer);
}
