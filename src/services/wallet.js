import { BrowserProvider } from "ethers";
import { isSepoliaChain } from "../config/chain.js";

export const WALLET_ERROR = {
  NOT_INSTALLED: "METAMASK_NOT_INSTALLED",
  USER_REJECTED: "USER_REJECTED",
  WRONG_NETWORK: "WRONG_NETWORK"
};

export function getEthereum() {
  return typeof window !== "undefined" ? window.ethereum : undefined;
}

export function isMetaMaskInstalled(ethereum = getEthereum()) {
  return Boolean(ethereum?.isMetaMask);
}

export function isUserRejectedRequest(error) {
  return error?.code === 4001 || error?.code === "ACTION_REJECTED";
}

export function getWalletMessage(error) {
  if (error?.code === WALLET_ERROR.NOT_INSTALLED) {
    return "MetaMask가 설치되어 있지 않습니다.";
  }
  if (error?.code === WALLET_ERROR.WRONG_NETWORK) {
    return "Sepolia 네트워크로 전환해주세요.";
  }
  if (isUserRejectedRequest(error)) {
    return "트랜잭션이 취소되었습니다.";
  }
  return "지갑 연결 중 문제가 발생했습니다.";
}

export async function requestAccounts(ethereum = getEthereum()) {
  if (!isMetaMaskInstalled(ethereum)) {
    throw Object.assign(new Error("MetaMask is not installed"), { code: WALLET_ERROR.NOT_INSTALLED });
  }
  return ethereum.request({ method: "eth_requestAccounts" });
}

export async function getAccounts(ethereum = getEthereum()) {
  if (!isMetaMaskInstalled(ethereum)) return [];
  return ethereum.request({ method: "eth_accounts" });
}

export async function getCurrentChainId(ethereum = getEthereum()) {
  if (!isMetaMaskInstalled(ethereum)) return "";
  return ethereum.request({ method: "eth_chainId" });
}

export function createBrowserProvider(ethereum = getEthereum()) {
  if (!isMetaMaskInstalled(ethereum)) {
    throw Object.assign(new Error("MetaMask is not installed"), { code: WALLET_ERROR.NOT_INSTALLED });
  }
  return new BrowserProvider(ethereum);
}

export async function connectWallet(ethereum = getEthereum()) {
  const accounts = await requestAccounts(ethereum);
  const chainId = await getCurrentChainId(ethereum);

  return {
    account: accounts[0] || "",
    accounts,
    chainId,
    isSepolia: isSepoliaChain(chainId)
  };
}

export function subscribeWalletEvents(ethereum, handlers = {}) {
  if (!ethereum?.on) return () => {};

  const handleAccountsChanged = (accounts) => handlers.onAccountsChanged?.(accounts);
  const handleChainChanged = (chainId) => handlers.onChainChanged?.(chainId);

  ethereum.on("accountsChanged", handleAccountsChanged);
  ethereum.on("chainChanged", handleChainChanged);

  return () => {
    ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
    ethereum.removeListener?.("chainChanged", handleChainChanged);
  };
}
