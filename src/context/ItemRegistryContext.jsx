import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { connectedWallet, mockItems } from "../data/mockData.js";
import { getEthereum } from "../services/wallet.js";
import { fetchAllItems, isUsedMarketConfigured, registerItemOnChain } from "../services/usedMarket.js";
import { filterPublicItems } from "../utils/items.js";

const ItemRegistryContext = createContext(null);

function createLocalTxHash(itemId) {
  return `local-preview-${String(itemId).padStart(4, "0")}`;
}

export function ItemRegistryProvider({ children }) {
  const [items, setItems] = useState(mockItems);
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

  const value = useMemo(
    () => ({
      items,
      publicItems: filterPublicItems(items),
      isLoading,
      error,
      refreshItems,
      registerItem
    }),
    [items, isLoading, error]
  );

  return <ItemRegistryContext.Provider value={value}>{children}</ItemRegistryContext.Provider>;
}

export function useItemRegistry() {
  const context = useContext(ItemRegistryContext);
  if (!context) {
    throw new Error("useItemRegistry must be used within ItemRegistryProvider");
  }
  return context;
}
