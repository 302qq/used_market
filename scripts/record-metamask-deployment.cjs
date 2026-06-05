const { mkdir, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { isAddress, isHexString } = require("ethers");

function usage() {
  return [
    "Usage:",
    "npm.cmd run record:metamask:deployment -- <contractAddress> <deployTxHash> <deployer> <deployBlock>",
    "",
    "Example:",
    "npm.cmd run record:metamask:deployment -- 0xContract 0xTxHash 0xDeployer 12345678"
  ].join("\n");
}

async function main() {
  const [contractAddress, transactionHash, deployer, deployBlockRaw] = process.argv.slice(2);
  const deployBlock = Number(deployBlockRaw);

  if (!isAddress(contractAddress || "")) {
    throw new Error(`Invalid contract address.\n${usage()}`);
  }
  if (!isHexString(transactionHash || "", 32)) {
    throw new Error(`Invalid deployment transaction hash.\n${usage()}`);
  }
  if (!isAddress(deployer || "")) {
    throw new Error(`Invalid deployer address.\n${usage()}`);
  }
  if (!Number.isInteger(deployBlock) || deployBlock < 0) {
    throw new Error(`Invalid deploy block.\n${usage()}`);
  }

  const deployment = {
    network: "sepolia",
    chainId: 11155111,
    contractName: "UsedMarket",
    contractAddress,
    transactionHash,
    deployer,
    deployedAt: new Date().toISOString(),
    deployBlock
  };

  const outputDir = path.join(process.cwd(), "deployments");
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "sepolia.json"), `${JSON.stringify(deployment, null, 2)}\n`, "utf8");

  console.log("MetaMask deployment recorded to deployments/sepolia.json");
  console.log(`Contract address: ${contractAddress}`);
  console.log(`Deployment transaction: ${transactionHash}`);
  console.log(`Deploy block: ${deployBlock}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
