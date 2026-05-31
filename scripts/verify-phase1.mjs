import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/main.jsx",
  "src/App.jsx",
  "src/styles.css",
  "src/components/AppShell.jsx",
  "src/components/Button.jsx",
  "src/components/EmptyState.jsx",
  "src/components/Modal.jsx",
  "src/components/TextInput.jsx",
  "src/components/Toast.jsx",
  "src/pages/Home.jsx",
  "src/pages/Market.jsx",
  "src/pages/RegisterItem.jsx",
  "src/pages/MyItems.jsx",
  "src/pages/ItemDetail.jsx",
  "src/pages/TransactionHistory.jsx",
  "src/pages/TransferOwnership.jsx"
];

const requiredRoutes = [
  "#/",
  "#/market",
  "#/register",
  "#/my-items",
  "#/item/1",
  "#/transactions",
  "#/transfer/1"
];

const excludedSourceTerms = [
  "IPFS",
  "Certificate",
  "Ownership Record",
  "Authenticated",
  "VERIFIED DIGITAL CERTIFICATE",
  "Export CSV",
  "Filter By Date",
  "Gas Fee",
  "USD",
  "달러",
  "장바구니",
  "가방 아이콘",
  "selling",
  "sold",
  "판매중",
  "판매완료"
];

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    fail(`Missing required file: ${file}`);
  }
}

const appSource = readFileSync(path.join(root, "src/App.jsx"), "utf8");
for (const route of requiredRoutes) {
  if (!appSource.includes(route)) {
    fail(`Missing route entry: ${route}`);
  }
}

function collectFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    return stat.isDirectory() ? collectFiles(fullPath) : [fullPath];
  });
}

const sourceText = collectFiles(path.join(root, "src"))
  .filter((file) => /\.(jsx|js|css)$/.test(file))
  .map((file) => readFileSync(file, "utf8"))
  .join("\n");

for (const term of excludedSourceTerms) {
  if (sourceText.includes(term)) {
    fail(`Excluded UI or stale term found in src: ${term}`);
  }
}

if (!sourceText.includes("패션") || !sourceText.includes("악세사리") || !sourceText.includes("기타")) {
  fail("Required category labels are not present.");
}

if (!sourceText.includes("Tx Hash")) {
  fail("Transaction History must display Tx Hash.");
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("PASS: Phase 1 route, component, excluded UI, and baseline display checks passed.");
