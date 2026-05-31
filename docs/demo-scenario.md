# ChainTrust Demo Scenario

## Purpose

This scenario verifies the MVP flow for ownership history certification of limited, rare, and collectible items. The app does not provide purchase, payment, chat, delivery, account signup, or admin features.

## Environment

- Browser: Chrome
- Wallet: MetaMask
- Network: Ethereum Sepolia
- Contract: UsedMarket
- Required env values:
  - `VITE_USED_MARKET_CONTRACT_ADDRESS`
  - `VITE_SEPOLIA_CHAIN_ID=0xaa36a7`
  - `VITE_CONTRACT_DEPLOY_BLOCK`

## Sample Items

- 한정판 포토카드 세트
- 친필 사인 앨범
- 레트로 게임 패키지
- 명품 시계 보관품

## Happy Path

1. Open Home and confirm runtime readiness.
2. Connect MetaMask on Sepolia.
3. Register a Public item with name, description, Listed Price, category, image URL, and visibility.
4. Confirm Register Complete State with Item ID, Owner, and Transaction Hash.
5. Open Market and confirm only Public items are listed.
6. Search by item name and filter by category.
7. Open Item Detail and confirm image, name, category, Listed Price, description, current owner, and recent transaction records.
8. Toggle Public/Private as the current owner and confirm Market visibility changes.
9. Transfer ownership to another wallet with Transaction Price.
10. Confirm the success modal shows previous owner, new owner, Transaction Price, and Transaction Hash.
11. Open My Items with the new owner wallet and confirm the item appears in Owned.
12. Open My Items with the previous owner wallet and confirm the item appears in Transferred.
13. Open Transaction History and confirm only participated transactions are shown.

## Failure Cases

- MetaMask not installed: wallet status shows installation message.
- Wrong network: Sepolia guidance is displayed.
- Invalid Ethereum address: transfer button remains disabled.
- Private item transfer: transfer access is blocked.
- Non-owner transfer: transfer access is blocked.
- Transaction rejection: toast shows `트랜잭션이 취소되었습니다.`
- Tx Hash event mapping failure: Tx Hash displays `조회 불가`.
