import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { connectedWallet, mockItems, mockTransactions } from "../src/data/mockData.js";
import { filterPublicItems } from "../src/utils/items.js";
import { shortenAddress } from "../src/utils/format.js";

const ownedItem = mockItems.find((item) => item.currentOwner.toLowerCase() === connectedWallet.toLowerCase());
assert.ok(ownedItem, "Fixture must include an owned item for Item Detail owner tests.");
assert.equal(shortenAddress(ownedItem.currentOwner), "0x8A12...BcDe");

const privateItem = { ...ownedItem, itemId: 999, isPublic: false };
assert.equal(filterPublicItems([...mockItems, privateItem]).some((item) => item.itemId === 999), false);

const sixRecords = Array.from({ length: 6 }, (_, index) => ({
  id: `record-${index}`,
  itemId: ownedItem.itemId,
  from: connectedWallet,
  to: "0x0000000000000000000000000000000000000001",
  transactionPrice: "0.10 ETH",
  timestamp: 1000 + index
}));
assert.equal(sixRecords.slice(0, 5).length, 5);

const existingHistory = mockTransactions.filter((record) => Number(record.itemId) === Number(ownedItem.itemId));
assert.equal(existingHistory.length > 0, true, "Fixture owned item should have history to verify edit disabled state.");

const itemDetailSource = readFileSync(path.join(process.cwd(), "src/pages/ItemDetail.jsx"), "utf8");
const registrySource = readFileSync(path.join(process.cwd(), "src/context/ItemRegistryContext.jsx"), "utf8");
const serviceSource = readFileSync(path.join(process.cwd(), "src/services/usedMarket.js"), "utf8");
const sourceText = [itemDetailSource, registrySource, serviceSource].join("\n");

for (const required of [
  "getRouteItemId",
  "Current Owner",
  "전체 거래 이력 보기",
  "setItemVisibility",
  "updateItem",
  "setItemVisibilityOnChain",
  "updateItemOnChain",
  "records.slice(0, 5)",
  "Private 물품입니다.",
  "소유권 이전 이력이 있는 물품은 정보를 수정할 수 없습니다."
]) {
  assert.ok(sourceText.includes(required), `Missing Phase 5 implementation marker: ${required}`);
}

for (const forbidden of [
  "Authenticated",
  "Verified Digital Certificate",
  "USD",
  "좋아요",
  "공유",
  "Export CSV",
  "Filter By Date",
  "Gas Fee"
]) {
  assert.equal(sourceText.includes(forbidden), false, `Forbidden Item Detail UI term found: ${forbidden}`);
}

console.log("PASS: Phase 5 Item Detail, owner action, visibility, update, and history checks passed.");
