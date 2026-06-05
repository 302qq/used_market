# ChainTrust Design Guide v1.0

> 본 문서는 ChainTrust 프로젝트의 확정 디자인 시안을 React 프로젝트에 반영하기 위한 최종 구현 가이드이다.
>
> 목적은 새로운 기능 개발이 아니라 현재 구현된 기능을 유지하면서 디자인을 개선하는 것이다.

---

# 1. 프로젝트 원칙

## 최우선 원칙

현재 동작 중인 기능을 유지한다.

아래 항목은 수정하거나 제거하지 않는다.

* MetaMask 연결
* MetaMask 연결 해제
* Sepolia 네트워크 확인
* 물품 등록
* 공개 물품 조회
* 내 물품 조회
* 소유권 이전
* 거래 이력 조회
* 스마트 컨트랙트 연동

---

## 수정 금지 영역

다음 영역은 디자인 작업 대상이 아니다.

* .env
* blockchain
* contract
* contracts
* abi
* services
* wallet 연결 로직
* MetaMask 처리 로직
* Sepolia 네트워크 처리 로직

---

## 새 기능 추가 금지

다음 기능은 새로 만들지 않는다.

* 파일 업로드 시스템
* 좋아요 기능
* 댓글 기능
* 프로필 기능
* 채팅 기능
* 공유 기능
* 관리자 기능
* 새로운 페이지

현재 구현된 기능만 디자인을 개선한다.

---

# 2. 디자인 컨셉

## 서비스 정체성

ChainTrust는 NFT 거래소가 아니다.

ChainTrust는 희귀품 및 수집품의 소유권 이력을 관리하는 서비스이다.

예시:

* 빈티지 카메라
* LP
* 책
* 게임
* 피규어
* 포토카드
* 시계
* 악세서리

---

## 디자인 키워드

* Pink
* Ivory
* Soft
* Clean
* Trustworthy
* Digital Ownership Registry

---

## 지양하는 방향

* Hacker
* Cyberpunk
* Neon
* Yellow + Black
* Developer Dashboard
* Terminal Style

---

# 3. Color System

```css
:root {
  --color-bg-main: #FAF9F6;
  --color-sidebar-bg: #FFD1DC;
  --color-card-bg: #FFFFFF;

  --color-primary: #8B5E61;
  --color-accent: #E8A8B3;
  --color-secondary: #F4EBE8;

  --color-text-main: #3D2B2B;
  --color-text-sub: #8E7E7E;
  --color-text-light: #FFFFFF;

  --color-border: #E5E1DA;

  --color-success: #88B04B;
  --color-error: #D65A5A;
  --color-warning: #FFB347;

  --color-hover: rgba(139,94,97,0.1);
  --color-active: rgba(139,94,97,0.2);
}
```

---

# 4. Typography

## 제목

* 36~48px
* Bold
* Serif 느낌

## 페이지 제목

* 28~32px
* SemiBold

## 카드 제목

* 20~24px

## 일반 텍스트

* 16px

## 설명 텍스트

* 14px

## 지갑 주소

* 14px
* Monospace 가능

---

# 5. Layout

## Sidebar

고정 사이드바

폭:

```text
280px
```

포함 메뉴:

* Home
* Market
* Register Item
* My Items
* Transaction History

하단:

* Connect Wallet
* Wallet Connected

---

## Content

```text
max-width: 1280px
```

중앙 정렬

```text
padding: 40px
```

---

## Card

```css
border-radius: 16px;
padding: 24px;
box-shadow: 0 4px 20px rgba(0,0,0,0.03);
```

---

## Button

Primary Button

```css
background: var(--color-primary);
color: white;
border-radius: 12px;
```

---

# 6. Home

구성

1. Hero Banner
2. Action Cards
3. Recent Items

---

## Hero

표시 내용

* 서비스 소개
* 소유권 인증 소개
* 시작하기 버튼

---

## Action Cards

4개 카드

* Market
* Register
* My Items
* History

---

## Runtime Readiness

현재 존재하는 기능은 유지한다.

단,

메인 화면을 차지하지 않도록 축소한다.

개발자 정보처럼 보이지 않게 카드 형태로 정리한다.

---

# 7. Market

구성

* 검색창
* 카테고리 필터
* 물품 카드

---

카드 구성

* 이미지
* 카테고리
* 제목
* 가격
* 인증 상태

---

# 8. Register Item

구성

* 이름
* 카테고리
* 가격
* 설명
* 이미지 URL
* 공개 여부

---

중요

파일 업로드 기능을 새로 만들지 않는다.

현재 이미지 URL 방식 유지.

---

# 9. My Items

상단

* Owned
* Transferred

탭 구성

---

카드 구성

* 이미지
* 물품명
* 설명
* 상태

개인 컬렉션 느낌으로 표현

---

# 10. Item Detail

좌측

* 대표 이미지

우측

* 설명
* 가격
* 소유자 주소

---

하단

Ownership History

컬럼

* Date
* Price
* From
* To
* Action

---

최초 기록

표기:

```text
Initial Registration
```

사용

```text
Minted
```

사용 지양

---

# 11. Ownership Transfer

구성

* 새 소유자 주소
* 거래 가격
* 검증 메시지
* Transfer 버튼

---

에러

```css
color: var(--color-error);
```

---

하단

* 예상 가스비
* 예상 처리 시간

---

# 12. Success Modal

중앙 모달

표시 정보

* 새 소유자 주소
* 거래 가격
* 트랜잭션 해시

---

배경

```css
backdrop-filter: blur(8px);
```

---

# 13. Transaction History

리스트 형태

표시 정보

* 물품명
* 날짜
* 이전 소유자
* 새 소유자
* 거래 가격

---

개발자용 정보는 최소화한다.

사용자가 거래 흐름을 이해하기 쉽게 표현한다.

---

# 14. 구현 우선순위

1순위

* Color System
* Sidebar
* Header
* Global Layout

2순위

* Home
* Market
* Register Item

3순위

* My Items
* Item Detail
* Ownership Transfer
* Transaction History

4순위

* Success Modal
* Hover
* Active
* Animation

---

# 15. 최종 목표

현재 구현된 ChainTrust 기능은 그대로 유지한다.

디자인만 확정 시안과 최대한 동일하게 반영한다.

기능 변경보다 디자인 일관성을 우선한다.
