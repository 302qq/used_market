import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSepoliaChain } from "../config/chain.js";
import {
  connectWallet,
  getAccounts,
  getCurrentChainId,
  getEthereum,
  getWalletMessage,
  isMetaMaskInstalled,
  subscribeWalletEvents
} from "../services/wallet.js";

const WalletContext = createContext(null);

const initialState = {
  account: "",
  chainId: "",
  isInstalled: false,
  isConnecting: false,
  message: ""
};

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(initialState);

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

      const [accounts, chainId] = await Promise.all([getAccounts(ethereum), getCurrentChainId(ethereum)]);
      setWallet((current) => ({
        ...current,
        account: accounts[0] || "",
        chainId,
        isInstalled: true,
        message: chainId && !isSepoliaChain(chainId) ? "Sepolia 네트워크로 전환해주세요." : ""
      }));
    }

    hydrateWallet();

    return subscribeWalletEvents(ethereum, {
      onAccountsChanged: (accounts) => {
        setWallet((current) => ({
          ...current,
          account: accounts[0] || "",
          message: accounts[0] ? current.message : "지갑 연결이 해제되었습니다."
        }));
      },
      onChainChanged: (chainId) => {
        setWallet((current) => ({
          ...current,
          chainId,
          message: isSepoliaChain(chainId) ? "" : "Sepolia 네트워크로 전환해주세요."
        }));
      }
    });
  }, []);

  async function connect() {
    const ethereum = getEthereum();
    setWallet((current) => ({ ...current, isConnecting: true, message: "" }));

    try {
      const result = await connectWallet(ethereum);
      setWallet((current) => ({
        ...current,
        account: result.account,
        chainId: result.chainId,
        isInstalled: true,
        isConnecting: false,
        message: result.isSepolia ? "" : "Sepolia 네트워크로 전환해주세요."
      }));
      return result;
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

  const value = useMemo(
    () => ({
      ...wallet,
      isSepolia: isSepoliaChain(wallet.chainId),
      connect
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
