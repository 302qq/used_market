import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { categories } from "../src/data/categories.js";
import { filterPublicItems, isAllowedCategory, validateRegisterItemForm } from "../src/utils/items.js";

const expectedCategories = ["패션", "악세사리", "전자기기", "문구", "수집품", "음반", "게임", "기타"];
assert.deepEqual(categories, expectedCategories);
assert.equal(isAllowedCategory("악세사리"), true);
assert.equal(isAllowedCategory("임의태그"), false);

const validForm = {
  name: "한정판 포토카드",
  description: "외부 거래 후 등록하는 수집품",
  listedPrice: "0.18",
  category: "수집품",
  imageUrl: "https://example.com/item.jpg",
  isPublic: "Public"
};
assert.equal(validateRegisterItemForm(validForm).isValid, true);

const invalidForm = {
  name: "",
  description: "",
  listedPrice: "abc",
  category: "임의태그",
  imageUrl: "",
  isPublic: "Hidden"
};
const invalidResult = validateRegisterItemForm(invalidForm);
assert.equal(invalidResult.isValid, false);
assert.ok(invalidResult.errors.name);
assert.ok(invalidResult.errors.description);
assert.ok(invalidResult.errors.listedPrice);
assert.ok(invalidResult.errors.category);
assert.ok(invalidResult.errors.imageUrl);
assert.ok(invalidResult.errors.isPublic);

const items = [
  { itemId: 1, name: "한정판 포토카드", category: "수집품", isPublic: true },
  { itemId: 2, name: "비공개 앨범", category: "음반", isPublic: false },
  { itemId: 3, name: "레트로 게임 패키지", category: "게임", isPublic: true }
];
assert.deepEqual(filterPublicItems(items).map((item) => item.itemId), [1, 3]);
assert.deepEqual(filterPublicItems(items, "게임").map((item) => item.itemId), [3]);
assert.deepEqual(filterPublicItems(items, "", "수집품").map((item) => item.itemId), [1]);
assert.deepEqual(filterPublicItems(items, "비공개").map((item) => item.itemId), []);

const sourceFiles = [
  "src/pages/RegisterItem.jsx",
  "src/pages/Market.jsx",
  "src/pages/Home.jsx",
  "src/components/ItemCard.jsx",
  "src/context/ItemRegistryContext.jsx",
  "src/services/usedMarket.js"
].map((file) => readFileSync(path.join(process.cwd(), file), "utf8"));
const sourceText = sourceFiles.join("\n");

for (const required of [
  "registerItemOnChain",
  "fetchAllItems",
  "validateRegisterItemForm",
  "filterPublicItems",
  "URL 미리보기",
  "이미지를 불러올 수 없습니다.",
  "등록 완료"
]) {
  assert.ok(sourceText.includes(required), `Missing Phase 4 implementation marker: ${required}`);
}

for (const forbidden of [
  "IPFS",
  "Certificate",
  "Ownership Record",
  "Authenticated",
  "CURRENT PRICE",
  "currentOwner}</",
  "Export CSV",
  "Filter By Date",
  "Gas Fee",
  "USD"
]) {
  assert.equal(sourceText.includes(forbidden), false, `Forbidden Phase 4 UI term found: ${forbidden}`);
}

console.log("PASS: Phase 4 register item, category, image preview, and Market filtering checks passed.");
