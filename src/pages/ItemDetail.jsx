import Button from "../components/Button.jsx";
import { connectedWallet, mockItems, mockTransactions } from "../data/mockData.js";
import { shortenAddress } from "../utils/format.js";

export default function ItemDetail() {
  const item = mockItems[0];
  const records = mockTransactions.filter((record) => record.itemId === item.itemId).slice(0, 5);
  const isOwner = item.currentOwner.toLowerCase() === connectedWallet.toLowerCase();

  return (
    <div className="pageStack">
      <section className="detailLayout">
        <div className="detailImage">
          <img src={item.imageUrl} alt="" />
        </div>
        <div className="detailInfo">
          <span className="categoryTag">{item.category}</span>
          <h2>{item.name}</h2>
          <dl className="detailFacts">
            <div>
              <dt>Listed Price</dt>
              <dd>{item.listedPrice}</dd>
            </div>
            <div>
              <dt>Current Owner</dt>
              <dd>{shortenAddress(item.currentOwner)}</dd>
            </div>
          </dl>
          <p>{item.description}</p>
          <div className="inlineActions">
            {isOwner ? (
              <a href={`#/transfer/${item.itemId}`}>
                <Button>소유권 이전</Button>
              </a>
            ) : null}
            {isOwner ? <Button variant="secondary">Public / Private 전환</Button> : null}
            <a href="#/market">
              <Button variant="ghost">Market</Button>
            </a>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Recent transaction records</p>
            <h2>거래 이력</h2>
          </div>
          <a href="#/transactions">전체 거래 이력 보기 →</a>
        </div>
        <div className="tableLike">
          <div className="tableHead">
            <span>Date</span>
            <span>From</span>
            <span>To</span>
            <span>Transaction Price</span>
          </div>
          {records.map((record) => (
            <div className="tableRow" key={record.id}>
              <span>{record.date}</span>
              <span>{shortenAddress(record.from)}</span>
              <span>{shortenAddress(record.to)}</span>
              <strong>{record.transactionPrice}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
