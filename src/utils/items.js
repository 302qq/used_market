import { categories } from "../data/categories.js";
import { ethToWei, weiToEth } from "./price.js";

export function isAllowedCategory(category) {
  return categories.includes(category);
}

export function validateRegisterItemForm(form) {
  const errors = {};

  if (!form.name?.trim()) errors.name = "물품명을 입력해주세요.";
  if (!form.description?.trim()) errors.description = "설명을 입력해주세요.";
  if (!form.imageUrl?.trim()) errors.imageUrl = "이미지 URL을 입력해주세요.";
  if (!isAllowedCategory(form.category)) errors.category = "허용된 카테고리를 선택해주세요.";
  if (form.isPublic !== "Public" && form.isPublic !== "Private") {
    errors.isPublic = "공개 여부를 선택해주세요.";
  }

  try {
    ethToWei(form.listedPrice);
  } catch {
    errors.listedPrice = "Listed Price를 ETH 단위 숫자로 입력해주세요.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function normalizeContractItem(item) {
  return {
    itemId: Number(item.itemId),
    name: item.name,
    description: item.description,
    listedPrice: `${weiToEth(item.listedPrice)} ETH`,
    category: item.category,
    imageUrl: item.imageUrl,
    currentOwner: item.currentOwner,
    isPublic: Boolean(item.isPublic),
    createdAt: Number(item.createdAt)
  };
}

export function filterPublicItems(items, query = "", category = "전체") {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesPublic = item.isPublic;
    const matchesQuery = item.name.toLowerCase().includes(normalizedQuery);
    const matchesCategory = category === "전체" || item.category === category;
    return matchesPublic && matchesQuery && matchesCategory;
  });
}
