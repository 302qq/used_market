import React from "react";
import { getDeploymentConfig } from "../config/chain.js";
import { useWallet } from "../context/WalletContext.jsx";

export default function RuntimeStatus() {
  const wallet = useWallet();
  const deployment = getDeploymentConfig();

  const checks = [
    {
      label: "Wallet",
      value: wallet.account ? "Connected" : "Not connected",
      tone: wallet.account ? "ok" : "warn"
    },
    {
      label: "Network",
      value: wallet.chainId ? (wallet.isSepolia ? "Sepolia" : "Wrong network") : "Unknown",
      tone: wallet.chainId && wallet.isSepolia ? "ok" : "warn"
    },
    {
      label: "Contract",
      value: deployment.isContractConfigured ? "Configured" : "Local preview",
      tone: deployment.isContractConfigured ? "ok" : "warn"
    },
    {
      label: "Deploy block",
      value: deployment.hasDeployBlock ? String(deployment.deployBlock) : "Not set",
      tone: deployment.hasDeployBlock ? "ok" : "warn"
    }
  ];

  return (
    <section className="runtimePanel">
      <div>
        <p className="eyebrow">Runtime readiness</p>
        <h2>Sepolia 연결 상태</h2>
      </div>
      <div className="runtimeGrid">
        {checks.map((check) => (
          <div className={`runtimeCheck ${check.tone}`} key={check.label}>
            <span>{check.label}</span>
            <strong>{check.value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
