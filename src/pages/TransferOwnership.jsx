import React, { useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import TextInput from "../components/TextInput.jsx";
import Toast from "../components/Toast.jsx";
import { isOwner, useItemRegistry } from "../context/ItemRegistryContext.jsx";
import { useWallet } from "../context/WalletContext.jsx";
import { isEthereumAddress, shortenAddress } from "../utils/format.js";
import { ethToWei } from "../utils/price.js";
import { getTransactionErrorMessage } from "../services/transactions.js";
import { isUserRejectedRequest } from "../services/wallet.js";

function getRouteItemId() {
  const match = window.location.hash.match(/^#\/transfer\/(\d+)/);
  return match ? Number(match[1]) : 1;
}

function validateTransactionPrice(value) {
  try {
    ethToWei(value);
    return "";
  } catch {
    return "Transaction Price를 ETH 단위 숫자로 입력해주세요.";
  }
}

export default function TransferOwnership() {
  const wallet = useWallet();
  const registry = useItemRegistry();
  const itemId = getRouteItemId();
  const item = registry.getItemById(itemId);
  const [newOwner, setNewOwner] = useState("");
  const [price, setPrice] = useState("");
  const [toast, setToast] = useState("");
  const [complete, setComplete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasAddressError = newOwner.length > 0 && !isEthereumAddress(newOwner);
  const isSameOwner =
    isEthereumAddress(newOwner) && item?.currentOwner?.toLowerCase() === newOwner.trim().toLowerCase();
  const isZeroAddress = /^0x0{40}$/i.test(newOwner.trim());
  const addressError = hasAddressError
    ? "올바른 Ethereum 주소를 입력해주세요."
    : isZeroAddress
      ? "새 소유자 주소는 0x0 주소일 수 없습니다."
      : isSameOwner
        ? "새 소유자는 현재 소유자와 달라야 합니다."
        : "";
  const priceError = price.length > 0 ? validateTransactionPrice(price) : "";
  const owner = isOwner(item, wallet);

  const canSubmit = useMemo(() => {
    return Boolean(item?.isPublic && owner && isEthereumAddress(newOwner) && price.trim() && !addressError && !priceError && !isSubmitting);
  }, [item, owner, newOwner, price, addressError, priceError, isSubmitting]);

  async function pasteAddress() {
    try {
      const text = await navigator.clipboard.readText();
      setNewOwner(text.trim());
    } catch {
      setToast("클립보드 내용을 읽을 수 없습니다.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setToast("");
    try {
      const result = await registry.transferOwnership(item.itemId, newOwner.trim(), price.trim(), wallet);
      setComplete({
        from: result.from,
        newOwner: result.to,
        transactionPrice: result.transactionPrice,
        txHash: result.txHash
      });
    } catch (error) {
      setToast(isUserRejectedRequest(error) ? getTransactionErrorMessage(error) : error.message || getTransactionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToDetail() {
    window.location.hash = `#/item/${item?.itemId || itemId}`;
  }

  if (!item) {
    return (
      <EmptyState
        title="물품을 찾을 수 없습니다."
        description="등록되지 않은 Item ID입니다."
        action={<Button variant="secondary" onClick={() => (window.location.hash = "#/market")}>Market으로 이동</Button>}
      />
    );
  }

  if (!wallet.account) {
    return (
      <EmptyState
        title="지갑 연결이 필요합니다."
        description="Transfer Ownership은 현재 연결된 지갑이 물품의 현재 소유자인지 확인한 뒤 사용할 수 있습니다."
        action={
          <Button variant="secondary" onClick={wallet.connect}>
            Connect Wallet
          </Button>
        }
      />
    );
  }

  if (!owner) {
    return (
      <EmptyState
        title="접근할 수 없습니다."
        description="현재 소유자만 소유권 이전 화면에 접근할 수 있습니다."
        action={<Button variant="secondary" onClick={goToDetail}>Item Detail로 이동</Button>}
      />
    );
  }

  if (!item.isPublic) {
    return (
      <EmptyState
        title="Private 물품입니다."
        description="소유권 이전은 Public 물품만 가능합니다. 먼저 Item Detail에서 Public으로 전환해주세요."
        action={<Button variant="secondary" onClick={goToDetail}>Item Detail로 이동</Button>}
      />
    );
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
            <p>Current Owner {shortenAddress(item.currentOwner)}</p>
          </div>
          <div className="fieldWithAction">
            <TextInput
              label="새 소유자 지갑 주소"
              value={newOwner}
              onChange={(event) => setNewOwner(event.target.value)}
              error={addressError}
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
            error={priceError}
          />
          <Button type="submit" className="wide" disabled={!canSubmit}>
            {isSubmitting ? "Transferring..." : "Transfer Ownership"}
          </Button>
        </form>

        <aside className="panel">
          <h3>처리 기준</h3>
          <p>Smart Contract는 현재 소유자와 Public 상태를 검증한 뒤 소유권을 이전합니다.</p>
          <p>Transaction Price는 거래 이력에 기록되며 Listed Price를 변경하지 않습니다.</p>
          <p>MetaMask 승인 거부는 토스트 메시지로 표시합니다.</p>
        </aside>
      </section>

      <Modal open={Boolean(complete)} title="소유권 이전 완료" onClose={goToDetail}>
        {complete ? (
          <div className="completeBox modalComplete">
            <dl>
              <div>
                <dt>이전 소유자</dt>
                <dd>{shortenAddress(complete.from)}</dd>
              </div>
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
            <Button className="wide" onClick={goToDetail}>
              확인
            </Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
