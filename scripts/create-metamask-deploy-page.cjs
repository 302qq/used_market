const { mkdir, readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");

function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function main() {
  const artifactPath = path.join(process.cwd(), "artifacts", "contracts", "UsedMarket.sol", "UsedMarket.json");
  const outputDir = path.join(process.cwd(), "tools");
  const outputPath = path.join(outputDir, "metamask-deploy.html");
  const indexPath = path.join(outputDir, "index.html");
  const artifact = JSON.parse(await readFile(artifactPath, "utf8"));

  if (!artifact.bytecode || artifact.bytecode === "0x") {
    throw new Error("UsedMarket bytecode is empty. Run npm.cmd run compile:contracts first.");
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ChainTrust MetaMask Deploy</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Arial, sans-serif;
        background: #f5f7fb;
        color: #172033;
      }
      body {
        margin: 0;
      }
      main {
        max-width: 820px;
        margin: 40px auto;
        padding: 24px;
        border: 1px solid #dbe3ef;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
      }
      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }
      p {
        line-height: 1.6;
      }
      button {
        min-height: 44px;
        border: 1px solid #2563eb;
        border-radius: 8px;
        background: #2563eb;
        color: #fff;
        cursor: pointer;
        font-weight: 700;
        padding: 0 16px;
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }
      code,
      pre {
        background: #eef2f7;
        border-radius: 8px;
      }
      pre {
        min-height: 112px;
        overflow: auto;
        padding: 14px;
        white-space: pre-wrap;
      }
      .warning {
        border: 1px solid #fed7aa;
        border-radius: 8px;
        background: #fff7ed;
        color: #9a3412;
        padding: 12px;
        font-weight: 700;
      }
      .grid {
        display: grid;
        gap: 16px;
      }
    </style>
  </head>
  <body>
    <main class="grid">
      <h1>ChainTrust UsedMarket MetaMask Deploy</h1>
      <p class="warning">Use a Sepolia MetaMask account with enough Sepolia ETH for deployment gas.</p>
      <p>This page never asks for a private key, seed phrase, RPC secret, or MetaMask password. The deploy transaction is signed inside MetaMask.</p>
      <button id="deployButton" type="button">Deploy UsedMarket to Sepolia with MetaMask</button>
      <section>
        <h2>Status</h2>
        <pre id="log">Waiting for deployment.</pre>
      </section>
      <section>
        <h2>Next commands</h2>
        <pre id="nextCommand">After deployment, the command to record the public deployment metadata will appear here.</pre>
      </section>
    </main>
    <script type="module">
      import { BrowserProvider, ContractFactory } from "https://esm.sh/ethers@6.15.0";

      const abi = ${escapeScriptJson(artifact.abi)};
      const bytecode = "${artifact.bytecode}";
      const deployButton = document.getElementById("deployButton");
      const log = document.getElementById("log");
      const nextCommand = document.getElementById("nextCommand");

      function write(message) {
        log.textContent = message;
      }

      async function ensureSepolia() {
        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (String(chainId).toLowerCase() === "0xaa36a7") return;

        write("Requesting MetaMask network switch to Sepolia...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }]
        });
      }

      deployButton.addEventListener("click", async () => {
        deployButton.disabled = true;
        nextCommand.textContent = "Deployment is in progress.";

        try {
          if (!window.ethereum) {
            throw new Error("MetaMask is not available in this browser.");
          }

          write("Requesting MetaMask account connection...");
          await window.ethereum.request({ method: "eth_requestAccounts" });
          await ensureSepolia();

          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const deployer = await signer.getAddress();

          write("Deployer: " + deployer + "\\nConfirm the contract deployment transaction in MetaMask.");

          const factory = new ContractFactory(abi, bytecode, signer);
          const contract = await factory.deploy();
          const tx = contract.deploymentTransaction();

          write("Deployment transaction submitted.\\nTx hash: " + (tx?.hash || "pending") + "\\nWaiting for confirmation...");

          const receipt = await tx.wait();
          await contract.waitForDeployment();
          const contractAddress = await contract.getAddress();
          const chainId = await window.ethereum.request({ method: "eth_chainId" });

          write(
            "Deployment complete.\\n" +
              "Contract address: " + contractAddress + "\\n" +
              "Tx hash: " + (tx?.hash || "") + "\\n" +
              "Deployer: " + deployer + "\\n" +
              "Chain ID: " + chainId + "\\n" +
              "Deploy block: " + receipt.blockNumber
          );

          nextCommand.textContent =
            "npm.cmd run record:metamask:deployment -- " +
            contractAddress + " " +
            (tx?.hash || "0x") + " " +
            deployer + " " +
            receipt.blockNumber + "\\n" +
            "npm.cmd run frontend:env";
        } catch (error) {
          const message = error && typeof error === "object" && "message" in error ? error.message : String(error);
          write("Deployment failed or was cancelled.\\n" + message);
          nextCommand.textContent = "No deployment metadata was recorded.";
        } finally {
          deployButton.disabled = false;
        }
      });
    </script>
  </body>
</html>
`;

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, html, "utf8");
  await writeFile(indexPath, html, "utf8");
  console.log(`MetaMask deploy page written to ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
