import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { usedMarketAbi } from "../src/contracts/usedMarketAbi.js";
import { getDeploymentConfig, isSepoliaChain } from "../src/config/chain.js";

const root = process.cwd();

for (const file of [".env.example", ".env.local.example", "docs/demo-scenario.md", "src/components/RuntimeStatus.jsx"]) {
  assert.equal(existsSync(path.join(root, file)), true, `Missing Phase 8 readiness file: ${file}`);
}

const envExample = readFileSync(path.join(root, ".env.example"), "utf8");
for (const requiredEnv of ["SEPOLIA_RPC_URL=", "PRIVATE_KEY="]) {
  assert.ok(envExample.includes(requiredEnv), `Missing deployment env value: ${requiredEnv}`);
}

const frontendEnvExample = readFileSync(path.join(root, ".env.local.example"), "utf8");
for (const requiredEnv of [
  "VITE_USED_MARKET_CONTRACT_ADDRESS=",
  "VITE_SEPOLIA_CHAIN_ID=0xaa36a7",
  "VITE_CONTRACT_DEPLOY_BLOCK=0"
]) {
  assert.ok(frontendEnvExample.includes(requiredEnv), `Missing frontend env value: ${requiredEnv}`);
}

const deployment = getDeploymentConfig();
assert.equal(deployment.sepoliaChainId, "0xaa36a7");
assert.equal(isSepoliaChain("0xaa36a7"), true);

const abiText = usedMarketAbi.join("\n");
for (const signature of [
  "registerItem(string name,string description,uint256 listedPrice,string category,string imageUrl,bool isPublic)",
  "getAllItems()",
  "getItem(uint256 itemId)",
  "updateItem(uint256 itemId,string name,string description,uint256 listedPrice,string category,string imageUrl)",
  "setItemVisibility(uint256 itemId,bool isPublic)",
  "transferOwnership(uint256 itemId,address newOwner,uint256 transactionPrice)",
  "getTransactionHistory(uint256 itemId)",
  "OwnershipTransferred"
]) {
  assert.ok(abiText.includes(signature), `ABI missing expected signature: ${signature}`);
}

const sourceFiles = [
  "src/App.jsx",
  "src/pages/Home.jsx",
  "src/pages/Market.jsx",
  "src/pages/RegisterItem.jsx",
  "src/pages/MyItems.jsx",
  "src/pages/ItemDetail.jsx",
  "src/pages/TransactionHistory.jsx",
  "src/pages/TransferOwnership.jsx",
  "src/components/RuntimeStatus.jsx",
  "src/utils/ownership.js",
  "src/services/transactions.js"
].map((file) => readFileSync(path.join(root, file), "utf8"));
const sourceText = sourceFiles.join("\n");

for (const route of ["#/market", "#/register", "#/my-items", "#/item/1", "#/transactions", "#/transfer/1"]) {
  assert.ok(sourceText.includes(route), `Required route missing from app source: ${route}`);
}

for (const required of [
  "Runtime readiness",
  "Local preview",
  "Connect Wallet",
  "Transaction Hash",
  "Transfer Ownership",
  "Register Item",
  "조회 불가"
]) {
  assert.ok(sourceText.includes(required), `Missing integrated state marker: ${required}`);
}

for (const forbidden of [
  "Export CSV",
  "Filter By Date",
  "전체 기록 불러오기",
  "Gas Fee",
  "USD",
  "selling",
  "sold",
  "판매중",
  "판매완료",
  "Authenticated",
  "Verified Digital Certificate"
]) {
  assert.equal(sourceText.includes(forbidden), false, `Forbidden final UI term found: ${forbidden}`);
}

const scenario = readFileSync(path.join(root, "docs/demo-scenario.md"), "utf8");
for (const step of [
  "Connect MetaMask on Sepolia",
  "Register a Public item",
  "Open Market",
  "Open Item Detail",
  "Transfer ownership",
  "Open My Items",
  "Open Transaction History"
]) {
  assert.ok(scenario.includes(step), `Demo scenario missing step: ${step}`);
}

console.log("PASS: Phase 8 readiness, env, ABI, final UI, and demo scenario checks passed.");


