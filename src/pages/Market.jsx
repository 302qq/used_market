import React, { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import ItemCard from "../components/ItemCard.jsx";
import TextInput from "../components/TextInput.jsx";
import { useItemRegistry } from "../context/ItemRegistryContext.jsx";
import { categories } from "../data/categories.js";
import { filterPublicItems } from "../utils/items.js";

export default function Market() {
  const registry = useItemRegistry();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");

  const visibleItems = useMemo(() => {
    return filterPublicItems(registry.items, query, category);
  }, [registry.items, query, category]);

  return (
    <div className="pageStack">
      <section className="pageTitle">
        <p className="eyebrow">Public registry</p>
        <h2>Market</h2>
        <p>공개된 물품을 탐색하고 상세 페이지에서 소유권 이력을 확인합니다.</p>
        {registry.error ? <p className="pageAlert">{registry.error}</p> : null}
      </section>

      <section className="toolbar">
        <TextInput label="검색" placeholder="물품명 검색" value={query} onChange={(event) => setQuery(event.target.value)} />
        <label className="field selectField">
          <span>카테고리</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>전체</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      {registry.isLoading ? (
        <EmptyState title="물품 목록을 불러오는 중입니다." description="UsedMarket Smart Contract 조회를 기다리고 있습니다." />
      ) : visibleItems.length ? (
        <div className="cardGrid">
          {visibleItems.map((item) => (
            <ItemCard key={item.itemId} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="표시할 공개 물품이 없습니다." description="검색어 또는 카테고리 조건을 조정하세요." />
      )}
    </div>
  );
}
