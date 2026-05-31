import { USED_MARKET_CONTRACT_ADDRESS } from "../config/chain.js";
import { getReadOnlyUsedMarketContract, getSignerUsedMarketContract } from "./contracts.js";
import { waitForTransaction } from "./transactions.js";
import { ethToWei } from "../utils/price.js";
import { normalizeContractItem } from "../utils/items.js";

export function isUsedMarketConfigured() {
  return Boolean(USED_MARKET_CONTRACT_ADDRESS);
}

export async function fetchAllItems(ethereum) {
  const contract = getReadOnlyUsedMarketContract(ethereum);
  const items = await contract.getAllItems();
  return items.map(normalizeContractItem);
}

function extractItemIdFromReceipt(contract, receipt) {
  for (const log of receipt.logs || []) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed?.name === "ItemRegistered") {
        return Number(parsed.args.itemId);
      }
    } catch {
      // Ignore logs emitted by other contracts in the same transaction.
    }
  }
  return null;
}

export async function registerItemOnChain(ethereum, form) {
  const contract = await getSignerUsedMarketContract(ethereum);
  const tx = await contract.registerItem(
    form.name.trim(),
    form.description.trim(),
    ethToWei(form.listedPrice),
    form.category,
    form.imageUrl.trim(),
    form.isPublic === "Public"
  );
  const waited = await waitForTransaction(tx);
  const itemId = extractItemIdFromReceipt(contract, waited.receipt);

  return {
    itemId,
    txHash: waited.hash
  };
}
