import React, { useEffect, useMemo } from "react";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useItemRegistry } from "../context/ItemRegistryContext.jsx";
import { useWallet } from "../context/WalletContext.jsx";
import { shortenAddress } from "../utils/format.js";
import { formatTransactionDate, getParticipatingTransactions, getTxHashLabel } from "../utils/ownership.js";

export default function TransactionHistory() {
  const wallet = useWallet();
  const registry = useItemRegistry();

  useEffect(() => {
    registry.refreshAllTransactionHistories();
  }, [wallet.account, registry.items.length]);

  const records = useMemo(() => {
    return getParticipatingTransactions(registry.items, registry.transactionHistories, wallet.account);
  }, [registry.items, registry.transactionHistories, wallet.account]);

  if (!wallet.account) {
    return (
      <EmptyState
        title="지갑 연결이 필요합니다."
        description="Transaction History는 현재 연결된 지갑이 참여한 거래만 표시합니다."
        action={
          <Button variant="secondary" onClick={wallet.connect}>
            Connect Wallet
          </Button>
        }
      />
    );
  }

  return (
    <div className="pageStack">
      <section className="pageTitle">
        <p className="eyebrow">My participation records</p>
        <h2>Transaction History</h2>
        <p>현재 연결된 지갑이 이전 소유자 또는 새로운 소유자로 포함된 거래만 표시합니다.</p>
      </section>

      {records.length ? (
        <section className="panel">
          <div className="tableLike transactions">
            <div className="tableHead">
              <span>물품명</span>
              <span>거래 날짜</span>
              <span>이전 소유자</span>
              <span>새로운 소유자</span>
              <span>Transaction Price</span>
              <span>Tx Hash</span>
            </div>
            {records.map((record) => (
              <a className="tableRow" href={`#/item/${record.itemId}`} key={record.id}>
                <span>{record.itemName}</span>
                <span>{formatTransactionDate(record)}</span>
                <span>{shortenAddress(record.from)}</span>
                <span>{shortenAddress(record.to)}</span>
                <strong>{record.transactionPrice}</strong>
                <span>{getTxHashLabel(record)}</span>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState title="거래 이력이 없습니다." description="현재 지갑이 포함된 거래 기록이 없습니다." />
      )}
    </div>
  );
}
