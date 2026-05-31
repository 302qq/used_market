import { useState } from "react";
import Button from "../components/Button.jsx";
import TextInput from "../components/TextInput.jsx";
import Toast from "../components/Toast.jsx";
import { categories } from "../data/categories.js";
import { connectedWallet } from "../data/mockData.js";
import { shortenAddress } from "../utils/format.js";

const initialForm = {
  name: "",
  description: "",
  listedPrice: "",
  category: "수집품",
  imageUrl: "",
  isPublic: "Public"
};

export default function RegisterItem() {
  const [form, setForm] = useState(initialForm);
  const [complete, setComplete] = useState(null);
  const [toast, setToast] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setComplete({
      itemId: "1",
      owner: connectedWallet,
      txHash: "0xa41e...c920"
    });
    setToast("등록 요청이 처리되었습니다.");
  }

  return (
    <div className="pageStack">
      <Toast message={toast} />
      <section className="pageTitle">
        <p className="eyebrow">Register item</p>
        <h2>Register Item</h2>
        <p>이미 배포된 UsedMarket Smart Contract의 registerItem 호출을 위한 입력 구조입니다.</p>
      </section>

      <div className="splitLayout">
        <form className="panel formPanel" onSubmit={handleSubmit}>
          <TextInput label="물품명" value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
          <label className="field">
            <span>설명</span>
            <textarea value={form.description} onChange={(event) => updateField("description", event.target.value)} required />
          </label>
          <TextInput
            label="등록 가격 (Listed Price)"
            placeholder="0.00 ETH"
            value={form.listedPrice}
            onChange={(event) => updateField("listedPrice", event.target.value)}
            required
          />
          <label className="field">
            <span>카테고리</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <TextInput
            label="이미지 URL"
            placeholder="https://example.com/item.jpg"
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            required
          />
          <label className="field">
            <span>공개 여부</span>
            <select value={form.isPublic} onChange={(event) => updateField("isPublic", event.target.value)}>
              <option>Public</option>
              <option>Private</option>
            </select>
          </label>
          <Button type="submit" className="wide">
            Register Item
          </Button>
        </form>

        <aside className="panel previewPanel">
          <h3>URL 미리보기</h3>
          <div className="imagePreview">
            {form.imageUrl ? <img src={form.imageUrl} alt="" /> : <span>이미지 URL을 입력하세요.</span>}
          </div>
          {complete ? (
            <div className="completeBox">
              <h3>등록 완료</h3>
              <dl>
                <div>
                  <dt>Item ID</dt>
                  <dd>{complete.itemId}</dd>
                </div>
                <div>
                  <dt>Owner</dt>
                  <dd>{shortenAddress(complete.owner)}</dd>
                </div>
                <div>
                  <dt>Transaction Hash</dt>
                  <dd>{complete.txHash}</dd>
                </div>
              </dl>
              <div className="inlineActions">
                <a href="#/item/1">
                  <Button>Item Detail</Button>
                </a>
                <a href="#/market">
                  <Button variant="secondary">Market</Button>
                </a>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
