import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isEthereumAddress } from "../src/utils/format.js";
import { ethToWei } from "../src/utils/price.js";

assert.equal(isEthereumAddress("0x1234567890abcdef1234567890abcdef12345678"), true);
assert.equal(isEthereumAddress("0x123"), false);
assert.equal(ethToWei("0.21").toString(), "210000000000000000");

const transferSource = readFileSync(path.join(process.cwd(), "src/pages/TransferOwnership.jsx"), "utf8");
const registrySource = readFileSync(path.join(process.cwd(), "src/context/ItemRegistryContext.jsx"), "utf8");
const serviceSource = readFileSync(path.join(process.cwd(), "src/services/usedMarket.js"), "utf8");
const transactionSource = readFileSync(path.join(process.cwd(), "src/services/transactions.js"), "utf8");
const sourceText = [transferSource, registrySource, serviceSource, transactionSource].join("\n");

for (const required of [
  "getRouteItemId",
  "Current Owner",
  "붙여넣기",
  "Transaction Price",
  "올바른 Ethereum 주소를 입력해주세요.",
  "Public 물품만 소유권 이전이 가능합니다.",
  "transferOwnershipOnChain",
  "contract.transferOwnership",
  "registry.transferOwnership",
  "트랜잭션이 취소되었습니다.",
  "소유권 이전 완료",
  "window.location.hash = `#/item/"
]) {
  assert.ok(sourceText.includes(required), `Missing Phase 6 implementation marker: ${required}`);
}

for (const forbidden of [
  "success page",
  "status =",
  "sold",
  "selling",
  "listedPrice ="
]) {
  assert.equal(sourceText.includes(forbidden), false, `Forbidden Phase 6 term found: ${forbidden}`);
}

assert.match(registrySource, /currentOwner: newOwner/);
assert.match(registrySource, /transactionPrice/);
assert.match(registrySource, /timestamp/);
assert.match(registrySource, /txHash/);

console.log("PASS: Phase 6 transfer ownership, validation, modal, and history checks passed.");
