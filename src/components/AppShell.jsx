import React from "react";
import Button from "./Button.jsx";
import { useWallet } from "../context/WalletContext.jsx";
import { shortenAddress } from "../utils/format.js";

function Sidebar({ routes, activePath }) {
  const wallet = useWallet();
  const walletLabel = wallet.account
    ? "Wallet Connected"
    : wallet.isInstalled
      ? "Connect Wallet"
      : "MetaMask 필요";

  return (
    <aside className="sidebar">
      <a className="brand" href="#/">
        <span className="brandMark">CT</span>
        <span>
          <strong>ChainTrust</strong>
          <small>Ownership History</small>
        </span>
      </a>
      <nav className="nav">
        {routes
          .filter((route) => route.path !== "#/item/1" && route.path !== "#/transfer/1")
          .map((route) => (
            <a
              key={route.path}
              className={activePath === route.path ? "navLink active" : "navLink"}
              href={route.path}
            >
              {route.label}
            </a>
          ))}
      </nav>
      <div className="sidebarWallet">
        {wallet.account ? (
          <Button variant="primary" className="wide" onClick={wallet.disconnect}>
            {walletLabel}
          </Button>
        ) : (
          <Button variant="primary" className="wide" onClick={wallet.connect} disabled={wallet.isConnecting || !wallet.isInstalled}>
            {wallet.isConnecting ? "Connecting..." : walletLabel}
          </Button>
        )}
      </div>
    </aside>
  );
}

function Header() {
  const wallet = useWallet();
  const statusLabel = wallet.account
    ? shortenAddress(wallet.account)
    : wallet.isInstalled
      ? "Connect Wallet"
      : "MetaMask 필요";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Sepolia Testnet MVP</p>
        <h1>소유권 이력 인증 서비스</h1>
        {wallet.message ? <p className="walletNotice">{wallet.message}</p> : null}
      </div>
      {wallet.account ? (
        <div className="walletActions">
          <div className={wallet.isSepolia ? "walletPill" : "walletPill warning"}>
            <span className="statusDot" />
            {statusLabel}
          </div>
          <Button variant="secondary" onClick={wallet.disconnect}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button variant="secondary" onClick={wallet.connect} disabled={wallet.isConnecting || !wallet.isInstalled}>
          {wallet.isConnecting ? "Connecting..." : statusLabel}
        </Button>
      )}
    </header>
  );
}

export default function AppShell({ routes, activePath, children }) {
  return (
    <div className="appShell">
      <Sidebar routes={routes} activePath={activePath} />
      <div className="workspace">
        <Header />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
