import Button from "../components/Button.jsx";
import ItemCard from "../components/ItemCard.jsx";
import { mockItems } from "../data/mockData.js";

export default function Home() {
  const recentItems = mockItems.slice(0, 3);

  return (
    <div className="pageStack">
      <section className="heroBanner">
        <div>
          <p className="eyebrow">Digital ownership trail</p>
          <h2>한정판·희귀품의 소유권 이력을 블록체인에 기록합니다.</h2>
          <p>
            외부 거래 이후 ChainTrust에서 물품 등록, 소유권 이전, 거래 이력 조회 흐름을 확인하는
            Sepolia 기반 MVP입니다.
          </p>
        </div>
        <div className="heroActions">
          <a href="#/market">
            <Button>시작하기</Button>
          </a>
          <a href="#/register">
            <Button variant="secondary">아이템 등록</Button>
          </a>
        </div>
      </section>

      <section className="quickGrid">
        <a className="quickTile" href="#/market">
          <span>마켓 둘러보기</span>
          <strong>공개 물품 탐색</strong>
        </a>
        <a className="quickTile" href="#/register">
          <span>아이템 등록</span>
          <strong>이력 기록 시작</strong>
        </a>
        <a className="quickTile" href="#/my-items">
          <span>내 가방</span>
          <strong>Owned / Transferred</strong>
        </a>
        <a className="quickTile" href="#/transactions">
          <span>거래 내역</span>
          <strong>내가 참여한 기록</strong>
        </a>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Recently registered</p>
            <h2>최근 등록 물품</h2>
          </div>
          <a href="#/market">전체 보기 →</a>
        </div>
        <div className="cardGrid compact">
          {recentItems.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
