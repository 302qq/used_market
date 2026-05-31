import { formatEther, parseEther } from "ethers";

export function ethToWei(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new Error("ETH value is required");
  }
  return parseEther(normalized);
}

export function weiToEth(value, fractionDigits = 6) {
  const eth = formatEther(value ?? 0n);
  const [integer, decimal = ""] = eth.split(".");
  const trimmedDecimal = decimal.slice(0, fractionDigits).replace(/0+$/, "");
  return trimmedDecimal ? `${integer}.${trimmedDecimal}` : integer;
}

export function formatEthLabel(value) {
  return `${weiToEth(value)} ETH`;
}
