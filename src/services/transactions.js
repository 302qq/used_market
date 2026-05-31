import { isUserRejectedRequest } from "./wallet.js";

export function shortenTxHash(hash = "") {
  if (!hash || hash.length < 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export async function waitForTransaction(tx, confirmations = 1) {
  if (!tx?.hash || typeof tx.wait !== "function") {
    throw new Error("Invalid transaction response");
  }

  const receipt = await tx.wait(confirmations);
  return {
    hash: tx.hash,
    receipt
  };
}

export function getTransactionErrorMessage(error) {
  if (isUserRejectedRequest(error)) {
    return "트랜잭션이 취소되었습니다.";
  }
  return "트랜잭션 처리 중 문제가 발생했습니다.";
}
