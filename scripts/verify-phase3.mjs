import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { isSepoliaChain, normalizeChainId } from "../src/config/chain.js";
import { shortenAddress } from "../src/utils/format.js";
import { ethToWei, formatEthLabel, weiToEth } from "../src/utils/price.js";
import {
  connectWallet,
  getWalletMessage,
  isMetaMaskInstalled,
  isUserRejectedRequest,
  subscribeWalletEvents,
  WALLET_ERROR
} from "../src/services/wallet.js";
import { shortenTxHash, waitForTransaction, getTransactionErrorMessage } from "../src/services/transactions.js";

function createMockEthereum({ accounts = ["0x1234567890abcdef1234567890abcdef12345678"], chainId = "0xaa36a7" } = {}) {
  const listeners = new Map();
  return {
    isMetaMask: true,
    requests: [],
    on(event, handler) {
      listeners.set(event, handler);
    },
    removeListener(event) {
      listeners.delete(event);
    },
    emit(event, payload) {
      listeners.get(event)?.(payload);
    },
    listenerCount() {
      return listeners.size;
    },
    async request(payload) {
      this.requests.push(payload);
      if (payload.method === "eth_requestAccounts") return accounts;
      if (payload.method === "eth_accounts") return accounts;
      if (payload.method === "eth_chainId") return chainId;
      throw new Error(`Unexpected method: ${payload.method}`);
    }
  };
}

assert.equal(normalizeChainId(11155111), "0xaa36a7");
assert.equal(normalizeChainId(11155111n), "0xaa36a7");
assert.equal(isSepoliaChain("0xaa36a7"), true);
assert.equal(isSepoliaChain("0x1"), false);

assert.equal(shortenAddress("0x1234567890abcdef1234567890abcdef12345678"), "0x1234...5678");
assert.equal(ethToWei("0.18").toString(), "180000000000000000");
assert.equal(weiToEth(180000000000000000n), "0.18");
assert.equal(formatEthLabel(1000000000000000000n), "1 ETH");

const ethereum = createMockEthereum();
assert.equal(isMetaMaskInstalled(ethereum), true);
const connected = await connectWallet(ethereum);
assert.equal(connected.account, "0x1234567890abcdef1234567890abcdef12345678");
assert.equal(connected.isSepolia, true);
assert.deepEqual(ethereum.requests.map((request) => request.method), ["eth_requestAccounts", "eth_chainId"]);

let changedAccount = "";
let changedChain = "";
const cleanup = subscribeWalletEvents(ethereum, {
  onAccountsChanged: (accounts) => {
    changedAccount = accounts[0];
  },
  onChainChanged: (chainId) => {
    changedChain = chainId;
  }
});
ethereum.emit("accountsChanged", ["0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"]);
ethereum.emit("chainChanged", "0x1");
assert.equal(changedAccount, "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd");
assert.equal(changedChain, "0x1");
cleanup();
assert.equal(ethereum.listenerCount(), 0);

const rejectedError = { code: 4001 };
assert.equal(isUserRejectedRequest(rejectedError), true);
assert.equal(getWalletMessage(rejectedError), "트랜잭션이 취소되었습니다.");
assert.equal(getWalletMessage({ code: WALLET_ERROR.NOT_INSTALLED }), "MetaMask가 설치되어 있지 않습니다.");
assert.equal(getWalletMessage({ code: WALLET_ERROR.WRONG_NETWORK }), "Sepolia 네트워크로 전환해주세요.");

assert.equal(shortenTxHash("0x1234567890abcdef1234567890abcdef"), "0x123456...abcdef");
const waited = await waitForTransaction({
  hash: "0x1234",
  wait: async (confirmations) => ({ status: 1, confirmations })
});
assert.equal(waited.hash, "0x1234");
assert.equal(waited.receipt.confirmations, 1);
assert.equal(getTransactionErrorMessage(rejectedError), "트랜잭션이 취소되었습니다.");

const sourceFiles = [
  "src/config/chain.js",
  "src/services/wallet.js",
  "src/services/contracts.js",
  "src/context/WalletContext.jsx",
  "src/utils/price.js"
].map((file) => readFileSync(path.join(process.cwd(), file), "utf8"));
const sourceText = sourceFiles.join("\n");

for (const forbidden of ["privateKey", "seed phrase", "mnemonic", "password"]) {
  assert.equal(sourceText.includes(forbidden), false, `Forbidden secret handling term found: ${forbidden}`);
}

assert.match(sourceText, /BrowserProvider/);
assert.match(sourceText, /getReadOnlyUsedMarketContract/);
assert.match(sourceText, /getSignerUsedMarketContract/);
assert.match(sourceText, /VITE_USED_MARKET_CONTRACT_ADDRESS/);
assert.match(sourceText, /VITE_SEPOLIA_CHAIN_ID/);
assert.match(sourceText, /VITE_CONTRACT_DEPLOY_BLOCK/);

console.log("PASS: Phase 3 wallet, network, price conversion, tx wait, and source checks passed.");
