import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  formatTransactionDate,
  getOwnedItems,
  getParticipatingTransactions,
  getTransferredItems,
  getTxHashLabel
} from "../src/utils/ownership.js";

const wallet = "0x1111111111111111111111111111111111111111";
const buyer = "0x2222222222222222222222222222222222222222";
const nextBuyer = "0x3333333333333333333333333333333333333333";

const items = [
  { itemId: 1, name: "Owned Item", currentOwner: wallet, isPublic: true },
  { itemId: 2, name: "Transferred Item", currentOwner: nextBuyer, isPublic: true },
  { itemId: 3, name: "Other Item", currentOwner: buyer, isPublic: true }
];

const histories = {
  1: [{ id: "1-0", itemId: 1, from: buyer, to: wallet, transactionPrice: "0.1 ETH", timestamp: 100, txHash: "0xaaa" }],
  2: [{ id: "2-0", itemId: 2, from: wallet, to: nextBuyer, transactionPrice: "0.2 ETH", timestamp: 200 }],
  3: [{ id: "3-0", itemId: 3, from: buyer, to: nextBuyer, transactionPrice: "0.3 ETH", timestamp: 300, txHash: "0xbbb" }]
};

assert.deepEqual(getOwnedItems(items, wallet).map((item) => item.itemId), [1]);
assert.deepEqual(getTransferredItems(items, histories, wallet).map((item) => item.itemId), [2]);
assert.deepEqual(getOwnedItems(items, "").map((item) => item.itemId), []);
assert.deepEqual(getTransferredItems(items, histories, "").map((item) => item.itemId), []);

const participating = getParticipatingTransactions(items, histories, wallet);
assert.deepEqual(participating.map((record) => record.itemId), [2, 1]);
assert.equal(participating[0].itemName, "Transferred Item");
assert.ok(getTxHashLabel(participating[0]));
assert.equal(getTxHashLabel(participating[1]), "0xaaa");
assert.match(formatTransactionDate(participating[0]), /1970/);

const myItemsSource = readFileSync(path.join(process.cwd(), "src/pages/MyItems.jsx"), "utf8");
const historySource = readFileSync(path.join(process.cwd(), "src/pages/TransactionHistory.jsx"), "utf8");
const registrySource = readFileSync(path.join(process.cwd(), "src/context/ItemRegistryContext.jsx"), "utf8");
const serviceSource = readFileSync(path.join(process.cwd(), "src/services/usedMarket.js"), "utf8");
const sourceText = [myItemsSource, historySource, registrySource, serviceSource].join("\n");

for (const required of [
  "getOwnedItems",
  "getTransferredItems",
  "getParticipatingTransactions",
  "refreshAllTransactionHistories",
  "getAllItems",
  "getTransactionHistory",
  "OwnershipTransferred",
  "queryFilter",
  "Tx Hash",
  "Connect Wallet"
]) {
  assert.ok(sourceText.includes(required), `Missing Phase 7 implementation marker: ${required}`);
}

for (const forbidden of ["Export CSV", "Filter By Date", "Gas Fee", "USD"]) {
  assert.equal(sourceText.includes(forbidden), false, `Forbidden Phase 7 UI term found: ${forbidden}`);
}

console.log("PASS: Phase 7 My Items and Transaction History checks passed.");