const { writeFile } = require("node:fs/promises");
const path = require("node:path");
const { isAddress } = require("ethers");

async function main() {
  const contractAddress = process.argv[2];
  const deployBlock = process.argv[3] || "0";

  if (!contractAddress || !isAddress(contractAddress)) {
    throw new Error("Usage: npm.cmd run frontend:env:address -- 0xYourSepoliaContractAddress [deployBlock]");
  }
  if (!Number.isInteger(Number(deployBlock)) || Number(deployBlock) < 0) {
    throw new Error("deployBlock must be a non-negative integer.");
  }

  const frontendEnv = [
    `VITE_USED_MARKET_CONTRACT_ADDRESS=${contractAddress}`,
    "VITE_SEPOLIA_CHAIN_ID=0xaa36a7",
    `VITE_CONTRACT_DEPLOY_BLOCK=${deployBlock}`,
    ""
  ].join("\n");

  await writeFile(path.join(process.cwd(), ".env.local"), frontendEnv, "utf8");
  console.log(`.env.local updated for UsedMarket at ${contractAddress}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
