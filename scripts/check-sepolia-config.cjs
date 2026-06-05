const { JsonRpcProvider, Wallet, formatEther } = require("ethers");
const { requireDeploymentEnv } = require("./env-utils.cjs");

async function main() {
  const { sepoliaRpcUrl, privateKey } = requireDeploymentEnv();
  const provider = new JsonRpcProvider(sepoliaRpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const [network, balance] = await Promise.all([provider.getNetwork(), provider.getBalance(wallet.address)]);

  if (Number(network.chainId) !== 11155111) {
    throw new Error(`Expected Sepolia chainId 11155111, received ${network.chainId.toString()}`);
  }
  if (balance === 0n) {
    throw new Error(`Deployer ${wallet.address} has 0 Sepolia ETH.`);
  }

  console.log(`Sepolia chainId: ${network.chainId.toString()}`);
  console.log(`Deployer: ${wallet.address}`);
  console.log(`Balance: ${formatEther(balance)} ETH`);
  console.log("Sepolia deployment configuration is ready.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
