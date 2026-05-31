import EmptyState from "../components/EmptyState.jsx";
import { connectedWallet, mockTransactions } from "../data/mockData.js";
import { shortenAddress } from "../utils/format.js";

export default function TransactionHistory() {
  const records = mockTransactions.filter((record) => {
    const wallet = connectedWallet.toLowerCase();
    return record.from.toLowerCase() === wallet || record.to.toLowerCase() === wallet;
  });

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
                <span>{record.date}</span>
                <span>{shortenAddress(record.from)}</span>
                <span>{shortenAddress(record.to)}</span>
                <strong>{record.transactionPrice}</strong>
                <span>{record.txHash}</span>
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
