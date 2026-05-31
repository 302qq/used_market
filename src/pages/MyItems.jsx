import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useItemRegistry } from "../context/ItemRegistryContext.jsx";
import { useWallet } from "../context/WalletContext.jsx";
import { getOwnedItems, getTransferredItems } from "../utils/ownership.js";
import { shortenAddress } from "../utils/format.js";

export default function MyItems() {
  const wallet = useWallet();
  const registry = useItemRegistry();
  const [tab, setTab] = useState("Owned");

  useEffect(() => {
    registry.refreshAllTransactionHistories();
  }, [wallet.account, registry.items.length]);

  const ownedItems = useMemo(() => {
    return getOwnedItems(registry.items, wallet.account);
  }, [registry.items, wallet.account]);

  const transferredItems = useMemo(() => {
    return getTransferredItems(registry.items, registry.transactionHistories, wallet.account);
  }, [registry.items, registry.transactionHistories, wallet.account]);

  const items = tab === "Owned" ? ownedItems : transferredItems;

  if (!wallet.account) {
    return (
      <EmptyState
        title="지갑 연결이 필요합니다."
        description="My Items는 현재 연결된 지갑 주소를 기준으로 Owned와 Transferred를 계산합니다."
      />
    );
  }

  return (
    <div className="pageStack">
      <section className="pageTitle">
        <p className="eyebrow">Wallet inventory</p>
        <h2>My Items</h2>
        <p>현재 소유 중인 물품과 과거 이전한 물품을 탭으로 분리해 확인합니다.</p>
      </section>

      <div className="tabBar" role="tablist">
        {["Owned", "Transferred"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      {items.length ? (
        <div className="listPanel">
          {items.map((item) => (
            <article className="listRow" key={item.itemId}>
              <img src={item.imageUrl} alt="" />
              <div>
                <span className="categoryTag">{item.category}</span>
                <h3>{item.name}</h3>
                <p>Listed Price {item.listedPrice}</p>
                <p>Current Owner {shortenAddress(item.currentOwner)}</p>
              </div>
              <div className="rowActions">
                <a href={`#/item/${item.itemId}`}>
                  <Button variant="secondary">Detail</Button>
                </a>
                {tab === "Owned" && item.isPublic ? (
                  <a href={`#/transfer/${item.itemId}`}>
                    <Button>Transfer</Button>
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`${tab} 항목이 없습니다.`}
          description="현재 연결된 지갑 기준으로 표시할 물품이 없습니다."
          action={
            <a href="#/market">
              <Button variant="secondary">Market으로 이동</Button>
            </a>
          }
        />
      )}
    </div>
  );
}
