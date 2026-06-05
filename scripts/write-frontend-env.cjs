const { readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { isAddress } = require("ethers");

async function main() {
  const deploymentPath = path.join(process.cwd(), "deployments", "sepolia.json");
  const deployment = JSON.parse(await readFile(deploymentPath, "utf8"));

  if (deployment.network !== "sepolia") {
    throw new Error(`Expected sepolia deployment record, received ${deployment.network}`);
  }
  if (Number(deployment.chainId) !== 11155111) {
    throw new Error(`Expected Sepolia chainId 11155111, received ${deployment.chainId}`);
  }
  if (!isAddress(deployment.contractAddress)) {
    throw new Error("Invalid deployment contract address.");
  }
  if (!Number.isInteger(Number(deployment.deployBlock)) || Number(deployment.deployBlock) < 0) {
    throw new Error("Invalid deployment block.");
  }

  const frontendEnv = [
    `VITE_USED_MARKET_CONTRACT_ADDRESS=${deployment.contractAddress}`,
    "VITE_SEPOLIA_CHAIN_ID=0xaa36a7",
    `VITE_CONTRACT_DEPLOY_BLOCK=${deployment.deployBlock}`,
    ""
  ].join("\n");

  await writeFile(path.join(process.cwd(), ".env.local"), frontendEnv, "utf8");
  console.log(`.env.local updated for UsedMarket at ${deployment.contractAddress}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
