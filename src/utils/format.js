export function shortenAddress(address = "") {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isEthereumAddress(value = "") {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}
