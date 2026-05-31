export function getOwnedItems(items, walletAddress) {
  if (!walletAddress) return [];
  const wallet = walletAddress.toLowerCase();
  return items.filter((item) => item.currentOwner?.toLowerCase() === wallet);
}

export function getTransferredItems(items, transactionHistories, walletAddress) {
  if (!walletAddress) return [];
  const wallet = walletAddress.toLowerCase();

  return items.filter((item) => {
    const histories = transactionHistories[Number(item.itemId)] || [];
    const wasPreviousOwner = histories.some((record) => record.from?.toLowerCase() === wallet);
    const isCurrentOwner = item.currentOwner?.toLowerCase() === wallet;
    return wasPreviousOwner && !isCurrentOwner;
  });
}

export function getParticipatingTransactions(items, transactionHistories, walletAddress) {
  if (!walletAddress) return [];
  const wallet = walletAddress.toLowerCase();
  const itemNameById = new Map(items.map((item) => [Number(item.itemId), item.name]));

  return Object.entries(transactionHistories)
    .flatMap(([itemId, histories]) =>
      histories.map((record, index) => ({
        ...record,
        id: record.id || `${itemId}-${index}`,
        itemId: Number(record.itemId || itemId),
        itemName: record.itemName || itemNameById.get(Number(record.itemId || itemId)) || "-"
      }))
    )
    .filter((record) => record.from?.toLowerCase() === wallet || record.to?.toLowerCase() === wallet)
    .sort((a, b) => getRecordTime(b) - getRecordTime(a));
}

export function getRecordTime(record) {
  if (record.timestamp) return Number(record.timestamp);
  if (record.date) return Date.parse(record.date) || 0;
  return 0;
}

export function formatTransactionDate(record) {
  if (record.date) return record.date;
  if (record.timestamp) return new Date(Number(record.timestamp) * 1000).toLocaleString("ko-KR");
  return "-";
}

export function getTxHashLabel(record) {
  return record.txHash || "조회 불가";
}
