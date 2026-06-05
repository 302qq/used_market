const { mkdir, readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { ContractFactory, JsonRpcProvider, Wallet } = require("ethers");
const { requireDeploymentEnv } = require("./env-utils.cjs");

async function main() {
  const { sepoliaRpcUrl, privateKey } = requireDeploymentEnv();
  const provider = new JsonRpcProvider(sepoliaRpcUrl);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== 11155111) {
    throw new Error(`Expected Sepolia chainId 11155111, received ${network.chainId.toString()}`);
  }

  const wallet = new Wallet(privateKey, provider);
  const artifactPath = path.join(process.cwd(), "artifacts", "contracts", "UsedMarket.sol", "UsedMarket.json");
  const artifact = JSON.parse(await readFile(artifactPath, "utf8"));
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  const deploymentTx = contract.deploymentTransaction();
  const receipt = await deploymentTx.wait();
  const contractAddress = await contract.getAddress();

  const deployment = {
    network: "sepolia",
    chainId: Number(network.chainId),
    contractName: "UsedMarket",
    contractAddress,
    transactionHash: deploymentTx.hash,
    deployer: wallet.address,
    deployedAt: new Date().toISOString(),
    deployBlock: receipt.blockNumber
  };

  const outputDir = path.join(process.cwd(), "deployments");
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "sepolia.json"), `${JSON.stringify(deployment, null, 2)}\n`, "utf8");

  console.log(`UsedMarket deployed to ${contractAddress}`);
  console.log(`Deployment transaction: ${deploymentTx.hash}`);
  console.log(`Deploy block: ${receipt.blockNumber}`);
  console.log("Deployment written to deployments/sepolia.json");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
