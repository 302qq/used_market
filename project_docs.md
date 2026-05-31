# ChainTrust: Ethereum Sepolia Testnet과 MetaMask를 활용한 블록체인 기반 수집품 소유권 이력 인증 플랫폼 PRD / SRS

# 1. PRD

## 1.1 프로젝트 개요

ChainTrust는 한정판, 희귀품, 수집품처럼 소유 이력과 거래 이력이 신뢰도와 가치 판단에 영향을 줄 수 있는 물품의 소유권 이전 기록을 블록체인에 남기는 웹 서비스이다.

본 서비스는 일반 중고거래 플랫폼이 아니다. 앱 안에서 구매, 결제, 채팅, 배송을 제공하지 않는다. 사용자는 외부 거래 플랫폼 또는 개인 간 채널에서 실제 거래를 진행하고, ChainTrust에서는 거래 완료 후 물품의 소유권 이전 기록과 거래 이력을 Ethereum Sepolia Testnet에 배포된 UsedMarket Smart Contract에 기록한다.

서비스 목적은 한정판, 희귀품, 수집품의 소유권 이력 인증이다. 사용자는 물품의 현재 소유자와 과거 소유권 이전 이력을 확인할 수 있으며, 블록체인에 기록된 이력은 임의 수정이나 삭제가 어렵기 때문에 디지털 보증서 역할을 할 수 있다.

서비스 대상 예시는 다음과 같다.

- 한정판 포토카드
- 친필 사인 앨범
- 한정판 피규어
- 레트로 게임 패키지
- 한정판 LP
- 명품 시계
- 희귀 수집품

본 서비스는 React 기반 웹 프론트엔드, MetaMask, ethers.js, Ethereum Sepolia Testnet, UsedMarket Smart Contract로 구성된다. 백엔드 서버와 DB는 사용하지 않는다.

### 핵심 서비스 흐름

1. 사용자 A와 B가 외부 플랫폼에서 거래한다.
2. 거래 완료 후 현재 소유자 A가 ChainTrust에 접속한다.
3. A가 물품을 등록하거나 기존 등록 물품을 선택한다.
4. A가 새 소유자 B의 지갑 주소를 입력한다.
5. A가 실제 거래 가격인 Transaction Price를 입력한다.
6. A가 MetaMask로 소유권 이전 트랜잭션을 승인한다.
7. Smart Contract가 A가 현재 소유자인지 검증한다.
8. 소유권이 A에서 B로 이전된다.
9. 거래 이력에 `from`, `to`, `transactionPrice`, `timestamp`, `txHash`가 표시된다.
10. B는 My Items의 Owned 탭에서 해당 물품을 확인할 수 있다.

## 1.2 문제 정의

한정판, 희귀품, 수집품 거래에서는 다음과 같은 문제가 발생할 수 있다.

- 일반 중고거래 플랫폼은 거래 자체에는 적합하지만, 거래 이후의 소유권 이력 보존에는 한계가 있다.
- 거래 이력이 플랫폼 내부 DB, 개인 대화 기록, 이미지 캡처에만 남으면 삭제, 분실, 조작 가능성이 있다.
- 기존 거래 플랫폼 밖에서 거래가 반복되면 소유권 흐름을 추적하기 어렵다.
- 현재 소유자가 누구인지 공개적으로 검증하기 어렵다.
- 소유권 이력과 거래 가격 이력이 물품 신뢰도에 영향을 줄 수 있지만, 이를 일관된 방식으로 보존하기 어렵다.

ChainTrust는 거래 플랫폼이 아니라 거래 이후 소유권 이전 기록을 남기는 인증 서비스이다. 사용자는 외부 거래가 완료된 뒤 ChainTrust에서 소유권 이전을 기록하고, 이후 물품 상세 화면과 거래 이력 화면에서 이력을 확인할 수 있다.

### 왜 블록체인을 사용하는가

소유권 이력은 임의로 수정되면 안 되는 데이터이다. 중앙 DB 기반 기록은 관리자 또는 서비스 운영자에 의해 수정될 가능성이 있고, 개인 대화 기록은 장기 보존과 검증이 어렵다.

블록체인은 기록된 소유권 이전 이력을 임의로 수정하거나 삭제하기 어렵게 만들고, 누구나 현재 소유자와 과거 소유권 이전 이력을 검증할 수 있도록 한다. 따라서 한정판, 희귀품, 수집품의 소유권 이력 인증과 잘 맞는다.

단, MVP에서는 실물 보유 여부, 정품 여부, 진품 여부를 검증하지 않는다. MVP에서는 소유권 이력 기록 구조 검증에 집중하며, 실물 인증 및 진품 검증 기능은 향후 확장 기능으로 고려한다.

## 1.3 프로젝트 목표

- Ethereum Sepolia Testnet에 1회 배포된 UsedMarket Smart Contract를 통해 여러 물품의 등록, 공개 여부 관리, 소유권 이전, 거래 이력 조회를 제공한다.
- MetaMask를 이용해 사용자의 지갑 주소 기반 연결과 트랜잭션 승인을 처리한다.
- 사용자는 물품명, 설명, Listed Price, 카테고리, 이미지 URL, 공개 여부를 입력하여 물품을 등록할 수 있다.
- 물품 이미지는 파일 업로드가 아니라 이미지 URL 입력 방식만 사용한다.
- 등록 가격인 Listed Price와 소유권 이전 시 실제 거래 가격인 Transaction Price를 구분한다.
- 거래 이력에는 Transaction Price를 기록한다.
- Listed Price와 Transaction Price는 MVP에서 ETH 단위로 표시하되, 실제 결제 수단이 아니라 가격 기록 및 표시 단위로만 사용한다.
- Market은 공개 물품을 탐색하고 Item Detail로 이동하는 공개 탐색 화면으로 제공한다.
- Market은 구매, 결제, 채팅, 배송 기능을 제공하지 않는다.
- Market 카드에는 현재 소유자 주소를 표시하지 않는다.
- Market 카드 태그는 임의 태그가 아니라 카테고리만 사용한다.
- My Items는 Owned와 Transferred 탭 구조로 제공한다.
- Transaction History는 전체 서비스 거래 내역이 아니라 현재 연결된 지갑이 참여한 거래만 표시한다.
- 현재 소유자만 물품 정보 수정, 공개/비공개 전환, 소유권 이전을 수행할 수 있다.
- 물품 삭제 기능은 제공하지 않는다.
- 물품 정보 수정은 소유권 이전 전까지만 가능하다.
- 소유권 이전은 Public 상태의 물품만 가능하다.
- Private 물품을 이전하려면 먼저 Public으로 전환해야 한다.
- 백엔드 서버와 DB 없이 React Web, MetaMask, ethers.js, Ethereum Sepolia, UsedMarket Smart Contract만으로 구현한다.
- 실제 결제, 구매하기, 채팅, 배송, 회원가입, 관리자 기능은 MVP 범위에서 제외한다.
- Smart Contract 배포는 개발자가 프로젝트 초기 설정 단계에서 1회 수행하며, 사용자 화면에는 Smart Contract 배포 기능을 포함하지 않는다.

## 1.4 주요 기능

### MetaMask 지갑 연결

사용자는 MetaMask를 통해 Ethereum 지갑을 연결한다. 연결된 지갑 주소는 ChainTrust에서 사용자 식별자로 사용된다.

### 물품 등록

사용자는 물품명, 설명, Listed Price, 카테고리, 이미지 URL, 공개 여부를 입력하여 물품을 등록한다. 카테고리는 자유 입력이 아니라 드롭다운 선택 방식이다.

카테고리는 다음 값 중 하나를 사용한다.

- 패션
- 악세사리
- 전자기기
- 문구
- 수집품
- 음반
- 게임
- 기타

공개 여부는 Public 또는 Private 중 하나로 선택한다.

- Public: Market에 노출되며 검색 가능하고 다른 사용자도 Item Detail을 조회할 수 있다.
- Private: Market과 검색 결과에 노출되지 않으며 소유자만 서비스 UI에서 조회할 수 있다.

블록체인 특성상 온체인에 저장된 데이터는 네트워크 수준에서 완전한 비밀 데이터가 아니다. MVP의 Private은 서비스 UI에서의 미노출과 접근 제한 정책으로 정의한다.

### Market 공개 탐색

Market은 등록된 Public 물품을 탐색하고 상세 페이지에서 소유권 이력과 현재 소유자를 확인할 수 있는 공개 탐색 화면이다. Market에서는 실제 거래, 구매, 결제, 채팅, 배송이 일어나지 않는다.

Market 기능은 다음과 같다.

- 공개 물품 목록 조회
- 검색
- 카테고리 필터
- Item Detail 이동

Market 카드에는 현재 소유자 주소를 표시하지 않는다. 카드에는 대표 이미지, 물품명, Listed Price, 카테고리만 표시한다.

Market 카드에는 구매 기능으로 오해될 수 있는 장바구니, 가방 아이콘을 사용하지 않는다. 카드 이동 버튼은 Detail 이동을 의미하는 화살표 또는 상세 보기 아이콘으로 처리한다. `Certificate`, `Ownership Record`, `Authenticated` 같은 임의 인증 태그는 사용하지 않고, 문서에 정의된 카테고리만 표시한다.

### 물품 상세 조회

Item Detail은 물품의 대표 이미지, 물품명, 카테고리, Listed Price, 설명, 현재 소유자 주소, 거래 이력을 표시한다. 현재 소유자 주소는 `0x1234...ABCD` 형식으로 축약 표시한다.

거래 이력은 최근 5건만 기본 표시한다. 사용자는 `전체 거래 이력 보기` 버튼을 통해 해당 물품의 전체 거래 이력을 확인할 수 있다.

현재 로그인 사용자가 현재 소유자인 경우에만 `소유권 이전` 버튼을 표시한다. 공개/비공개 전환 기능도 현재 소유자에게만 제공한다.

Item Detail 시안에 보이는 `Authenticated`, USD 환산, 공유, 좋아요 등은 MVP 필수 기능이 아니다. 특히 `Authenticated`는 실물 인증 또는 진품 인증으로 오해될 수 있으므로 구현하지 않는다.

### My Items

My Items는 현재 연결된 지갑 기준으로 물품을 확인하는 화면이다. 탭은 다음 두 개로 구성한다.

- Owned: 현재 내가 소유 중인 물품
- Transferred: 과거 내가 소유했지만 다른 사용자에게 이전한 물품

Owned와 Transferred는 My Items 화면에서만 사용하는 분류이다. Market에서는 Owned 또는 Transferred 상태를 표시하지 않는다.

### 소유권 이전

현재 소유자는 Public 상태의 물품만 다른 지갑 주소로 이전할 수 있다. Private 물품을 이전하려면 먼저 Public으로 전환해야 한다.

Transfer Ownership 화면 입력 항목은 다음과 같다.

- 새 소유자 지갑 주소
- 붙여넣기 버튼
- 실제 거래 가격인 Transaction Price

주소는 입력 즉시 Ethereum 주소 형식을 검증한다. 잘못된 주소 입력 시 `올바른 Ethereum 주소를 입력해주세요.` 메시지를 표시하고 소유권 이전 버튼을 비활성화한다.

MetaMask 승인 거부 시 별도 페이지나 모달 없이 `트랜잭션이 취소되었습니다.` 토스트 메시지로 처리한다.

### 소유권 이전 성공 상태

소유권 이전 성공 시 별도 페이지로 이동하지 않고 성공 모달을 표시한다.

성공 모달 표시 정보는 다음과 같다.

- 새 소유자 주소
- 거래 가격
- Transaction Hash
- 확인 버튼

확인 버튼을 누르면 Item Detail 화면으로 돌아가 최신 소유자와 거래 이력을 확인할 수 있다.

### Transaction History

Transaction History는 전체 서비스 거래 내역이 아니라 내가 참여한 거래만 보여주는 화면이다.

표시 대상은 다음과 같다.

- 내가 이전 소유자인 거래
- 내가 새로운 소유자인 거래

표시 정보는 다음과 같다.

- 물품명
- 거래 날짜
- 이전 소유자
- 새로운 소유자
- 거래 가격, Transaction Price
- Tx Hash

## 1.5 사용자 시나리오

### 시나리오 1: 사용자가 서비스에 접속하고 지갑을 연결한다

1. 사용자가 Chrome 브라우저에서 ChainTrust에 접속한다.
2. Home 화면에서 `시작하기` 또는 지갑 연결 버튼을 클릭한다.
3. MetaMask 연결 요청이 표시된다.
4. 사용자가 연결을 승인한다.
5. ChainTrust는 연결된 지갑 주소를 축약 형태로 표시한다.
6. 사용자는 Market, Register Item, My Items, Transaction History 화면을 이용할 수 있다.

### 시나리오 2: 사용자가 물품을 등록한다

1. 사용자가 `Register Item` 화면으로 이동한다.
2. 물품명, 설명, Listed Price, 카테고리, 이미지 URL, 공개 여부를 입력한다.
3. `Register` 버튼을 클릭한다.
4. MetaMask에서 트랜잭션 승인 요청이 표시된다.
5. 사용자가 트랜잭션을 승인한다.
6. React Web은 ethers.js를 통해 UsedMarket Smart Contract의 `registerItem` 함수를 호출한다.
7. Smart Contract에 물품 정보가 등록된다.
8. 등록자의 지갑 주소가 최초 소유자로 저장된다.
9. 등록 완료 상태가 Register Item 화면 안에 표시된다.
10. 사용자는 Item Detail 또는 Market으로 이동할 수 있다.

### 시나리오 3: 외부 거래 완료 후 소유권을 이전한다

1. 사용자 A와 B가 외부 플랫폼 또는 개인 간 채널에서 거래를 완료한다.
2. 현재 소유자 A가 ChainTrust에 접속한다.
3. A가 기존 등록 물품의 Item Detail로 이동한다.
4. A가 `소유권 이전` 버튼을 클릭한다.
5. A가 새 소유자 B의 지갑 주소와 Transaction Price를 입력한다.
6. A가 MetaMask로 소유권 이전 트랜잭션을 승인한다.
7. Smart Contract가 A가 현재 소유자인지 검증한다.
8. 소유권이 A에서 B로 이전된다.
9. 거래 이력에 `from`, `to`, `transactionPrice`, `timestamp`가 저장된다.
10. 프론트엔드는 `tx.hash` 또는 이벤트 로그에서 Tx Hash를 표시한다.
11. 성공 모달이 표시된다.
12. 확인 후 Item Detail에서 최신 소유자와 거래 이력을 확인한다.

### 시나리오 4: 새 소유자 B가 My Items에서 물품을 확인한다

1. B가 MetaMask 지갑을 연결한다.
2. `My Items` 화면으로 이동한다.
3. Owned 탭에서 현재 B가 소유자인 물품을 확인한다.
4. A는 Transferred 탭에서 과거 소유했지만 이전한 물품을 확인할 수 있다.

### 시나리오 5: 사용자가 Market에서 공개 물품을 탐색한다

1. 사용자가 `Market` 화면으로 이동한다.
2. ChainTrust는 Public 물품 목록을 조회한다.
3. 사용자는 검색어 또는 카테고리 필터로 물품을 탐색한다.
4. Market 카드에는 대표 이미지, 물품명, Listed Price, 카테고리가 표시된다.
5. 사용자가 카드를 클릭하면 Item Detail로 이동한다.
6. Item Detail에서 현재 소유자와 소유권 이력을 확인한다.

### 시나리오 6: 사용자가 Transaction History를 확인한다

1. 사용자가 MetaMask 지갑을 연결한다.
2. `Transaction History` 화면으로 이동한다.
3. ChainTrust는 현재 지갑 주소가 `from` 또는 `to`에 포함된 거래 이력만 표시한다.
4. 사용자는 물품명, 거래 날짜, 이전 소유자, 새로운 소유자, Transaction Price, Tx Hash를 확인한다.

## 1.6 기대 효과

- 한정판, 희귀품, 수집품의 소유권 이전 기록을 블록체인에 남겨 위변조 가능성을 낮출 수 있다.
- 사용자는 물품의 현재 소유자와 과거 거래 이력을 확인할 수 있다.
- 외부 거래 플랫폼에서 거래가 완료된 뒤에도 소유권 이력을 별도로 보존할 수 있다.
- Listed Price와 Transaction Price를 구분하여 등록 시점의 기준 가격과 실제 이전 시점의 거래 가격을 분리해 관리할 수 있다.
- React, MetaMask, ethers.js, Smart Contract 연동 구조를 학습하고 구현할 수 있다.

---

# 2. SRS

## 2.1 시스템 개요

본 시스템은 React 기반 웹 프론트엔드, MetaMask, ethers.js, Ethereum Sepolia Testnet, UsedMarket Smart Contract로 구성된다.

사용자는 웹 브라우저에서 React Web에 접속하고 MetaMask를 통해 지갑을 연결한다. React Web은 ethers.js를 사용하여 MetaMask Provider와 통신하며, 사용자의 조회 요청과 트랜잭션 요청을 Ethereum Sepolia Testnet에 배포된 UsedMarket Smart Contract로 전달한다.

UsedMarket Smart Contract는 여러 물품의 정보, 현재 소유자, 공개 여부, 소유권 이전 이력을 관리한다. 문서에서 사용하는 거래 이력은 실제 결제 내역이 아니라 소유권 이전 기록을 의미한다.

본 MVP는 백엔드 서버와 DB를 사용하지 않는다. 모든 핵심 데이터는 UsedMarket Smart Contract 조회 결과, MetaMask 지갑 상태, 프론트엔드 상태로 처리한다.

Smart Contract 배포는 개발자가 프로젝트 초기 설정 단계에서 1회 수행한다. 사용자가 접근하는 React 프론트엔드에는 Smart Contract 배포 화면이나 배포 기능을 제공하지 않는다.

## 2.2 기능 요구사항 (FR)

### FR-001 MetaMask 로그인

사용자는 Chrome 브라우저에 설치된 MetaMask를 통해 지갑을 연결할 수 있어야 한다.

상세 설명:

- 사용자는 Home 또는 공통 헤더에서 지갑 연결 버튼을 클릭할 수 있어야 한다.
- 시스템은 MetaMask 설치 여부를 확인해야 한다.
- MetaMask가 설치되어 있지 않은 경우 설치 안내 메시지를 표시해야 한다.
- 사용자가 연결을 승인하면 시스템은 지갑 주소를 가져와 축약 표시해야 한다.
- 별도의 이메일, 비밀번호 기반 회원가입 또는 로그인은 제공하지 않는다.

### FR-002 Sepolia 네트워크 확인

시스템은 사용자가 Ethereum Sepolia Testnet에 연결되어 있는지 확인해야 한다.

상세 설명:

- 사용자의 MetaMask 네트워크가 Sepolia가 아닌 경우 경고 메시지를 표시해야 한다.
- 시스템은 Sepolia 네트워크로 전환하도록 안내해야 한다.
- 물품 등록, 정보 수정, 공개 여부 변경, 소유권 이전은 Sepolia 네트워크에서만 수행되어야 한다.

### FR-003 물품 등록

사용자는 한정판, 희귀품, 수집품 등 인증 대상 물품을 등록할 수 있어야 한다.

상세 설명:

- MVP에서는 누구나 물품을 등록할 수 있다.
- 등록 항목은 물품명, 설명, Listed Price, 카테고리, 이미지 URL, 공개 여부이다.
- Listed Price는 물품 등록 시 입력하는 등록 가격이다.
- Listed Price는 실제 결제 금액이 아니라 표시 및 기록용 정수값이다.
- 카테고리는 드롭다운 선택 방식이어야 한다.
- 카테고리는 패션, 악세사리, 전자기기, 문구, 수집품, 음반, 게임, 기타 중 하나여야 한다.
- 이미지 파일 업로드는 지원하지 않고 이미지 URL 입력 방식만 지원한다.
- 공개 여부는 Public 또는 Private 중 하나여야 한다.
- 등록자의 지갑 주소는 해당 물품의 최초 소유자로 저장되어야 한다.
- 등록 성공 후 별도 완료 페이지로 이동하지 않고 Register Complete State를 표시해야 한다.
- MVP에서는 실물 보유 여부, 정품 여부, 진품 여부를 검증하지 않는다.

### FR-004 Market 공개 물품 탐색

사용자는 Market 화면에서 Public 물품을 탐색할 수 있어야 한다.

상세 설명:

- Market은 실제 결제, 구매, 채팅, 배송이 일어나는 화면이 아니다.
- Market은 등록된 공개 물품을 탐색하고 Item Detail로 이동하는 공개 탐색 화면이다.
- Market에는 Public 물품만 표시해야 한다.
- Private 물품은 Market에 노출하지 않아야 한다.
- Market은 검색 기능을 제공해야 한다.
- Market은 카테고리 필터를 제공해야 한다.
- Market 카드에는 현재 소유자 주소를 표시하지 않아야 한다.
- Market 카드 태그는 카테고리만 사용해야 한다.
- 사용자는 특정 물품을 선택하여 Item Detail로 이동할 수 있어야 한다.

### FR-005 물품 상세 조회

사용자는 특정 물품의 상세 정보를 조회할 수 있어야 한다.

상세 설명:

- Item Detail은 대표 이미지, 물품명, 카테고리, Listed Price, 설명, 현재 소유자 주소, 거래 이력을 표시해야 한다.
- 현재 소유자 주소는 축약 표시해야 한다.
- 거래 이력은 최근 5건만 기본 표시해야 한다.
- `전체 거래 이력 보기` 버튼을 제공해야 한다.
- `전체 거래 이력 보기` 클릭 시 해당 물품의 전체 거래 이력을 확인할 수 있어야 한다.
- Public 물품은 다른 사용자도 Item Detail을 조회할 수 있어야 한다.
- Private 물품은 현재 소유자만 서비스 UI에서 조회할 수 있어야 한다.
- 현재 로그인 사용자가 현재 소유자인 경우에만 `소유권 이전` 버튼을 표시해야 한다.
- 공개/비공개 전환 기능은 현재 소유자에게만 제공해야 한다.

### FR-006 공개 여부 전환

현재 소유자는 물품의 공개 여부를 Public 또는 Private으로 전환할 수 있어야 한다.

상세 설명:

- 물품 삭제 기능은 제공하지 않는다.
- 현재 소유자만 공개 여부를 변경할 수 있어야 한다.
- Public 물품은 Market에 노출되고 검색 가능해야 한다.
- Private 물품은 Market과 검색 결과에 노출되지 않아야 한다.
- 소유권 이전은 Public 상태의 물품만 가능해야 한다.
- Private 물품을 이전하려면 먼저 Public으로 전환해야 한다.

### FR-007 물품 정보 수정

현재 소유자는 소유권 이전 전까지만 물품 정보를 수정할 수 있어야 한다.

상세 설명:

- 수정 가능 항목은 물품명, 설명, Listed Price, 카테고리, 이미지 URL, 공개 여부이다.
- 소유권 이전 이력이 하나라도 존재하면 물품 정보 수정은 불가능해야 한다.
- 물품 삭제 기능은 제공하지 않는다.

### FR-008 My Items

사용자는 자신과 관련된 물품을 Owned와 Transferred 탭으로 조회할 수 있어야 한다.

상세 설명:

- My Items는 탭 구조로 제공한다.
- Owned 탭은 현재 내가 소유 중인 물품을 표시한다.
- Transferred 탭은 과거 내가 소유했지만 다른 사용자에게 이전한 물품을 표시한다.
- Owned와 Transferred는 My Items 화면에서만 사용하는 분류이다.
- Market에서는 Owned 또는 Transferred 상태를 표시하지 않는다.

### FR-009 소유권 이전

현재 소유자는 Public 물품의 소유권을 다른 사용자에게 이전할 수 있어야 한다.

상세 설명:

- 현재 소유자만 Transfer Ownership 화면에 접근할 수 있어야 한다.
- Private 물품은 소유권 이전할 수 없어야 한다.
- 사용자는 새 소유자 지갑 주소를 입력할 수 있어야 한다.
- 주소 붙여넣기 버튼을 제공해야 한다.
- 사용자는 Transaction Price를 입력할 수 있어야 한다.
- Transaction Price는 실제 거래 가격이며 거래 이력에 기록해야 한다.
- 주소는 입력 즉시 Ethereum 주소 형식을 검증해야 한다.
- 잘못된 주소 입력 시 `올바른 Ethereum 주소를 입력해주세요.` 메시지를 표시하고 소유권 이전 버튼을 비활성화해야 한다.
- MetaMask 승인 거부 시 별도 페이지나 모달 없이 `트랜잭션이 취소되었습니다.` 토스트 메시지를 표시해야 한다.
- 소유권 이전 성공 시 성공 모달을 표시해야 한다.
- 성공 모달에는 새 소유자 주소, 거래 가격, Transaction Hash, 확인 버튼이 포함되어야 한다.
- 확인 후 Item Detail 화면으로 돌아가 최신 소유자와 거래 이력을 확인할 수 있어야 한다.

### FR-010 거래 이력 생성

소유권 이전이 성공하면 거래 이력이 생성되어야 한다.

상세 설명:

- 거래 이력은 소유권 이전 트랜잭션이 성공한 경우에만 생성되어야 한다.
- 거래 이력에는 이전 소유자 주소, 새로운 소유자 주소, Transaction Price, 거래 시각이 포함되어야 한다.
- Transaction Hash는 Smart Contract에 직접 저장하지 않는다.
- 프론트엔드는 `tx.hash`, 트랜잭션 receipt, 또는 `OwnershipTransferred` 이벤트 로그에서 Transaction Hash를 표시해야 한다.

### FR-011 Transaction History

사용자는 자신이 참여한 거래 이력만 조회할 수 있어야 한다.

상세 설명:

- Transaction History는 전체 서비스 거래 내역이 아니라 내가 참여한 거래만 보여주는 화면이다.
- 내가 이전 소유자인 거래를 표시해야 한다.
- 내가 새로운 소유자인 거래를 표시해야 한다.
- 표시 정보는 물품명, 거래 날짜, 이전 소유자, 새로운 소유자, Transaction Price, Tx Hash이다.
- MVP 구현은 `getAllItems()`와 `getTransactionHistory(itemId)`를 조합해 전체 거래 이력을 가져온 뒤 프론트엔드에서 현재 지갑 주소가 `from` 또는 `to`에 포함된 이력만 필터링한다.

### FR-012 Smart Contract 배포 제외

사용자 화면에는 Smart Contract 배포 기능을 제공하지 않아야 한다.

상세 설명:

- UsedMarket Smart Contract는 개발자가 프로젝트 초기 설정 단계에서 Sepolia Testnet에 1회 배포한다.
- 프론트엔드는 사전에 설정된 Contract Address와 ABI를 사용한다.
- 프론트엔드는 이벤트 로그 조회를 위해 Contract 배포 블록 번호를 설정값으로 가질 수 있다.
- 물품 등록은 새로운 Smart Contract 배포가 아니라 이미 배포된 UsedMarket Smart Contract의 `registerItem` 함수를 호출하는 방식이다.

### FR-013 MVP 제외 기능

MVP에서는 다음 기능을 제공하지 않는다.

- 앱 내 구매
- 실제 결제
- 채팅
- 배송
- 회원가입
- 관리자 기능
- 백엔드 서버
- DB
- 이미지 파일 업로드
- IPFS 업로드 또는 IPFS 저장 안내
- 장바구니 또는 구매 의미 아이콘
- 임의 인증 태그, 예: Certificate, Ownership Record, Authenticated
- USD 환산 표시
- Gas Fee 표시
- Export CSV
- Filter By Date
- 전체 기록 불러오기
- 좋아요 또는 공유 기능
- 물품 삭제
- 실물 보유 검증
- 정품 여부 검증
- 진품 여부 검증

## 2.3 비기능 요구사항 (NFR)

### NFR-001 Chrome 지원

서비스는 Chrome 브라우저에서 정상 동작해야 한다.

### NFR-002 Sepolia 네트워크 사용

모든 Smart Contract 트랜잭션은 Ethereum Sepolia Testnet에서 수행되어야 한다.

### NFR-003 MetaMask 필수

사용자는 MetaMask를 통해 지갑 연결과 트랜잭션 승인을 수행해야 한다.

### NFR-004 블록체인 데이터 무결성

소유권 이전 이력은 Smart Contract 상태 또는 이벤트 기반으로 블록체인에 기록되어야 하며, 기존 거래 이력은 삭제 또는 수정할 수 없어야 한다.

### NFR-005 사용성

시스템은 트랜잭션 승인, 대기, 성공, 실패, 취소 상태를 사용자가 이해할 수 있도록 명확히 표시해야 한다.

### NFR-006 보안성

프론트엔드는 사용자의 개인키, 시드 문구, MetaMask 비밀번호를 요구하거나 저장해서는 안 된다.

### NFR-007 성능

MVP는 소규모 데이터셋을 전제로 `getAllItems()` 기반 조회를 사용한다. 데이터가 증가하는 확장 단계에서는 페이지네이션 또는 `getItemCount()`와 `getItem(itemId)` 조합으로 개선한다.

### NFR-008 가격 단위 처리

Listed Price와 Transaction Price는 MVP에서 ETH 단위로 화면에 표시한다.

상세 설명:

- ETH 표기는 결제 기능이 아니라 가격 기록 및 표시 단위이다.
- 실제 결제 트랜잭션, 송금, 정산 기능은 제공하지 않는다.
- Smart Contract에는 `uint256`으로 저장해야 하므로 프론트엔드는 ETH 입력값을 wei 단위로 변환하여 전달하는 방식을 권장한다.
- 화면 표시 시에는 저장된 wei 값을 ETH 단위로 변환하여 표시한다.

---

# 3. 화면 설계서

필수 화면은 Home, Market, Register Item, My Items, Item Detail, Transaction History, Transfer Ownership으로 정의한다.

UI는 `designs` 폴더의 PNG 시안을 기준으로 구현하되, 기능과 데이터 표시 정책은 본 문서를 우선한다. 시안에 포함되어 있더라도 파일 업로드, IPFS 문구, 임의 인증 태그, 장바구니 아이콘, USD 환산, Gas Fee, Export CSV, Filter By Date, 전체 기록 불러오기, 좋아요, 공유 기능은 MVP에서 구현하지 않는다.

Item Detail 화면은 `designs/Item Detail - Ownership Verification (Matching Style).png`를 최신 시안으로 사용한다.

## Home

### 화면 목적

ChainTrust의 진입 화면이다. Dashboard가 아니라 소유권 이력 인증 서비스의 정체성을 보여주고, 주요 기능으로 이동할 수 있도록 한다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| Header                                           |
| ChainTrust                 [Connect Wallet]      |
+--------------------------------------------------+
| Hero Banner                                      |
| 한정판·희귀품·수집품 소유권 이력 인증 서비스     |
| 외부 거래 후 소유권 이전 기록을 블록체인에 보존  |
| [시작하기] [마켓 둘러보기]                       |
+--------------------------------------------------+
| Quick Actions                                    |
| [아이템 등록] [내 가방] [거래 내역]              |
+--------------------------------------------------+
| 최근 등록 물품                                   |
| [Item Card] [Item Card] [Item Card]              |
+--------------------------------------------------+
```

### 화면 구성요소

- Header
- Hero Banner
- 시작하기 버튼
- 마켓 둘러보기 버튼
- 아이템 등록 버튼
- 내 가방 버튼
- 거래 내역 버튼
- 최근 등록 물품 목록
- 지갑 연결 상태 표시

### 표시 요소

- 서비스명
- 소유권 이력 인증 서비스 설명
- 연결된 지갑 주소, 축약 표시
- 현재 네트워크
- 최근 등록 Public 물품

### 사용자 동작

- MetaMask 지갑 연결
- 시작하기 클릭
- 마켓 둘러보기 클릭
- 아이템 등록 이동
- 내 가방 이동
- 거래 내역 이동
- 최근 등록 물품 클릭

### 기능

- 지갑 연결 요청
- Sepolia 네트워크 확인
- 최근 등록 Public 물품 조회
- 주요 화면 진입점 제공

### 데이터 소스

- MetaMask Provider
- UsedMarket Smart Contract
- 프론트엔드 환경 설정값

### Smart Contract 연동 함수

- `getAllItems()`

### 화면 전환 흐름

- Home → Market
- Home → Register Item
- Home → My Items
- Home → Transaction History
- Home → Item Detail

### 예외 처리

- MetaMask 미설치 시 설치 안내
- 지갑 연결 거부 시 실패 메시지
- Sepolia가 아닌 경우 네트워크 전환 안내
- 최근 등록 물품 조회 실패 시 빈 상태 또는 오류 메시지

### 상태 변화

```text
초기 진입
  → 지갑 연결 상태 확인
  → 네트워크 확인
  → 최근 Public 물품 조회
  → 화면 표시
```

## Market

### 화면 목적

등록된 Public 물품을 탐색하고 Item Detail로 이동하는 공개 탐색 화면이다. Market은 거래가 일어나는 공간이 아니며 구매, 결제, 채팅, 배송 기능을 제공하지 않는다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| Header                                           |
| [Home] [Market] [Register Item] [My Items]       |
| [Transaction History]                            |
+--------------------------------------------------+
| Market                                           |
| Search: [____________________]                   |
| Category: [전체 v]                               |
+--------------------------------------------------+
| [Image] 물품명       Listed Price     [카테고리] |
| [Image] 물품명       Listed Price     [카테고리] |
| [Image] 물품명       Listed Price     [카테고리] |
+--------------------------------------------------+
```

### 화면 구성요소

- 검색 입력창
- 카테고리 필터
- Public 물품 목록
- Item Card
- 이미지 썸네일
- 물품명
- Listed Price
- 카테고리 태그
- Empty State

### 표시 요소

- Public 물품 수
- 대표 이미지
- 물품명
- Listed Price
- 카테고리

Market 카드에는 현재 소유자 주소, Owned, Transferred 상태를 표시하지 않는다.

### 사용자 동작

- 검색어 입력
- 카테고리 선택
- Item Card 클릭
- Register Item 이동

### 기능

- Public 물품 목록 조회
- 검색 필터링
- 카테고리 필터링
- Item Detail 이동
- 구매 의미가 있는 장바구니 또는 가방 아이콘은 사용하지 않고 Detail 이동 아이콘 또는 화살표만 제공

### 데이터 소스

- UsedMarket Smart Contract
- ethers.js Contract Instance
- 프론트엔드 검색어 상태
- 프론트엔드 카테고리 필터 상태

### Smart Contract 연동 함수

- `getAllItems()`

MVP에서는 `getAllItems()` 결과 중 `isPublic == true`인 물품만 프론트엔드에서 필터링한다.

### 화면 전환 흐름

- Market → Item Detail
- Market → Register Item
- Market → Home

### 예외 처리

- 조회 실패 시 오류 메시지 표시
- Public 물품이 없을 경우 빈 목록 표시
- 이미지 URL 오류 시 기본 이미지 표시

### 상태 변화

```text
화면 진입
  → 전체 물품 조회
  → Public 물품 필터링
  → 검색/카테고리 필터 적용
  → 목록 표시
```

## Register Item

### 화면 목적

사용자가 인증 대상 물품을 등록할 수 있도록 한다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| Register Item                                    |
+--------------------------------------------------+
| Name:          [________________________]        |
| Description:   [________________________]        |
| Listed Price:  [________________________]        |
| Category:      [패션 v]                          |
| Image URL:     [________________________]        |
| Visibility:    ( ) Public  ( ) Private           |
|                                                  |
| [Register]                                      |
+--------------------------------------------------+
| Register Complete State                          |
| Item ID / Owner / Transaction Hash               |
| [View Item Detail] [Go to Market]                |
+--------------------------------------------------+
```

### 화면 구성요소

- 물품명 입력 필드
- 설명 입력 필드
- Listed Price 입력 필드
- 카테고리 드롭다운
- 이미지 URL 입력 필드
- 이미지 URL 미리보기 영역
- Public/Private 선택 컨트롤
- Register 버튼
- Register Complete State

### 표시 요소

- 입력값 검증 메시지
- 이미지 URL 미리보기
- 트랜잭션 진행 상태
- 등록 완료 메시지
- Item ID
- Owner 주소
- Transaction Hash

### 사용자 동작

- 물품 정보 입력
- 카테고리 선택
- 공개 여부 선택
- Register 클릭
- MetaMask 트랜잭션 승인
- Item Detail 또는 Market 이동

### 기능

- 필수 입력값 검증
- 카테고리 선택값 검증
- 이미지 URL 형식 검증
- 이미지 URL 기반 미리보기 표시
- UsedMarket Smart Contract의 `registerItem` 호출
- 등록 완료 상태 표시

### 데이터 소스

- 사용자 입력값
- MetaMask Provider
- UsedMarket Smart Contract
- 트랜잭션 receipt

### Smart Contract 연동 함수

- `registerItem(name, description, listedPrice, category, imageUrl, isPublic)`

### 화면 전환 흐름

- Register Item → Item Detail
- Register Item → Market

### 예외 처리

- 필수 입력값 누락 시 메시지 표시
- Listed Price가 0 이하인 경우 오류 표시
- 카테고리 미선택 시 오류 표시
- 이미지 URL 형식 오류 시 오류 표시
- 이미지 URL 미리보기 로딩 실패 시 기본 이미지 또는 미리보기 실패 메시지 표시
- MetaMask 승인 거부 시 토스트 메시지 표시
- 트랜잭션 실패 시 오류 메시지 표시

### 상태 변화

```text
입력 중
  → 검증 통과
  → MetaMask 승인 요청
  → 트랜잭션 대기
  → 등록 성공
  → Register Complete State 표시
```

## My Items

### 화면 목적

현재 연결된 지갑 주소와 관련된 물품을 Owned와 Transferred 탭으로 확인한다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| My Items                                         |
| [Owned] [Transferred]                            |
+--------------------------------------------------+
| Owned                                            |
| [Image] 물품명 / Listed Price / Category         |
| [Detail]                                         |
+--------------------------------------------------+
| Transferred                                      |
| [Image] 물품명 / Last Transfer Date / To         |
| [Detail]                                         |
+--------------------------------------------------+
```

### 화면 구성요소

- Owned 탭
- Transferred 탭
- 물품 목록
- Item Card
- Detail 버튼
- Empty State

### 표시 요소

- Owned 탭: 현재 내가 소유 중인 물품
- Transferred 탭: 과거 내가 소유했지만 다른 사용자에게 이전한 물품
- 물품명
- 대표 이미지
- Listed Price
- 카테고리
- 최근 이전 정보

### 사용자 동작

- 탭 전환
- 물품 상세 이동
- 지갑 연결

### 기능

- 현재 지갑 주소 기준 Owned 물품 필터링
- 현재 지갑 주소 기준 Transferred 물품 필터링
- Item Detail 이동

### 데이터 소스

- MetaMask 연결 지갑 주소
- UsedMarket Smart Contract
- 거래 이력 조회 결과

### Smart Contract 연동 함수

- `getAllItems()`
- `getTransactionHistory(itemId)`

### 화면 전환 흐름

- My Items → Item Detail
- My Items → Transfer Ownership, Item Detail에서 현재 소유자 권한 확인 후 이동

### 예외 처리

- 지갑 미연결 시 연결 안내 표시
- 관련 물품이 없을 경우 Empty State 표시
- 조회 실패 시 오류 메시지 표시

### 상태 변화

```text
화면 진입
  → 지갑 주소 확인
  → 전체 물품 및 거래 이력 조회
  → Owned / Transferred 분류
  → 탭별 목록 표시
```

## Item Detail

### 화면 목적

물품의 상세 정보, 현재 소유자, 최근 거래 이력, 전체 거래 이력을 확인할 수 있도록 한다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| Item Detail                                      |
+--------------------------------------------------+
| [Representative Image]                           |
| Name                                             |
| Category                                         |
| Listed Price                                     |
| Description                                      |
| Current Owner: 0x1234...ABCD                     |
| Visibility: Public / Private                     |
+--------------------------------------------------+
| Recent Transaction History                       |
| From → To / Transaction Price / Date / Tx Hash   |
| From → To / Transaction Price / Date / Tx Hash   |
| [전체 거래 이력 보기]                            |
+--------------------------------------------------+
| Owner Actions                                    |
| [소유권 이전] [Public/Private 전환] [정보 수정]  |
+--------------------------------------------------+
```

### 화면 구성요소

- 대표 이미지
- 물품명
- 카테고리
- Listed Price
- 설명
- 현재 소유자 주소
- 공개 여부 표시
- 최근 거래 이력 목록
- 전체 거래 이력 보기 버튼
- 소유권 이전 버튼
- 공개/비공개 전환 버튼
- 정보 수정 버튼

### 표시 요소

- 대표 이미지
- 물품명
- 카테고리
- Listed Price
- 설명
- 현재 소유자 주소, 축약 표시
- 최근 거래 이력 5건
- Transaction Price
- Tx Hash

Item Detail에는 실물 인증 또는 진품 인증으로 오해될 수 있는 `Authenticated`, `Verified Digital Certificate` 태그를 표시하지 않는다. USD 환산, 좋아요, 공유 기능도 MVP에서는 표시하지 않는다.

### 사용자 동작

- 전체 거래 이력 보기
- 소유권 이전 화면 이동
- 공개/비공개 전환
- 정보 수정
- Market으로 돌아가기

### 기능

- 물품 상세 조회
- 현재 소유자 주소 축약 표시
- 최근 5건 거래 이력 표시
- 전체 거래 이력 보기
- 현재 소유자에게만 소유권 이전 버튼 표시
- 현재 소유자에게만 공개/비공개 전환 제공
- 소유권 이전 전까지만 정보 수정 제공

`전체 거래 이력 보기`는 Transaction History 화면으로 이동하는 기능이 아니다. Item Detail 내부에서 해당 물품의 전체 거래 이력을 확장 표시하거나 별도 모달로 표시한다. Transaction History 화면은 현재 연결된 지갑 주소가 참여한 거래만 보여주는 별도 화면이다.

### 데이터 소스

- UsedMarket Smart Contract
- MetaMask 연결 지갑 주소
- 이벤트 로그 또는 트랜잭션 receipt

### Smart Contract 연동 함수

- `getItem(itemId)`
- `getTransactionHistory(itemId)`
- `setItemVisibility(itemId, isPublic)`
- `updateItem(itemId, name, description, listedPrice, category, imageUrl, isPublic)`

### 화면 전환 흐름

- Item Detail → Transfer Ownership
- Item Detail → Market
- Item Detail 내부 전체 거래 이력 확장 또는 모달 표시, `전체 거래 이력 보기` 클릭

### 예외 처리

- 존재하지 않는 itemId 접근 시 오류 표시
- Private 물품에 비소유자가 접근하면 접근 불가 메시지 표시
- 현재 소유자가 아닌 경우 소유자 액션 숨김
- 소유권 이전 이력이 있는 경우 정보 수정 비활성화

### 상태 변화

```text
화면 진입
  → 물품 상세 조회
  → 권한 확인
  → 최근 거래 이력 조회
  → 소유자 액션 표시 여부 결정
```

## Transaction History

### 화면 목적

현재 연결된 지갑 주소가 참여한 거래 이력만 보여준다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| Transaction History                              |
+--------------------------------------------------+
| Item Name | Date | From | To | Tx Price | Tx Hash |
| Item A    | ...  | ...  | ...| ...   | 0x...     |
| Item B    | ...  | ...  | ...| ...   | 0x...     |
+--------------------------------------------------+
```

### 화면 구성요소

- 거래 이력 목록
- 거래 이력 Row
- Item Detail 이동 버튼
- Empty State

### 표시 요소

- 물품명
- 거래 날짜
- 이전 소유자
- 새로운 소유자
- Transaction Price
- Tx Hash

Transaction History에는 달러 환산, Gas Fee, Export CSV, Filter By Date, 전체 기록 불러오기 기능을 제공하지 않는다.

### 사용자 동작

- 거래 이력 조회
- Item Detail 이동
- Tx Hash 확인

### 기능

- 현재 지갑 주소가 `from` 또는 `to`에 포함된 거래만 표시
- Transaction Price 표시
- Tx Hash 표시
- Item Detail 이동

### 데이터 소스

- MetaMask 연결 지갑 주소
- UsedMarket Smart Contract
- `OwnershipTransferred` 이벤트 로그

### Smart Contract 연동 함수

- `getAllItems()`
- `getTransactionHistory(itemId)`

### 화면 전환 흐름

- Transaction History → Item Detail
- Transaction History → Home
- Transaction History → Market

### 예외 처리

- 지갑 미연결 시 연결 안내 표시
- 참여 거래가 없을 경우 Empty State 표시
- 이벤트 로그 매핑 실패 시 Tx Hash를 `조회 불가`로 표시

### 상태 변화

```text
화면 진입
  → 지갑 주소 확인
  → 전체 물품 조회
  → 물품별 거래 이력 조회
  → from/to 기준 필터링
  → 목록 표시
```

## Transfer Ownership

### 화면 목적

현재 소유자가 외부 거래 완료 후 새 소유자 지갑 주소와 Transaction Price를 입력하여 소유권 이전을 기록한다.

### ASCII 와이어프레임

```text
+--------------------------------------------------+
| Transfer Ownership                               |
+--------------------------------------------------+
| Item Name                                        |
| Current Owner: 0x1234...ABCD                     |
| New Owner Address: [__________________] [Paste]  |
| Transaction Price: [__________________]          |
| Error: 올바른 Ethereum 주소를 입력해주세요.      |
| [Transfer Ownership]                             |
+--------------------------------------------------+
| Success Modal                                    |
| New Owner / Transaction Price / Tx Hash          |
| [확인]                                           |
+--------------------------------------------------+
```

### 화면 구성요소

- 현재 물품 정보 요약
- 현재 소유자 주소
- 새 소유자 지갑 주소 입력 필드
- 붙여넣기 버튼
- Transaction Price 입력 필드
- 주소 검증 메시지
- 소유권 이전 버튼
- 성공 모달
- 토스트 메시지

### 표시 요소

- 물품명
- 현재 소유자 주소
- 새 소유자 주소
- Transaction Price
- Transaction Hash
- 성공 메시지

### 사용자 동작

- 새 소유자 주소 입력
- 붙여넣기
- Transaction Price 입력
- 소유권 이전 실행
- MetaMask 승인
- 성공 모달 확인

### 기능

- 현재 소유자 접근 제어
- Public 물품 여부 확인
- Ethereum 주소 즉시 검증
- Transaction Price 검증
- `transferOwnership` 호출
- MetaMask 승인 거부 시 토스트 메시지 표시
- 성공 모달 표시
- 확인 후 Item Detail 이동

### 데이터 소스

- UsedMarket Smart Contract
- MetaMask Provider
- 사용자 입력값
- 트랜잭션 receipt

### Smart Contract 연동 함수

- `getItem(itemId)`
- `transferOwnership(itemId, newOwner, transactionPrice)`
- `getTransactionHistory(itemId)`

### 화면 전환 흐름

- Item Detail → Transfer Ownership
- Transfer Ownership → Item Detail, 성공 모달 확인 후 이동

### 예외 처리

- 현재 소유자가 아닌 경우 접근 불가
- Private 물품인 경우 Public 전환 안내
- 잘못된 주소 입력 시 `올바른 Ethereum 주소를 입력해주세요.` 표시
- Transaction Price가 0 이하인 경우 오류 표시
- MetaMask 승인 거부 시 `트랜잭션이 취소되었습니다.` 토스트 표시
- 트랜잭션 실패 시 오류 메시지 표시

### 상태 변화

```text
화면 진입
  → 현재 소유자 검증
  → Public 여부 확인
  → 입력 대기
  → 주소/가격 검증
  → MetaMask 승인 요청
  → 트랜잭션 대기
  → 성공 모달 표시
  → 확인 후 Item Detail 이동
```

---

# 4. 시스템 구성도

## 전체 구조

```text
사용자
  ↓
React Web
  ↓
MetaMask
  ↓
ethers.js
  ↓
Ethereum Sepolia
  ↓
UsedMarket Smart Contract
```

## 구성요소 역할

### 사용자

MetaMask 지갑을 보유하고 ChainTrust에서 물품 등록, 공개 물품 탐색, 소유권 이전, 내 물품 확인, 거래 이력 확인을 수행한다.

### React Web

사용자가 직접 접속하는 웹 프론트엔드이다.

주요 역할:

- Home, Market, Register Item, My Items, Item Detail, Transaction History, Transfer Ownership 화면 제공
- MetaMask 연결 요청
- 사용자 입력값 검증
- 검색 및 카테고리 필터 처리
- Public/Private UI 접근 제어
- Owned/Transferred 분류 처리
- Transaction Hash 표시
- Smart Contract 조회 및 트랜잭션 호출

### MetaMask

사용자의 Ethereum 지갑 역할을 수행하는 Chrome 브라우저 확장 프로그램이다.

주요 역할:

- 지갑 주소 제공
- Sepolia 네트워크 연결
- 트랜잭션 승인 요청 표시
- 사용자 서명 처리
- 개인키 보호

### ethers.js

React Web과 Ethereum 네트워크를 연결하는 JavaScript 라이브러리이다.

주요 역할:

- Provider 및 Signer 생성
- Smart Contract 인스턴스 생성
- Contract 조회 함수 호출
- Contract 트랜잭션 함수 호출
- 트랜잭션 receipt 조회
- 이벤트 로그 조회
- ETH 입력값을 wei 단위로 변환하고, 저장된 wei 값을 ETH 표시값으로 변환

### Ethereum Sepolia

UsedMarket Smart Contract가 1회 배포되는 Ethereum 테스트 네트워크이다.

주요 역할:

- UsedMarket Smart Contract 실행 환경 제공
- 트랜잭션 기록
- 블록 생성
- 거래 시각 제공

### UsedMarket Smart Contract

한정판, 희귀품, 수집품 등 인증 대상 물품 정보, 현재 소유자, 공개 여부, 소유권 이전 이력을 관리하는 핵심 로직이다.

주요 역할:

- 물품 등록
- 물품 조회
- 물품 정보 수정
- 공개/비공개 전환
- 현재 소유자 관리
- 소유권 이전 권한 검증
- Transaction Price가 포함된 거래 이력 생성
- 거래 이력 조회

---

# 5. 스마트 컨트랙트 기능 정의

## 5.1 기본 원칙

UsedMarket Smart Contract는 개발자가 프로젝트 초기 설정 단계에서 Sepolia Testnet에 1회 배포한다. 물품마다 Smart Contract를 새로 배포하지 않는다.

사용자 프론트엔드는 Smart Contract 배포 기능을 제공하지 않는다. 물품 등록은 이미 배포된 UsedMarket Smart Contract의 `registerItem` 함수를 호출하는 방식이다.

Transaction Hash는 Smart Contract에 직접 저장하지 않는다. 프론트엔드는 `tx.hash`, 트랜잭션 receipt, 또는 `OwnershipTransferred` 이벤트 로그에서 Transaction Hash를 표시한다.

Listed Price와 Transaction Price는 화면에서 ETH 단위로 입력 및 표시한다. Smart Contract에는 `uint256`으로 저장해야 하므로 프론트엔드는 입력된 ETH 값을 wei 단위로 변환하여 전달하고, 조회한 wei 값을 ETH 단위 문자열로 변환하여 표시한다.

## 5.2 데이터 타입

### 공통 저장 기준

MVP 구현을 위해 Smart Contract는 전체 물품 조회가 가능하도록 순회 가능한 저장 구조를 가져야 한다.

- `nextItemId`: 다음에 발급할 itemId를 관리하는 증가값
- `mapping(uint256 => Item) items`: itemId 기준 물품 저장소
- `uint256[] itemIds`: `getAllItems()`에서 순회할 itemId 목록
- `mapping(uint256 => TransactionRecord[]) transactionHistories`: itemId 기준 거래 이력 저장소

`itemId`는 1부터 증가하는 정수로 발급한다. `0`은 유효하지 않은 itemId로 취급한다. 존재 여부는 `itemId > 0 && itemId < nextItemId` 또는 이에 준하는 방식으로 검증한다.

### Item

Smart Contract는 각 물품에 대해 다음 데이터를 관리해야 한다.

- `itemId`: `uint256`
- `name`: `string`
- `description`: `string`
- `listedPrice`: `uint256`
- `category`: `string`
- `imageUrl`: `string`
- `currentOwner`: `address`
- `isPublic`: `bool`
- `createdAt`: `uint256`

`visibility`라는 이름을 사용할 수도 있지만, MVP 구현에서는 Solidity에서 단순한 `bool isPublic` 사용을 권장한다.

### TransactionRecord

Smart Contract는 각 소유권 이전에 대해 다음 데이터를 관리해야 한다.

- `from`: `address`
- `to`: `address`
- `transactionPrice`: `uint256`
- `timestamp`: `uint256`

Transaction Hash는 `TransactionRecord`에 저장하지 않는다.

### 카테고리 저장 기준

카테고리는 Solidity에서는 `string`으로 저장하되, MVP에서는 프론트엔드 드롭다운에서 허용된 값만 선택하게 하여 입력을 제한한다. Smart Contract에서 문자열 카테고리 검증까지 구현할 수 있으나, MVP에서는 프론트엔드 검증을 기본으로 한다.

서비스 UI에서 표시하고 필터링하는 카테고리는 반드시 패션, 악세사리, 전자기기, 문구, 수집품, 음반, 게임, 기타 중 하나여야 한다. Smart Contract를 직접 호출해 허용 목록 밖의 문자열이 저장되는 경우는 MVP 서비스 UI의 정상 사용 흐름으로 보지 않는다. 필요 시 확장 단계에서 카테고리를 `enum` 또는 `uint8` 코드로 저장해 온체인 검증을 강화할 수 있다.

## 5.3 필수 함수 시그니처

구현 시 함수명과 역할은 다음 기준을 따른다.

- `registerItem(string name, string description, uint256 listedPrice, string category, string imageUrl, bool isPublic) returns (uint256 itemId)`
- `getAllItems() view returns (Item[] memory)`
- `getItem(uint256 itemId) view returns (Item memory)`
- `updateItem(uint256 itemId, string name, string description, uint256 listedPrice, string category, string imageUrl, bool isPublic)`
- `setItemVisibility(uint256 itemId, bool isPublic)`
- `transferOwnership(uint256 itemId, address newOwner, uint256 transactionPrice)`
- `getTransactionHistory(uint256 itemId) view returns (TransactionRecord[] memory)`

Solidity 구현에서는 `string` 입력값을 `calldata`로 받을 수 있다. 반환 타입은 실제 Solidity 문법에 맞게 조정하되, ABI에서 위 데이터 구조를 프론트엔드가 읽을 수 있어야 한다.

구현 안정성을 위해 다음 보조 조회 함수를 추가할 수 있다.

- `getItemCount() view returns (uint256)`
- `getTransactionCount(uint256 itemId) view returns (uint256)`

보조 조회 함수는 필수 MVP 화면 구현을 단순화하기 위한 선택 사항이다. 단, `getAllItems()`와 `getTransactionHistory(itemId)`만으로도 MVP 화면은 구현 가능해야 한다.

## 5.4 필수 이벤트

- `ItemRegistered(uint256 indexed itemId, address indexed owner)`
- `ItemUpdated(uint256 indexed itemId, address indexed owner)`
- `ItemVisibilityChanged(uint256 indexed itemId, bool isPublic)`
- `OwnershipTransferred(uint256 indexed itemId, address indexed from, address indexed to, uint256 transactionPrice, uint256 timestamp)`

프론트엔드는 `OwnershipTransferred` 이벤트 로그의 `transactionHash`를 사용하여 Item Detail과 Transaction History에 Tx Hash를 표시한다.

## 5.5 물품 등록

### 목적

사용자가 인증 대상 물품을 등록하고, 등록자를 최초 소유자로 설정한다.

### 입력 정보

- 물품명
- 설명
- Listed Price
- 카테고리
- 이미지 URL
- 공개 여부

### 동작 방식

1. 사용자가 Register Item 화면에서 물품 정보를 입력한다.
2. MetaMask를 통해 등록 트랜잭션을 승인한다.
3. Smart Contract는 새로운 itemId를 생성한다.
4. 입력된 물품 정보를 저장한다.
5. `msg.sender`를 현재 소유자로 저장한다.
6. `ItemRegistered` 이벤트를 발생시킨다.

### 검증 조건

- 물품명은 비어 있으면 안 된다.
- 설명은 비어 있으면 안 된다.
- Listed Price는 0보다 커야 한다.
- 카테고리는 허용 목록 중 하나여야 한다. MVP에서는 프론트엔드에서 우선 검증한다.
- 이미지 URL은 비어 있으면 안 된다.
- 등록 성공 시 `itemIds`에 새 itemId를 추가해야 한다.

## 5.6 물품 조회

### 목적

등록된 물품의 상세 정보와 현재 소유자를 조회한다.

### 조회 정보

- itemId
- name
- description
- listedPrice
- category
- imageUrl
- currentOwner
- isPublic
- createdAt

### 동작 방식

1. React Web은 `getItem(itemId)` 또는 `getAllItems()`를 호출한다.
2. Smart Contract는 물품 정보를 반환한다.
3. 프론트엔드는 Public/Private 정책에 따라 화면 표시 여부를 결정한다.

MVP에서 Private은 서비스 UI 기준 미노출 정책이다. 온체인 데이터 자체가 비밀로 암호화되는 것은 아니다.

### 검증 조건

- 존재하지 않는 itemId 조회는 revert 또는 빈 결과 정책 중 하나로 일관되게 처리해야 한다.
- MVP에서는 revert 방식으로 처리하고, 프론트엔드는 오류를 받아 접근 불가 또는 존재하지 않는 물품 메시지를 표시한다.

## 5.7 물품 정보 수정

### 목적

현재 소유자가 소유권 이전 전까지만 물품 정보를 수정한다.

### 동작 방식

1. 현재 소유자가 수정 정보를 입력한다.
2. React Web은 `updateItem`을 호출한다.
3. Smart Contract는 호출자가 현재 소유자인지 확인한다.
4. Smart Contract는 해당 물품의 거래 이력이 없는지 확인한다.
5. 검증 성공 시 물품 정보를 수정한다.
6. `ItemUpdated` 이벤트를 발생시킨다.

### 검증 조건

- 호출자는 현재 소유자여야 한다.
- 해당 물품의 거래 이력이 없어야 한다.
- 물품 삭제는 허용하지 않는다.
- 존재하지 않는 itemId에 대해서는 수정할 수 없다.

## 5.8 공개/비공개 전환

### 목적

현재 소유자가 물품의 공개 여부를 변경한다.

### 동작 방식

1. 현재 소유자가 Public 또는 Private을 선택한다.
2. React Web은 `setItemVisibility(itemId, isPublic)`을 호출한다.
3. Smart Contract는 호출자가 현재 소유자인지 확인한다.
4. 검증 성공 시 `isPublic` 값을 변경한다.
5. `ItemVisibilityChanged` 이벤트를 발생시킨다.

### 검증 조건

- 호출자는 현재 소유자여야 한다.
- Private 물품은 Market과 검색 결과에 표시하지 않는다.
- 존재하지 않는 itemId에 대해서는 공개 여부를 변경할 수 없다.

## 5.9 소유권 이전

### 목적

외부 거래 완료 후 현재 소유자가 새 소유자에게 물품의 온체인 소유권을 이전한다.

### 입력 정보

- itemId
- newOwner
- transactionPrice

### 동작 방식

1. 현재 소유자가 Transfer Ownership 화면에서 새 소유자 주소와 Transaction Price를 입력한다.
2. React Web은 `transferOwnership(itemId, newOwner, transactionPrice)`를 호출한다.
3. Smart Contract는 itemId가 유효한지 확인한다.
4. Smart Contract는 `msg.sender`가 현재 소유자인지 확인한다.
5. Smart Contract는 물품이 Public인지 확인한다.
6. Smart Contract는 newOwner와 transactionPrice를 검증한다.
7. Smart Contract는 currentOwner를 newOwner로 변경한다.
8. Smart Contract는 `TransactionRecord(from, to, transactionPrice, timestamp)`를 저장한다.
9. `OwnershipTransferred` 이벤트를 발생시킨다.

### 검증 조건

- 호출자는 현재 소유자여야 한다.
- 물품은 Public이어야 한다.
- newOwner는 `address(0)`이면 안 된다.
- newOwner는 현재 소유자와 같으면 안 된다.
- transactionPrice는 0보다 커야 한다.
- 존재하지 않는 itemId에 대해서는 소유권 이전을 수행할 수 없다.

## 5.10 거래 이력 조회

### 목적

특정 물품의 소유권 이전 이력을 조회한다.

### 조회 정보

- from
- to
- transactionPrice
- timestamp
- txHash, 프론트엔드가 이벤트 로그에서 매핑하여 표시

### 동작 방식

1. React Web은 `getTransactionHistory(itemId)`를 호출한다.
2. Smart Contract는 해당 itemId의 TransactionRecord 배열을 반환한다.
3. 프론트엔드는 최근 5건을 Item Detail에 기본 표시한다.
4. `전체 거래 이력 보기` 클릭 시 전체 이력을 표시한다.
5. 프론트엔드는 `OwnershipTransferred` 이벤트 로그에서 Tx Hash를 매핑한다.

## 5.11 내 거래 이력 조회

### 목적

현재 연결된 지갑 주소가 참여한 거래만 Transaction History 화면에 표시한다.

### 동작 방식

1. React Web은 `getAllItems()`로 itemId 목록을 확보한다.
2. 각 itemId에 대해 `getTransactionHistory(itemId)`를 호출한다.
3. 각 거래의 `from` 또는 `to`가 현재 지갑 주소와 일치하는지 필터링한다.
4. 물품명을 표시하기 위해 필요한 경우 `getItem(itemId)` 결과를 함께 사용한다.
5. Tx Hash는 이벤트 로그에서 매핑한다.

---

# 6. 프론트엔드 구현 기준

## 6.1 환경 설정값

React 프론트엔드는 다음 설정값을 가져야 한다.

- `USED_MARKET_CONTRACT_ADDRESS`: Sepolia에 배포된 UsedMarket Smart Contract 주소
- `USED_MARKET_ABI`: UsedMarket Smart Contract ABI
- `SEPOLIA_CHAIN_ID_DECIMAL`: `11155111`
- `SEPOLIA_CHAIN_ID_HEX`: `0xaa36a7`
- `CONTRACT_DEPLOY_BLOCK`: 이벤트 로그 조회 시작 블록, 선택 사항

Vite 기반 React 프로젝트라면 환경 변수명은 다음과 같이 둘 수 있다.

- `VITE_USED_MARKET_CONTRACT_ADDRESS`
- `VITE_SEPOLIA_CHAIN_ID`
- `VITE_CONTRACT_DEPLOY_BLOCK`

## 6.2 ethers.js 연동 기준

- MetaMask Provider는 `window.ethereum`에서 가져온다.
- ethers.js v6 기준으로 `BrowserProvider`를 사용한다.
- 조회 함수는 Provider 기반 Contract 인스턴스로 호출할 수 있다.
- 등록, 수정, 공개 여부 변경, 소유권 이전은 Signer 기반 Contract 인스턴스로 호출해야 한다.
- Listed Price와 Transaction Price 입력값은 ETH 단위 UI 값을 wei 단위 `uint256` 값으로 변환하여 Contract에 전달한다.
- Contract에서 조회한 가격 값은 ETH 단위 문자열로 변환하여 화면에 표시한다.
- 트랜잭션 전송 직후 `tx.hash`를 표시할 수 있다.
- 트랜잭션 확정은 `tx.wait()` 결과를 기준으로 처리한다.
- MetaMask 승인 거부는 에러 코드 또는 메시지를 확인하여 토스트 메시지로 처리한다.

## 6.3 이벤트 로그 매핑 기준

과거 거래의 Tx Hash는 Smart Contract 저장값이 아니므로 `OwnershipTransferred` 이벤트 로그와 거래 이력을 매핑하여 표시한다.

1. `getAllItems()`로 itemId 목록을 확보한다.
2. 각 itemId에 대해 `getTransactionHistory(itemId)`를 호출한다.
3. `OwnershipTransferred` 이벤트 로그를 조회한다.
4. 이벤트의 `itemId`, `from`, `to`, `transactionPrice`, `timestamp`와 거래 이력 데이터를 매칭한다.
5. 매칭된 이벤트 로그의 `transactionHash`를 화면에 표시한다.

이벤트 로그 조회 범위는 `CONTRACT_DEPLOY_BLOCK`부터 latest까지로 제한하는 것을 권장한다. 매핑에 실패한 과거 거래는 Tx Hash를 `조회 불가`로 표시한다.

---

# 7. 구현 계획

본 구현 계획은 1인 개발자가 순차적으로 진행하는 것을 전제로 한다. 각 Phase는 약 1 man/day 규모로 산정하며, 앞 Phase의 결과물이 뒤 Phase의 기반이 되도록 구성한다. 각 Phase는 구현뿐 아니라 코드 리뷰, 검증, 테스트, 사이드 이펙트 검증, 지금까지 구현된 모든 Phase에 대한 누적 테스트를 포함한다.

## Phase 1: 프로젝트 기반 구성 및 공통 UI 뼈대

### 구현

- React 프로젝트 구조, 라우팅, 공통 레이아웃을 구성한다.
- `Home`, `Market`, `Register Item`, `My Items`, `Item Detail`, `Transaction History`, `Transfer Ownership` 라우트를 생성한다.
- `designs` 폴더의 시안을 기준으로 사이드바, 헤더, 지갑 상태 영역, 기본 카드 UI, 버튼, 입력 필드, 토스트, 모달 공통 컴포넌트를 만든다.
- `project_docs.md` 기준으로 시안에서 제외해야 하는 요소를 UI에 반영하지 않는다.

### 코드 리뷰

- 화면 라우트명이 문서의 필수 화면 목록과 일치하는지 확인한다.
- 공통 컴포넌트가 특정 화면에 과도하게 종속되지 않았는지 확인한다.
- 구매, 결제, 인증 태그처럼 MVP 제외 기능으로 오해될 UI가 들어가지 않았는지 확인한다.

### 검증

- 모든 필수 라우트에 접근 가능한지 확인한다.
- 사이드바 메뉴와 헤더의 화면 이동이 정상 동작하는지 확인한다.
- 기본 반응형 레이아웃이 깨지지 않는지 확인한다.

### 테스트

- 라우팅 이동 테스트
- 공통 버튼, 입력 필드, 모달, 토스트 렌더링 테스트
- 빈 상태 화면 렌더링 테스트

### 사이드 이펙트 검증

- 공통 스타일 변경이 모든 화면의 레이아웃을 깨뜨리지 않는지 확인한다.
- 제외 기능에 해당하는 UI 요소가 다른 화면에 재사용되지 않았는지 확인한다.

### 누적 테스트

- Phase 1 전체 화면 진입 및 기본 네비게이션을 수동 테스트한다.

## Phase 2: Smart Contract 구현 및 로컬 검증

### 구현

- UsedMarket Smart Contract를 구현한다.
- `Item`, `TransactionRecord`, `nextItemId`, `items`, `itemIds`, `transactionHistories` 저장 구조를 구현한다.
- 필수 함수와 이벤트를 구현한다.
  - `registerItem`
  - `getAllItems`
  - `getItem`
  - `updateItem`
  - `setItemVisibility`
  - `transferOwnership`
  - `getTransactionHistory`
  - `ItemRegistered`
  - `ItemUpdated`
  - `ItemVisibilityChanged`
  - `OwnershipTransferred`

### 코드 리뷰

- Smart Contract에 `status`, `selling`, `sold` 관련 필드나 로직이 없는지 확인한다.
- `Transaction Hash`를 상태값으로 저장하지 않는지 확인한다.
- Public 상태에서만 소유권 이전이 가능한지 확인한다.
- 현재 소유자만 수정, 공개 여부 변경, 소유권 이전을 수행할 수 있는지 확인한다.

### 검증

- itemId가 1부터 증가하는지 확인한다.
- 존재하지 않는 itemId 접근 시 일관되게 실패하는지 확인한다.
- `getAllItems()`가 전체 물품을 반환할 수 있는지 확인한다.
- 거래 이력이 소유권 이전 시에만 생성되는지 확인한다.

### 테스트

- 물품 등록 테스트
- 물품 조회 테스트
- 공개/비공개 전환 테스트
- 소유권 이전 성공/실패 테스트
- 거래 이력 생성 테스트
- 소유권 이전 후 이전 소유자의 수정 실패 테스트

### 사이드 이펙트 검증

- 공개 여부 변경이 소유자 변경에 영향을 주지 않는지 확인한다.
- 소유권 이전이 Listed Price를 변경하지 않는지 확인한다.
- 거래 이력이 기존 이력을 덮어쓰지 않고 누적되는지 확인한다.

### 누적 테스트

- Phase 1의 라우팅과 공통 UI가 유지되는지 확인한다.
- Phase 2의 Smart Contract 테스트 전체를 실행한다.

## Phase 3: MetaMask 및 ethers.js 연동 계층 구현

### 구현

- MetaMask 연결, 계정 조회, 계정 변경 감지, 네트워크 변경 감지를 구현한다.
- Sepolia Chain ID 검증을 구현한다.
- ethers.js v6 기준 `BrowserProvider`, Provider 기반 Contract, Signer 기반 Contract 생성 유틸을 구현한다.
- 환경 설정값을 연결한다.
  - `VITE_USED_MARKET_CONTRACT_ADDRESS`
  - `VITE_SEPOLIA_CHAIN_ID`
  - `VITE_CONTRACT_DEPLOY_BLOCK`
- ETH 입력값을 wei로 변환하고, wei 값을 ETH 표시 문자열로 변환하는 유틸을 구현한다.
- Tx Hash 표시, `tx.wait()` 대기, MetaMask 승인 거부 토스트 처리를 구현한다.

### 코드 리뷰

- 개인키, 시드 문구, MetaMask 비밀번호를 요구하거나 저장하지 않는지 확인한다.
- 조회 함수와 트랜잭션 함수가 Provider/Signer 기준으로 분리되었는지 확인한다.
- 가격 변환이 모든 가격 입력/표시에 동일하게 적용되는지 확인한다.

### 검증

- MetaMask 미설치 상태 메시지를 확인한다.
- 지갑 연결 승인/거부 흐름을 확인한다.
- Sepolia가 아닌 네트워크에서 안내가 표시되는지 확인한다.
- `tx.hash`와 `tx.wait()` 흐름이 정상 동작하는지 확인한다.

### 테스트

- 지갑 연결 테스트
- 네트워크 검증 테스트
- 주소 축약 표시 테스트
- ETH to wei 변환 테스트
- wei to ETH 변환 테스트
- MetaMask 승인 거부 처리 테스트

### 사이드 이펙트 검증

- 지갑 변경 시 기존 화면 상태가 잘못 유지되지 않는지 확인한다.
- 네트워크 변경 시 트랜잭션 버튼이 잘못 활성화되지 않는지 확인한다.

### 누적 테스트

- Phase 1의 모든 라우팅 및 공통 UI 테스트를 다시 수행한다.
- Phase 2의 Smart Contract 테스트를 다시 수행한다.
- Phase 3의 지갑/네트워크/가격 변환 테스트를 수행한다.

## Phase 4: 물품 등록 및 Market 공개 탐색 구현

### 구현

- Register Item 화면을 구현한다.
  - 물품명
  - 설명
  - Listed Price
  - 카테고리 드롭다운
  - 이미지 URL
  - 이미지 URL 미리보기
  - Public/Private 선택
- `registerItem` 트랜잭션 호출을 연결한다.
- 등록 완료 상태를 구현한다.
- Market 화면을 구현한다.
  - Public 물품 목록 조회
  - 검색
  - 카테고리 필터
  - Item Detail 이동
- Market 카드에는 이미지, 물품명, Listed Price, 카테고리만 표시한다.

### 코드 리뷰

- Register Item에 파일 업로드, IPFS 문구가 없는지 확인한다.
- 카테고리가 문서의 허용 목록과 일치하는지 확인한다.
- Market 카드에 현재 소유자, Owned/Transferred, 임의 인증 태그, 구매 아이콘이 없는지 확인한다.
- Listed Price가 ETH 표시 단위로만 사용되는지 확인한다.

### 검증

- Public 물품만 Market에 표시되는지 확인한다.
- Private 물품이 Market과 검색 결과에 표시되지 않는지 확인한다.
- 검색어와 카테고리 필터가 함께 적용되는지 확인한다.
- 이미지 URL 오류 시 기본 이미지 또는 실패 메시지가 표시되는지 확인한다.

### 테스트

- Register Item 입력 검증 테스트
- 카테고리 드롭다운 테스트
- 이미지 URL 미리보기 테스트
- 물품 등록 성공 테스트
- 등록 완료 상태 표시 테스트
- Market Public 필터링 테스트
- Market 검색/카테고리 필터 테스트

### 사이드 이펙트 검증

- 등록 후 Home 최근 등록 물품과 Market 목록이 갱신되는지 확인한다.
- Private 물품 등록이 My Items에서만 보이고 Market에는 보이지 않는지 확인한다.

### 누적 테스트

- Phase 1-3의 전체 테스트를 다시 수행한다.
- Phase 4의 Register Item과 Market 테스트를 추가 수행한다.

## Phase 5: Item Detail, 공개 여부 전환, 정보 수정 구현

### 구현

- 최신 `designs/Item Detail - Ownership Verification (Matching Style).png`를 기준으로 Item Detail 화면을 구현한다.
- 대표 이미지, 물품명, 카테고리, Listed Price, 설명, 현재 소유자 주소, 최근 5건 거래 이력, 전체 거래 이력 보기를 구현한다.
- 현재 소유자에게만 소유권 이전, 공개/비공개 전환, 정보 수정 액션을 표시한다.
- `setItemVisibility`와 `updateItem`을 연결한다.
- `전체 거래 이력 보기`는 Item Detail 내부 확장 영역 또는 모달로 구현한다.

### 코드 리뷰

- Item Detail에 `Authenticated`, `Verified Digital Certificate`, USD 환산, 좋아요, 공유 기능이 없는지 확인한다.
- `전체 거래 이력 보기`가 Transaction History 화면과 섞이지 않았는지 확인한다.
- Private 물품에 비소유자가 접근할 수 없도록 UI 접근 제어가 있는지 확인한다.
- 소유권 이전 이력이 있는 물품은 정보 수정이 비활성화되는지 확인한다.

### 검증

- Public 물품은 누구나 Item Detail을 조회할 수 있는지 확인한다.
- Private 물품은 현재 소유자만 UI에서 조회 가능한지 확인한다.
- 현재 소유자가 아닌 사용자는 소유자 액션을 볼 수 없는지 확인한다.
- 공개/비공개 전환 후 Market 노출 여부가 바뀌는지 확인한다.

### 테스트

- Item Detail 조회 테스트
- 현재 소유자 주소 축약 표시 테스트
- 최근 5건 거래 이력 표시 테스트
- 전체 거래 이력 확장/모달 테스트
- Public/Private 전환 테스트
- 정보 수정 성공 및 비활성화 테스트

### 사이드 이펙트 검증

- 공개 여부 전환이 currentOwner나 거래 이력에 영향을 주지 않는지 확인한다.
- 정보 수정이 거래 이력에 영향을 주지 않는지 확인한다.
- Private 전환 후 Market, Home 최근 등록 물품에서 제외되는지 확인한다.

### 누적 테스트

- Phase 1-4 전체 테스트를 다시 수행한다.
- Phase 5의 Item Detail, 공개 여부 전환, 정보 수정 테스트를 추가 수행한다.

## Phase 6: 소유권 이전 및 성공 모달 구현

### 구현

- Transfer Ownership 화면을 구현한다.
  - 현재 물품 정보 요약
  - 현재 소유자 주소
  - 새 소유자 지갑 주소
  - 붙여넣기 버튼
  - Transaction Price
  - 주소 검증 메시지
  - 소유권 이전 버튼
- Ethereum 주소 즉시 검증을 구현한다.
- `transferOwnership(itemId, newOwner, transactionPrice)`를 연결한다.
- MetaMask 승인 거부 시 `트랜잭션이 취소되었습니다.` 토스트를 표시한다.
- 성공 모달을 구현하고 확인 후 Item Detail로 돌아간다.

### 코드 리뷰

- Private 물품 소유권 이전이 차단되는지 확인한다.
- 현재 소유자가 아닌 사용자가 Transfer Ownership에 접근할 수 없는지 확인한다.
- Transaction Price가 Listed Price를 덮어쓰지 않는지 확인한다.
- 성공 모달이 별도 라우팅 화면으로 구현되지 않았는지 확인한다.

### 검증

- 잘못된 주소 입력 시 버튼이 비활성화되는지 확인한다.
- 현재 소유자만 소유권 이전을 수행할 수 있는지 확인한다.
- 소유권 이전 후 currentOwner가 새 소유자로 변경되는지 확인한다.
- 거래 이력에 from, to, transactionPrice, timestamp가 추가되는지 확인한다.
- 방금 발생한 트랜잭션의 Tx Hash가 표시되는지 확인한다.

### 테스트

- 주소 입력 검증 테스트
- 붙여넣기 버튼 테스트
- Transaction Price 검증 테스트
- 소유권 이전 성공/실패 테스트
- MetaMask 승인 거부 토스트 테스트
- 성공 모달 표시 및 확인 후 이동 테스트

### 사이드 이펙트 검증

- 소유권 이전 후 이전 소유자의 My Items에서 Owned가 아닌 Transferred로 분류되는지 확인한다.
- 소유권 이전 후 새 소유자의 My Items Owned에 표시되는지 확인한다.
- 소유권 이전 후 기존 Item Detail 데이터가 최신 상태로 갱신되는지 확인한다.

### 누적 테스트

- Phase 1-5 전체 테스트를 다시 수행한다.
- Phase 6의 소유권 이전 테스트를 추가 수행한다.

## Phase 7: My Items 및 Transaction History 구현

### 구현

- My Items 화면을 구현한다.
  - Owned 탭
  - Transferred 탭
- Owned는 `currentOwner == connectedWallet` 기준으로 분류한다.
- Transferred는 거래 이력의 `from == connectedWallet`이고 현재 소유자가 connectedWallet이 아닌 물품을 기준으로 분류한다.
- Transaction History 화면을 구현한다.
  - 물품명
  - 거래 날짜
  - 이전 소유자
  - 새로운 소유자
  - Transaction Price
  - Tx Hash
- `getAllItems()`와 `getTransactionHistory(itemId)` 조합으로 내가 참여한 거래만 필터링한다.
- `OwnershipTransferred` 이벤트 로그와 거래 이력을 매핑하여 Tx Hash를 표시한다.
- 이벤트 로그 매핑 실패 시 `조회 불가`를 표시한다.

### 코드 리뷰

- Transaction History가 전체 서비스 거래 내역을 그대로 노출하지 않고 내가 참여한 거래만 표시하는지 확인한다.
- Export CSV, Filter By Date, 전체 기록 불러오기, Gas Fee, USD 환산 기능이 없는지 확인한다.
- My Items에서 Owned와 Transferred가 Market 상태처럼 표시되지 않는지 확인한다.

### 검증

- 현재 지갑 주소 변경 시 My Items와 Transaction History가 재계산되는지 확인한다.
- 여러 번 소유권 이전된 물품이 Owned/Transferred에 올바르게 분류되는지 확인한다.
- Tx Hash 매핑 성공/실패 케이스가 모두 처리되는지 확인한다.

### 테스트

- My Items Owned 필터링 테스트
- My Items Transferred 필터링 테스트
- Transaction History 참여 거래 필터링 테스트
- Tx Hash 이벤트 로그 매핑 테스트
- Tx Hash 조회 불가 표시 테스트
- 지갑 미연결 Empty State 테스트

### 사이드 이펙트 검증

- 거래 이력 조회 로직이 Market과 Home의 Public 목록 표시를 느리게 만들지 않는지 확인한다.
- 지갑 변경 시 이전 지갑의 데이터가 화면에 남지 않는지 확인한다.

### 누적 테스트

- Phase 1-6 전체 테스트를 다시 수행한다.
- Phase 7의 My Items와 Transaction History 테스트를 추가 수행한다.

## Phase 8: 통합 검증, 배포 준비, 발표용 시나리오 점검

### 구현

- 전체 화면의 빈 상태, 로딩 상태, 오류 상태를 정리한다.
- 문서 기준 제외 기능이 화면에 남아 있지 않은지 최종 정리한다.
- Sepolia 배포 Contract Address, ABI, 배포 블록 환경값을 확정한다.
- 발표용 샘플 데이터와 시나리오를 준비한다.

### 코드 리뷰

- PRD/SRS의 필수 기능이 모두 구현되었는지 체크리스트로 확인한다.
- Smart Contract 함수 시그니처와 프론트 호출 인자가 일치하는지 확인한다.
- 모든 가격 표시가 ETH 표시 단위이며 결제 기능으로 보이지 않는지 확인한다.
- Private 정책이 UI 미노출 정책으로 일관되게 설명되고 구현되었는지 확인한다.

### 검증

- 전체 사용자 흐름을 처음부터 끝까지 검증한다.
  1. 지갑 연결
  2. 물품 등록
  3. Market 공개 탐색
  4. Item Detail 확인
  5. 공개/비공개 전환
  6. 소유권 이전
  7. 새 소유자 My Items 확인
  8. 이전 소유자 Transferred 확인
  9. Transaction History 확인
- Sepolia 네트워크에서 실제 트랜잭션이 처리되는지 확인한다.

### 테스트

- 전체 라우팅 테스트
- 전체 Smart Contract 테스트
- 전체 지갑/네트워크 테스트
- 전체 화면별 주요 액션 테스트
- 전체 실패 케이스 테스트
- 전체 이벤트 로그 매핑 테스트

### 사이드 이펙트 검증

- 새로 등록한 Private 물품이 Market에 노출되지 않는지 확인한다.
- 소유권 이전 후 정보 수정이 비활성화되는지 확인한다.
- 지갑 변경, 네트워크 변경, 새로고침 후에도 화면 데이터가 일관되는지 확인한다.
- 트랜잭션 실패 후 UI가 잘못된 성공 상태로 남지 않는지 확인한다.

### 누적 테스트

- Phase 1부터 Phase 8까지 구현된 모든 기능을 전체 회귀 테스트한다.
- 발표 시나리오를 최소 2회 반복 수행한다.
- 문서의 최종 결정사항과 구현 결과가 일치하는지 최종 점검한다.

---

# 8. Future Work

향후 확장 기능은 다음과 같다.

- 실물 인증
- 영수증 검증
- 증빙 이미지 업로드
- 공식 인증 기관 연동
- 구매 요청 기능
- 양측 승인 기반 소유권 이전
- 디지털 보증서 발급

---

# 9. 구현 전 최종 결정사항

- 서비스명은 ChainTrust로 정의한다.
- 서비스 목적은 한정판, 희귀품, 수집품의 소유권 이력 인증이다.
- 앱 안에서 구매, 결제, 채팅, 배송을 제공하지 않는다.
- 실제 거래는 외부 플랫폼 또는 개인 간 채널에서 진행된다.
- ChainTrust는 거래 완료 후 소유권 이전 기록과 거래 이력을 블록체인에 남긴다.
- 기술 구조는 React, MetaMask, ethers.js, Ethereum Sepolia, UsedMarket Smart Contract를 유지한다.
- 백엔드 서버와 DB는 사용하지 않는다.
- ethers.js는 v6 기준으로 구현한다.
- Sepolia Chain ID는 decimal `11155111`, hex `0xaa36a7`로 사용한다.
- 프론트엔드는 배포된 Contract Address, ABI, 선택적으로 Contract 배포 블록 번호를 환경 설정값으로 가진다.
- Smart Contract는 개발자가 프로젝트 초기 설정 단계에서 1회 배포한다.
- 물품마다 Smart Contract를 새로 배포하지 않는다.
- 사용자 화면에는 Smart Contract 배포 기능을 제공하지 않는다.
- MVP에서는 누구나 물품을 등록할 수 있다.
- MVP에서는 실물 보유 여부, 정품 여부, 진품 여부를 검증하지 않는다.
- MVP에서는 소유권 이력 기록 구조 검증에 집중하며, 실물 인증 및 진품 검증 기능은 향후 확장 기능으로 고려한다.
- Smart Contract의 Item 데이터에는 별도 상태 필드를 두지 않는다.
- Smart Contract는 `getAllItems()` 구현을 위해 mapping만 사용하지 않고 `itemIds` 같은 순회 가능한 목록을 함께 관리한다.
- itemId는 1부터 증가하며 0은 유효하지 않은 값으로 취급한다.
- My Items에서는 Owned와 Transferred 탭을 사용한다.
- Market에서는 Owned와 Transferred 상태를 표시하지 않는다.
- Market은 Public 물품 탐색, 검색, 카테고리 필터, Item Detail 이동을 제공한다.
- Market 카드에는 현재 소유자 주소를 표시하지 않는다.
- Market 카드 태그는 카테고리만 사용한다.
- 카테고리는 패션, 악세사리, 전자기기, 문구, 수집품, 음반, 게임, 기타로 제한한다.
- Register Item은 물품명, 설명, Listed Price, 카테고리, 이미지 URL, 공개 여부를 입력받는다.
- 카테고리는 드롭다운 선택 방식이다.
- 공개 여부는 Public 또는 Private으로 선택한다.
- Public 물품은 Market에 노출되고 검색 가능하다.
- Private 물품은 Market과 검색 결과에 노출되지 않으며 소유자만 서비스 UI에서 조회 가능하다.
- Private은 온체인 비밀 보장이 아니라 서비스 UI 기준 미노출 정책이다.
- 소유권 이전은 Public 물품만 가능하다.
- Private 물품을 이전하려면 먼저 Public으로 전환해야 한다.
- 물품 삭제 기능은 제공하지 않는다.
- 물품 정보 수정은 소유권 이전 전까지만 가능하다.
- Listed Price는 등록 가격이다.
- Transaction Price는 소유권 이전 시 입력하는 실제 거래 가격이다.
- Listed Price와 Transaction Price는 MVP에서 ETH 단위로 표시하지만 실제 결제 수단이 아니다.
- Listed Price와 Transaction Price는 Contract 저장 시 wei 단위 `uint256` 값으로 처리한다.
- 거래 이력에는 Transaction Price를 기록한다.
- Transaction Hash는 Smart Contract에 저장하지 않고 프론트엔드가 `tx.hash`, receipt, 이벤트 로그에서 표시한다.
- 과거 거래의 Tx Hash 이벤트 로그 매핑이 실패하면 `조회 불가`로 표시할 수 있다.
- Item Detail은 최근 5건의 거래 이력을 기본 표시한다.
- Item Detail은 `전체 거래 이력 보기` 버튼을 제공한다.
- Item Detail의 `전체 거래 이력 보기`는 해당 물품의 전체 이력을 같은 화면 내 확장 영역 또는 모달로 표시하며, 내가 참여한 거래만 보여주는 Transaction History 화면과 분리한다.
- Transfer Ownership은 새 소유자 지갑 주소, 붙여넣기 버튼, Transaction Price 입력을 제공한다.
- 잘못된 주소 입력 시 `올바른 Ethereum 주소를 입력해주세요.` 메시지를 표시하고 버튼을 비활성화한다.
- MetaMask 승인 거부 시 `트랜잭션이 취소되었습니다.` 토스트 메시지를 표시한다.
- 소유권 이전 성공 시 성공 모달을 표시하고, 확인 후 Item Detail로 돌아간다.
- Transaction History는 전체 서비스 거래 내역이 아니라 내가 참여한 거래만 표시한다.
- 디자인 시안의 파일 업로드, IPFS 문구, 임의 인증 태그, 장바구니 아이콘, USD 환산, Gas Fee, Export CSV, Filter By Date, 전체 기록 불러오기, 좋아요, 공유 기능은 구현하지 않는다.
