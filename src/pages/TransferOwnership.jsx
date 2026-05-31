import { useState } from "react";
import Button from "../components/Button.jsx";
import Modal from "../components/Modal.jsx";
import TextInput from "../components/TextInput.jsx";
import Toast from "../components/Toast.jsx";
import { mockItems } from "../data/mockData.js";
import { isEthereumAddress, shortenAddress } from "../utils/format.js";

export default function TransferOwnership() {
  const item = mockItems[0];
  const [newOwner, setNewOwner] = useState("");
  const [price, setPrice] = useState("");
  const [toast, setToast] = useState("");
  const [complete, setComplete] = useState(null);
  const hasAddressError = newOwner.length > 0 && !isEthereumAddress(newOwner);
  const canSubmit = isEthereumAddress(newOwner) && price.trim().length > 0;

  async function pasteAddress() {
    try {
      const text = await navigator.clipboard.readText();
      setNewOwner(text);
    } catch {
      setToast("클립보드 내용을 읽을 수 없습니다.");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    setComplete({
      newOwner,
      transactionPrice: price,
      txHash: "0x5f22...a91b"
    });
  }

  return (
    <div className="pageStack">
      <Toast message={toast} type="warning" />
      <section className="pageTitle">
        <p className="eyebrow">Transfer ownership</p>
        <h2>Transfer Ownership</h2>
        <p>현재 소유자가 새 소유자 지갑 주소와 Transaction Price를 입력하는 화면입니다.</p>
      </section>

      <section className="splitLayout">
        <form className="panel formPanel" onSubmit={handleSubmit}>
          <div className="summaryBox">
            <span className="categoryTag">{item.category}</span>
            <h3>{item.name}</h3>
            <p>Listed Price {item.listedPrice}</p>
          </div>
          <div className="fieldWithAction">
            <TextInput
              label="새 소유자 지갑 주소"
              value={newOwner}
              onChange={(event) => setNewOwner(event.target.value)}
              error={hasAddressError ? "올바른 Ethereum 주소를 입력해주세요." : ""}
              placeholder="0x..."
            />
            <Button type="button" variant="secondary" onClick={pasteAddress}>
              붙여넣기
            </Button>
          </div>
          <TextInput
            label="실제 거래 가격 (Transaction Price)"
            placeholder="0.00 ETH"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
          <Button type="submit" className="wide" disabled={!canSubmit}>
            Transfer Ownership
          </Button>
        </form>

        <aside className="panel">
          <h3>처리 기준</h3>
          <p>소유권 이전은 Public 물품과 현재 소유자 권한을 기준으로 후속 Phase에서 검증됩니다.</p>
          <p>MetaMask 승인 거부는 토스트 메시지로 표시하는 정책을 유지합니다.</p>
        </aside>
      </section>

      <Modal open={Boolean(complete)} title="소유권 이전 완료" onClose={() => (window.location.hash = `#/item/${item.itemId}`)}>
        {complete ? (
          <div className="completeBox modalComplete">
            <dl>
              <div>
                <dt>새 소유자</dt>
                <dd>{shortenAddress(complete.newOwner)}</dd>
              </div>
              <div>
                <dt>거래 가격</dt>
                <dd>{complete.transactionPrice}</dd>
              </div>
              <div>
                <dt>Transaction Hash</dt>
                <dd>{complete.txHash}</dd>
              </div>
            </dl>
            <Button className="wide" onClick={() => (window.location.hash = `#/item/${item.itemId}`)}>
              확인
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
