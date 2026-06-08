import { CONTRACT_DEPLOY_BLOCK, USED_MARKET_CONTRACT_ADDRESS } from "../config/chain.js";
import { getReadOnlyUsedMarketContract, getSignerUsedMarketContract } from "./contracts.js";
import { waitForTransaction } from "./transactions.js";
import { ethToWei, weiToEth } from "../utils/price.js";
import { normalizeContractItem } from "../utils/items.js";

export function isUsedMarketConfigured() {
  return Boolean(USED_MARKET_CONTRACT_ADDRESS);
}

export async function fetchAllItems() {
  const contract = getReadOnlyUsedMarketContract();
  const items = await contract.getAllItems();
  return items.map(normalizeContractItem);
}

export async function fetchTransactionHistory(itemId) {
  const contract = getReadOnlyUsedMarketContract();
  const records = await contract.getTransactionHistory(itemId);
  const txHashes = await fetchOwnershipTransferTxHashes(contract, itemId);

  return records.map((record, index) => ({
    id: `${itemId}-${index}`,
    itemId: Number(itemId),
    from: record.from,
    to: record.to,
    transactionPrice: `${weiToEth(record.transactionPrice)} ETH`,
    timestamp: Number(record.timestamp),
    txHash: txHashes[index] || "조회 불가"
  }));
}

async function fetchOwnershipTransferTxHashes(contract, itemId) {
  try {
    const filter = contract.filters.OwnershipTransferred(itemId);
    const logs = await contract.queryFilter(filter, CONTRACT_DEPLOY_BLOCK || 0, "latest");
    return logs.map((log) => log.transactionHash || "조회 불가");
  } catch {
    return [];
  }
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

export async function updateItemOnChain(ethereum, itemId, form) {
  const contract = await getSignerUsedMarketContract(ethereum);
  const tx = await contract.updateItem(
    itemId,
    form.name.trim(),
    form.description.trim(),
    ethToWei(form.listedPrice),
    form.category,
    form.imageUrl.trim()
  );
  return waitForTransaction(tx);
}

export async function setItemVisibilityOnChain(ethereum, itemId, isPublic) {
  const contract = await getSignerUsedMarketContract(ethereum);
  const tx = await contract.setItemVisibility(itemId, isPublic);
  return waitForTransaction(tx);
}

export async function transferOwnershipOnChain(ethereum, itemId, newOwner, transactionPrice) {
  const contract = await getSignerUsedMarketContract(ethereum);
  const tx = await contract.transferOwnership(itemId, newOwner, ethToWei(transactionPrice));
  return waitForTransaction(tx);
}