export const mockItems = [
  {
    itemId: 1,
    name: "한정판 포토카드 세트",
    description: "외부 거래 후 소유권 이력 기록 대상으로 등록된 수집품입니다.",
    listedPrice: "0.18 ETH",
    category: "수집품",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    currentOwner: "0x8A12b6C4d9E1F0aB2345678901234567890ABcDe",
    isPublic: true,
    createdAt: "2026-05-21"
  },
  {
    itemId: 2,
    name: "친필 사인 앨범",
    description: "소유권 흐름을 확인할 수 있도록 공개된 음반 수집품입니다.",
    listedPrice: "0.42 ETH",
    category: "음반",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
    currentOwner: "0x19dBC2aE3D9f5678901234567890abcDEF123456",
    isPublic: true,
    createdAt: "2026-05-22"
  },
  {
    itemId: 3,
    name: "레트로 게임 패키지",
    description: "거래 후 이력 인증을 위해 등록된 게임 컬렉션입니다.",
    listedPrice: "0.31 ETH",
    category: "게임",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    currentOwner: "0xA6B7c8D9eF0011223344556677889900aABbCCdd",
    isPublic: true,
    createdAt: "2026-05-23"
  },
  {
    itemId: 4,
    name: "명품 시계 보관품",
    description: "현재 지갑 소유자 기준으로 관리되는 고가 수집품입니다.",
    listedPrice: "1.20 ETH",
    category: "패션",
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    currentOwner: "0xFfAABBccDDee0011223344556677889900AA11Bb",
    isPublic: true,
    createdAt: "2026-05-24"
  }
];

export const mockTransactions = [
  {
    id: "tx-1",
    itemId: 1,
    itemName: "한정판 포토카드 세트",
    date: "2026-05-24 14:10",
    from: "0x0F21aA00000000000000000000000000000000A1",
    to: "0x8A12b6C4d9E1F0aB2345678901234567890ABcDe",
    transactionPrice: "0.17 ETH",
    txHash: "0x7a9c...13ef"
  },
  {
    id: "tx-2",
    itemId: 2,
    itemName: "친필 사인 앨범",
    date: "2026-05-25 09:42",
    from: "0x19dBC2aE3D9f5678901234567890abcDEF123456",
    to: "0x3421dD00000000000000000000000000000000B2",
    transactionPrice: "0.40 ETH",
    txHash: "0x4bb1...8c20"
  },
  {
    id: "tx-3",
    itemId: 3,
    itemName: "레트로 게임 패키지",
    date: "2026-05-26 18:33",
    from: "0xA6B7c8D9eF0011223344556677889900aABbCCdd",
    to: "0x8A12b6C4d9E1F0aB2345678901234567890ABcDe",
    transactionPrice: "0.29 ETH",
    txHash: "0x91de...71aa"
  }
];

export const connectedWallet = "0x8A12b6C4d9E1F0aB2345678901234567890ABcDe";
