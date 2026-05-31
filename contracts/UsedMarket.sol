// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract UsedMarket {
    struct Item {
        uint256 itemId;
        string name;
        string description;
        uint256 listedPrice;
        string category;
        string imageUrl;
        address currentOwner;
        bool isPublic;
        uint256 createdAt;
    }

    struct TransactionRecord {
        address from;
        address to;
        uint256 transactionPrice;
        uint256 timestamp;
    }

    uint256 public nextItemId = 1;

    mapping(uint256 => Item) private items;
    uint256[] private itemIds;
    mapping(uint256 => TransactionRecord[]) private transactionHistories;

    event ItemRegistered(
        uint256 indexed itemId,
        address indexed owner,
        string name,
        uint256 listedPrice,
        string category,
        bool isPublic,
        uint256 createdAt
    );

    event ItemUpdated(
        uint256 indexed itemId,
        string name,
        string description,
        uint256 listedPrice,
        string category,
        string imageUrl
    );

    event ItemVisibilityChanged(uint256 indexed itemId, bool isPublic);

    event OwnershipTransferred(
        uint256 indexed itemId,
        address indexed from,
        address indexed to,
        uint256 transactionPrice,
        uint256 timestamp
    );

    modifier itemExists(uint256 itemId) {
        require(items[itemId].itemId != 0, "Item does not exist");
        _;
    }

    modifier onlyCurrentOwner(uint256 itemId) {
        require(items[itemId].currentOwner == msg.sender, "Only current owner");
        _;
    }

    function registerItem(
        string calldata name,
        string calldata description,
        uint256 listedPrice,
        string calldata category,
        string calldata imageUrl,
        bool isPublic
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name is required");
        require(bytes(description).length > 0, "Description is required");
        require(bytes(category).length > 0, "Category is required");
        require(bytes(imageUrl).length > 0, "Image URL is required");

        uint256 itemId = nextItemId;
        nextItemId += 1;

        items[itemId] = Item({
            itemId: itemId,
            name: name,
            description: description,
            listedPrice: listedPrice,
            category: category,
            imageUrl: imageUrl,
            currentOwner: msg.sender,
            isPublic: isPublic,
            createdAt: block.timestamp
        });
        itemIds.push(itemId);

        emit ItemRegistered(itemId, msg.sender, name, listedPrice, category, isPublic, block.timestamp);

        return itemId;
    }

    function getAllItems() external view returns (Item[] memory) {
        Item[] memory allItems = new Item[](itemIds.length);

        for (uint256 index = 0; index < itemIds.length; index += 1) {
            allItems[index] = items[itemIds[index]];
        }

        return allItems;
    }

    function getItem(uint256 itemId) external view itemExists(itemId) returns (Item memory) {
        return items[itemId];
    }

    function updateItem(
        uint256 itemId,
        string calldata name,
        string calldata description,
        uint256 listedPrice,
        string calldata category,
        string calldata imageUrl
    ) external itemExists(itemId) onlyCurrentOwner(itemId) {
        require(transactionHistories[itemId].length == 0, "Transferred item cannot be updated");
        require(bytes(name).length > 0, "Name is required");
        require(bytes(description).length > 0, "Description is required");
        require(bytes(category).length > 0, "Category is required");
        require(bytes(imageUrl).length > 0, "Image URL is required");

        Item storage item = items[itemId];
        item.name = name;
        item.description = description;
        item.listedPrice = listedPrice;
        item.category = category;
        item.imageUrl = imageUrl;

        emit ItemUpdated(itemId, name, description, listedPrice, category, imageUrl);
    }

    function setItemVisibility(uint256 itemId, bool isPublic)
        external
        itemExists(itemId)
        onlyCurrentOwner(itemId)
    {
        items[itemId].isPublic = isPublic;

        emit ItemVisibilityChanged(itemId, isPublic);
    }

    function transferOwnership(uint256 itemId, address newOwner, uint256 transactionPrice)
        external
        itemExists(itemId)
        onlyCurrentOwner(itemId)
    {
        require(items[itemId].isPublic, "Item must be public");
        require(newOwner != address(0), "New owner is required");
        require(newOwner != msg.sender, "New owner must differ");

        address previousOwner = msg.sender;
        items[itemId].currentOwner = newOwner;
        transactionHistories[itemId].push(TransactionRecord({
            from: previousOwner,
            to: newOwner,
            transactionPrice: transactionPrice,
            timestamp: block.timestamp
        }));

        emit OwnershipTransferred(itemId, previousOwner, newOwner, transactionPrice, block.timestamp);
    }

    function getTransactionHistory(uint256 itemId)
        external
        view
        itemExists(itemId)
        returns (TransactionRecord[] memory)
    {
        return transactionHistories[itemId];
    }
}
