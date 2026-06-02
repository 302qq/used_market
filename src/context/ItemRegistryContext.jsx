import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { connectedWallet, mockItems, mockTransactions } from "../data/mockData.js";
import { getEthereum } from "../services/wallet.js";
import {
  fetchAllItems,
  fetchTransactionHistory,
  isUsedMarketConfigured,
  registerItemOnChain,
  setItemVisibilityOnChain,
  transferOwnershipOnChain,
  updateItemOnChain
} from "../services/usedMarket.js";
import { filterPublicItems } from "../utils/items.js";

const ItemRegistryContext = createContext(null);

function createLocalTxHash(itemId) {
  return `local-preview-${String(itemId).padStart(4, "0")}`;
}

function createTransferTxHash(itemId, count) {
  return `local-transfer-${String(itemId).padStart(4, "0")}-${String(count).padStart(2, "0")}`;
}

export function ItemRegistryProvider({ children }) {
  const [items, setItems] = useState(mockItems);
  const [transactionHistories, setTransactionHistories] = useState(() =>
    mockTransactions.reduce((histories, record) => {
      const key = Number(record.itemId);
      histories[key] = [...(histories[key] || []), record];
      return histories;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function refreshItems() {
    if (!isUsedMarketConfigured()) return items;

    setIsLoading(true);
    setError("");
    try {
      const latestItems = await fetchAllItems(getEthereum());
      setItems(latestItems);
      return latestItems;
    } catch (refreshError) {
      setError(refreshError.message || "물품 목록을 불러오지 못했습니다.");
      return items;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshItems();
  }, []);

  async function registerItem(form, wallet) {
    setError("");

    if (isUsedMarketConfigured()) {
      if (!wallet.account) {
        throw new Error("MetaMask 지갑을 먼저 연결해주세요.");
      }
      if (!wallet.isSepolia) {
        throw new Error("Sepolia 네트워크로 전환해주세요.");
      }
      const result = await registerItemOnChain(getEthereum(), form);
      await refreshItems();
      return {
        itemId: result.itemId,
        owner: wallet.account,
        txHash: result.txHash,
        mode: "chain"
      };
    }

    const nextId = items.reduce((maxId, item) => Math.max(maxId, Number(item.itemId)), 0) + 1;
    const previewItem = {
      itemId: nextId,
      name: form.name.trim(),
      description: form.description.trim(),
      listedPrice: `${form.listedPrice.trim()} ETH`,
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      currentOwner: wallet.account || connectedWallet,
      isPublic: form.isPublic === "Public",
      createdAt: Date.now()
    };

    setItems((current) => [previewItem, ...current]);
    return {
      itemId: nextId,
      owner: previewItem.currentOwner,
      txHash: createLocalTxHash(nextId),
      mode: "preview"
    };
  }

  function getItemById(itemId) {
    return items.find((item) => Number(item.itemId) === Number(itemId));
  }

  async function getTransactionHistory(itemId) {
    if (isUsedMarketConfigured()) {
      try {
        const records = await fetchTransactionHistory(getEthereum(), itemId);
        setTransactionHistories((current) => ({ ...current, [Number(itemId)]: records }));
        return records;
      } catch (historyError) {
        setError(historyError.message || "거래 이력을 불러오지 못했습니다.");
      }
    }

    return transactionHistories[Number(itemId)] || [];
  }

  async function refreshAllTransactionHistories() {
    if (!isUsedMarketConfigured()) return transactionHistories;

    const entries = await Promise.all(
      items.map(async (item) => {
        const records = await fetchTransactionHistory(getEthereum(), item.itemId);
        return [Number(item.itemId), records];
      })
    );
    const nextHistories = Object.fromEntries(entries);
    setTransactionHistories(nextHistories);
    return nextHistories;
  }

  async function setItemVisibility(itemId, isPublic, wallet) {
    const item = getItemById(itemId);
    if (!item) throw new Error("물품을 찾을 수 없습니다.");
    if (!isOwner(item, wallet)) throw new Error("현재 소유자만 공개 여부를 변경할 수 있습니다.");

    if (isUsedMarketConfigured()) {
      await setItemVisibilityOnChain(getEthereum(), itemId, isPublic);
      await refreshItems();
    } else {
      setItems((current) =>
        current.map((currentItem) =>
          Number(currentItem.itemId) === Number(itemId) ? { ...currentItem, isPublic } : currentItem
        )
      );
    }
  }

  async function updateItem(itemId, form, wallet) {
    const item = getItemById(itemId);
    const history = transactionHistories[Number(itemId)] || [];

    if (!item) throw new Error("물품을 찾을 수 없습니다.");
    if (!isOwner(item, wallet)) throw new Error("현재 소유자만 물품 정보를 수정할 수 있습니다.");
    if (history.length > 0) throw new Error("소유권 이전 이력이 있는 물품은 정보를 수정할 수 없습니다.");

    if (isUsedMarketConfigured()) {
      await updateItemOnChain(getEthereum(), itemId, form);
      await refreshItems();
    } else {
      setItems((current) =>
        current.map((currentItem) =>
          Number(currentItem.itemId) === Number(itemId)
            ? {
                ...currentItem,
                name: form.name.trim(),
                description: form.description.trim(),
                listedPrice: `${form.listedPrice.trim()} ETH`,
                category: form.category,
                imageUrl: form.imageUrl.trim()
              }
            : currentItem
        )
      );
    }
  }

  async function transferOwnership(itemId, newOwner, transactionPrice, wallet) {
    const item = getItemById(itemId);
    const activeAccount = wallet?.account || connectedWallet;

    if (!item) throw new Error("물품을 찾을 수 없습니다.");
    if (!isOwner(item, wallet)) throw new Error("현재 소유자만 소유권을 이전할 수 있습니다.");
    if (!item.isPublic) throw new Error("Public 물품만 소유권 이전이 가능합니다.");

    if (isUsedMarketConfigured()) {
      if (!wallet.account) throw new Error("MetaMask 지갑을 먼저 연결해주세요.");
      if (!wallet.isSepolia) throw new Error("Sepolia 네트워크로 전환해주세요.");

      const result = await transferOwnershipOnChain(getEthereum(), itemId, newOwner, transactionPrice);
      await refreshItems();
      await getTransactionHistory(itemId);
      return {
        from: activeAccount,
        to: newOwner,
        transactionPrice: `${transactionPrice.trim()} ETH`,
        txHash: result.hash,
        mode: "chain"
      };
    }

    const existingHistory = transactionHistories[Number(itemId)] || [];
    const record = {
      id: `${itemId}-${existingHistory.length}`,
      itemId: Number(itemId),
      itemName: item.name,
      date: new Date().toLocaleString("ko-KR"),
      from: activeAccount,
      to: newOwner,
      transactionPrice: `${transactionPrice.trim()} ETH`,
      timestamp: Math.floor(Date.now() / 1000),
      txHash: createTransferTxHash(itemId, existingHistory.length + 1)
    };

    setItems((current) =>
      current.map((currentItem) =>
        Number(currentItem.itemId) === Number(itemId) ? { ...currentItem, currentOwner: newOwner } : currentItem
      )
    );
    setTransactionHistories((current) => ({
      ...current,
      [Number(itemId)]: [...(current[Number(itemId)] || []), record]
    }));

    return {
      from: activeAccount,
      to: newOwner,
      transactionPrice: record.transactionPrice,
      txHash: record.txHash,
      mode: "preview"
    };
  }

  const value = useMemo(
    () => ({
      items,
      publicItems: filterPublicItems(items),
      transactionHistories,
      isLoading,
      error,
      refreshItems,
      registerItem,
      getItemById,
      getTransactionHistory,
      refreshAllTransactionHistories,
      setItemVisibility,
      updateItem,
      transferOwnership
    }),
    [items, transactionHistories, isLoading, error]
  );

  return <ItemRegistryContext.Provider value={value}>{children}</ItemRegistryContext.Provider>;
}

export function isOwner(item, wallet) {
  const activeAccount = wallet?.account;
  return Boolean(item?.currentOwner && activeAccount && item.currentOwner.toLowerCase() === activeAccount.toLowerCase());
}

export function useItemRegistry() {
  const context = useContext(ItemRegistryContext);
  if (!context) {
    throw new Error("useItemRegistry must be used within ItemRegistryProvider");
  }
  return context;
}
