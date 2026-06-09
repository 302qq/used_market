# ChainTrust

블록체인 기반 중고거래 이력 인증 서비스

## 1. 프로젝트 소개

ChainTrust는 중고거래에서 물품의 소유권 이전 이력을 블록체인에 기록하여,
거래 내역의 신뢰성을 높이는 웹 서비스입니다.

사용자는 MetaMask 지갑을 연결해 물품을 등록하고,
거래 후 소유권을 다른 지갑 주소로 이전할 수 있습니다.
등록 및 이전 기록은 Ethereum Sepolia 테스트넷에 남아,
이후 물품의 거래 이력을 확인할 수 있습니다.

## 2. 개발 배경

중고거래에서는 판매자가 실제 소유자인지,
이전에 어떤 거래 이력이 있었는지 확인하기 어렵다는 문제가 있습니다.

ChainTrust는 블록체인의 변경이 어려운 기록 특성을 활용해,
거래 이력을 투명하게 확인할 수 있는 구조를 실험하기 위해 개발했습니다.

## 2-1. 개발 과정

이 프로젝트는 AI 기반 개발 도구를 적극 활용하여 구현한 블록체인 웹 서비스입니다.  
기획, 화면 설계, 코드 초안 작성, 오류 해결 과정에서 AI의 도움을 받았으며,
저는 서비스 구조 설계, UI 구성, 기능 테스트, MetaMask 연동 확인, 배포 및 발표 자료 정리를 담당했습니다.

## 3. 주요 기능

- MetaMask 지갑 연결 및 계정 기반 사용자 식별
- 물품 등록
- 전체 물품 목록 조회
- 물품 상세 정보 조회
- 내 소유 물품 조회
- 지갑 주소 기반 소유권 이전
- 물품별 거래 이력 조회
- Ethereum Sepolia 테스트넷 기반 스마트 컨트랙트 연동

## 4. 기술 스택

### Frontend
- React
- JavaScript
- CSS
- Vite

### Blockchain
- Solidity
- Ethereum Sepolia Testnet
- MetaMask

### Deploy
- Vercel

## 5. 서비스 화면

| 화면 | 설명 |
|---|---|
| Home | 서비스 소개 및 주요 기능 안내 |
| Market | 등록된 물품 목록 조회 |
| Register | 물품 등록 |
| Detail | 물품 상세 정보 및 거래 이력 확인 |
| My Items | 내가 소유한 물품 조회 |
| Transfer | 소유권 이전 |

## 6. 프로젝트 구조

```bash
src/
├── components/
├── context/
├── pages/
├── services/
├── contracts/
└── App.jsx