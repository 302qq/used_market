import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSepoliaChain, normalizeChainId } from "../config/chain.js";
import {
  connectWallet,
  getAccounts,
  getCurrentChainId,
  getEthereum,
  getSelectedWalletAddress,
  getWalletMessage,
  isMetaMaskInstalled,
  subscribeWalletEvents
} from "../services/wallet.js";

const WalletContext = createContext(null);
const WALLET_DISCONNECTED_KEY = "chaintrust.wallet.disconnected";
const WALLET_STORAGE_PATTERNS = ["wallet", "metamask", "chaintrust"];

const initialState = {
  account: "",
  chainId: "",
  isInstalled: false,
  isConnecting: false,
  message: ""
};

function hasStoredDisconnect() {
  try {
    return window.localStorage.getItem(WALLET_DISCONNECTED_KEY) === "true";
  } catch {
    return false;
  }
}

function setStoredDisconnect(value) {
  try {
    if (value) {
      window.localStorage.setItem(WALLET_DISCONNECTED_KEY, "true");
    } else {
      window.localStorage.removeItem(WALLET_DISCONNECTED_KEY);
      window.sessionStorage.removeItem(WALLET_DISCONNECTED_KEY);
    }
  } catch {
    // Storage can be unavailable in restricted browser modes.
  }
}

function clearWalletStorageState() {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    try {
      const keys = [];
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key && WALLET_STORAGE_PATTERNS.some((pattern) => key.toLowerCase().includes(pattern))) {
          keys.push(key);
        }
      }
      keys.forEach((key) => storage.removeItem(key));
    } catch {
      // Ignore inaccessible storage and keep the in-memory disconnect behavior.
    }
  }
}

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(initialState);
  const [isManuallyDisconnected, setIsManuallyDisconnected] = useState(() => hasStoredDisconnect());

  useEffect(() => {
    const ethereum = getEthereum();
    const installed = isMetaMaskInstalled(ethereum);

    async function hydrateWallet() {
      if (!installed) {
        setWallet((current) => ({
          ...current,
          isInstalled: false,
          message: "MetaMask가 설치되어 있지 않습니다."
        }));
        return;
      }

      const [accounts, currentChainId] = await Promise.all([getAccounts(ethereum), getCurrentChainId(ethereum)]);
      const chainId = normalizeChainId(currentChainId);
      const activeAccount = getSelectedWalletAddress(ethereum, accounts);
      setWallet((current) => ({
        ...current,
        account: isManuallyDisconnected ? "" : activeAccount,
        chainId,
        isInstalled: true,
        message: chainId && !isSepoliaChain(chainId) ? "Sepolia 네트워크로 전환해주세요." : current.message
      }));
    }

    hydrateWallet();

    return subscribeWalletEvents(ethereum, {
      onAccountsChanged: (accounts) => {
        const activeAccount = getSelectedWalletAddress(ethereum, accounts);
        setWallet((current) => ({
          ...current,
          account: isManuallyDisconnected ? "" : activeAccount,
          message: activeAccount
            ? isManuallyDisconnected
              ? "MetaMask 계정이 변경되었습니다. 다시 Connect Wallet을 눌러 연결해주세요."
              : current.message
            : "지갑 연결이 해제되었습니다."
        }));
      },
      onChainChanged: (currentChainId) => {
        const chainId = normalizeChainId(currentChainId);
        setWallet((current) => ({
          ...current,
          chainId,
          message: isSepoliaChain(chainId) ? "" : "Sepolia 네트워크로 전환해주세요."
        }));
      }
    });
  }, [isManuallyDisconnected]);

  async function connect() {
    const ethereum = getEthereum();
    setWallet((current) => ({ ...current, isConnecting: true, message: "" }));

    try {
      const result = await connectWallet(ethereum);
      const chainId = normalizeChainId(result.chainId);
      setStoredDisconnect(false);
      setIsManuallyDisconnected(false);
      setWallet((current) => ({
        ...current,
        account: result.account,
        chainId,
        isInstalled: true,
        isConnecting: false,
        message: isSepoliaChain(chainId) ? "" : "Sepolia 네트워크로 전환해주세요."
      }));
      return { ...result, chainId, isSepolia: isSepoliaChain(chainId) };
    } catch (error) {
      setWallet((current) => ({
        ...current,
        isConnecting: false,
        isInstalled: isMetaMaskInstalled(ethereum),
        message: getWalletMessage(error)
      }));
      throw error;
    }
  }

  async function disconnect() {
    const ethereum = getEthereum();
    clearWalletStorageState();
    setStoredDisconnect(true);
    setIsManuallyDisconnected(true);

    let chainId = wallet.chainId;
    try {
      chainId = normalizeChainId(await getCurrentChainId(ethereum));
    } catch {
      // Keep the last known chain id when MetaMask is unavailable.
    }

    setWallet((current) => ({
      ...current,
      account: "",
      chainId,
      isConnecting: false,
      isInstalled: isMetaMaskInstalled(ethereum),
      message: "앱 내부 지갑 연결 상태가 해제되었습니다."
    }));
  }

  const value = useMemo(
    () => ({
      ...wallet,
      isSepolia: isSepoliaChain(wallet.chainId),
      connect,
      disconnect
    }),
    [wallet]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}
