export const usedMarketAbi = [
  "function registerItem(string name,string description,uint256 listedPrice,string category,string imageUrl,bool isPublic) returns (uint256)",
  "function getAllItems() view returns ((uint256 itemId,string name,string description,uint256 listedPrice,string category,string imageUrl,address currentOwner,bool isPublic,uint256 createdAt)[])",
  "function getItem(uint256 itemId) view returns (uint256 itemId,string name,string description,uint256 listedPrice,string category,string imageUrl,address currentOwner,bool isPublic,uint256 createdAt)",
  "function updateItem(uint256 itemId,string name,string description,uint256 listedPrice,string category,string imageUrl)",
  "function setItemVisibility(uint256 itemId,bool isPublic)",
  "function transferOwnership(uint256 itemId,address newOwner,uint256 transactionPrice)",
  "function getTransactionHistory(uint256 itemId) view returns ((address from,address to,uint256 transactionPrice,uint256 timestamp)[])",
  "event ItemRegistered(uint256 indexed itemId,address indexed owner,string name,uint256 listedPrice,string category,bool isPublic,uint256 createdAt)",
  "event ItemUpdated(uint256 indexed itemId,string name,string description,uint256 listedPrice,string category,string imageUrl)",
  "event ItemVisibilityChanged(uint256 indexed itemId,bool isPublic)",
  "event OwnershipTransferred(uint256 indexed itemId,address indexed from,address indexed to,uint256 transactionPrice,uint256 timestamp)"
];
