import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import TextInput from "../components/TextInput.jsx";
import Toast from "../components/Toast.jsx";
import { useItemRegistry, isOwner } from "../context/ItemRegistryContext.jsx";
import { useWallet } from "../context/WalletContext.jsx";
import { categories } from "../data/categories.js";
import { shortenAddress } from "../utils/format.js";
import { validateRegisterItemForm } from "../utils/items.js";

function getRouteItemId() {
  const match = window.location.hash.match(/^#\/item\/(\d+)/);
  return match ? Number(match[1]) : 1;
}

function stripEthUnit(value = "") {
  return String(value).replace(/\s*ETH$/i, "");
}

function formatRecordDate(record) {
  if (record.date) return record.date;
  if (record.timestamp) {
    return new Date(Number(record.timestamp) * 1000).toLocaleString("ko-KR");
  }
  return "-";
}

function HistoryTable({ records }) {
  return (
    <div className="tableLike">
      <div className="tableHead">
        <span>Date</span>
        <span>From</span>
        <span>To</span>
        <span>Transaction Price</span>
      </div>
      {records.map((record) => (
        <div className="tableRow" key={record.id}>
          <span>{formatRecordDate(record)}</span>
          <span>{shortenAddress(record.from)}</span>
          <span>{shortenAddress(record.to)}</span>
          <strong>{record.transactionPrice}</strong>
        </div>
      ))}
    </div>
  );
}

export default function ItemDetail() {
  const wallet = useWallet();
  const registry = useItemRegistry();
  const itemId = getRouteItemId();
  const item = registry.getItemById(itemId);
  const [records, setRecords] = useState(() => registry.transactionHistories[itemId] || []);
  const [toast, setToast] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    registry.getTransactionHistory(itemId).then((history) => {
      if (mounted) setRecords(history);
    });
    return () => {
      mounted = false;
    };
  }, [itemId]);

  const owner = isOwner(item, wallet);
  const canView = Boolean(item && (item.isPublic || owner));
  const canEdit = owner && records.length === 0;
  const recentRecords = useMemo(() => records.slice(0, 5), [records]);

  function openEditModal() {
    if (!item) return;
    setEditForm({
      name: item.name,
      description: item.description,
      listedPrice: stripEthUnit(item.listedPrice),
      category: item.category,
      imageUrl: item.imageUrl,
      isPublic: item.isPublic ? "Public" : "Private"
    });
    setEditErrors({});
    setShowEdit(true);
  }

  function updateEditField(field, value) {
    setEditForm((current) => ({ ...current, [field]: value }));
    setEditErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleVisibilityToggle() {
    try {
      await registry.setItemVisibility(item.itemId, !item.isPublic, wallet);
      setToast(item.isPublic ? "Private으로 전환되었습니다." : "Public으로 전환되었습니다.");
    } catch (error) {
      setToast(error.message || "공개 여부 변경에 실패했습니다.");
    }
  }

  async function handleUpdateItem(event) {
    event.preventDefault();
    const validation = validateRegisterItemForm(editForm);
    setEditErrors(validation.errors);

    if (!validation.isValid) return;

    setIsSaving(true);
    try {
      await registry.updateItem(item.itemId, editForm, wallet);
      setToast("물품 정보가 수정되었습니다.");
      setShowEdit(false);
    } catch (error) {
      setToast(error.message || "물품 정보 수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
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

  if (!canView) {
    return (
      <EmptyState
        title="Private 물품입니다."
        description="현재 소유자만 이 물품의 상세 정보를 조회할 수 있습니다."
        action={<Button variant="secondary" onClick={() => (window.location.hash = "#/market")}>Market으로 이동</Button>}
      />
    );
  }

  return (
    <div className="pageStack">
      <Toast message={toast} />
      <section className="detailLayout">
        <div className="detailImage">
          {imageFailed ? (
            <div className="detailImageFallback">이미지를 불러올 수 없습니다.</div>
          ) : (
            <img src={item.imageUrl} alt="" onError={() => setImageFailed(true)} />
          )}
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
            {owner ? (
              <a href={`#/transfer/${item.itemId}`}>
                <Button>소유권 이전</Button>
              </a>
            ) : null}
            {owner ? (
              <Button variant="secondary" onClick={handleVisibilityToggle}>
                {item.isPublic ? "Private으로 전환" : "Public으로 전환"}
              </Button>
            ) : null}
            {owner ? (
              <Button variant="secondary" onClick={openEditModal} disabled={!canEdit}>
                정보 수정
              </Button>
            ) : null}
            <a href="#/market">
              <Button variant="ghost">Market</Button>
            </a>
          </div>
          {owner && !canEdit ? <p className="ownerNote">소유권 이전 이력이 있는 물품은 정보를 수정할 수 없습니다.</p> : null}
        </div>
      </section>

      <section className="panel">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Recent transaction records</p>
            <h2>거래 이력</h2>
          </div>
          <Button variant="ghost" onClick={() => setShowAllHistory(true)}>
            전체 거래 이력 보기 →
          </Button>
        </div>
        {recentRecords.length ? (
          <HistoryTable records={recentRecords} />
        ) : (
          <EmptyState title="거래 이력이 없습니다." description="아직 소유권 이전 기록이 없습니다." />
        )}
      </section>

      <Modal open={showAllHistory} title="전체 거래 이력" onClose={() => setShowAllHistory(false)}>
        {records.length ? (
          <HistoryTable records={records} />
        ) : (
          <EmptyState title="거래 이력이 없습니다." description="이 물품의 전체 거래 이력이 비어 있습니다." />
        )}
      </Modal>

      <Modal open={showEdit} title="물품 정보 수정" onClose={() => setShowEdit(false)}>
        {editForm ? (
          <form className="formPanel" onSubmit={handleUpdateItem}>
            <TextInput
              label="물품명"
              value={editForm.name}
              onChange={(event) => updateEditField("name", event.target.value)}
              error={editErrors.name}
            />
            <label className="field">
              <span>설명</span>
              <textarea value={editForm.description} onChange={(event) => updateEditField("description", event.target.value)} />
              {editErrors.description ? <strong className="fieldError">{editErrors.description}</strong> : null}
            </label>
            <TextInput
              label="등록 가격 (Listed Price)"
              value={editForm.listedPrice}
              onChange={(event) => updateEditField("listedPrice", event.target.value)}
              error={editErrors.listedPrice}
            />
            <label className="field">
              <span>카테고리</span>
              <select value={editForm.category} onChange={(event) => updateEditField("category", event.target.value)}>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
              {editErrors.category ? <strong className="fieldError">{editErrors.category}</strong> : null}
            </label>
            <TextInput
              label="이미지 URL"
              value={editForm.imageUrl}
              onChange={(event) => updateEditField("imageUrl", event.target.value)}
              error={editErrors.imageUrl}
            />
            <Button type="submit" className="wide" disabled={isSaving || !canEdit}>
              {isSaving ? "Saving..." : "정보 저장"}
            </Button>
          </form>
        ) : null}
      </Modal>
    </div>
  );
}
