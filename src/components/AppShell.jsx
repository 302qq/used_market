import { connectedWallet } from "../data/mockData.js";
import { shortenAddress } from "../utils/format.js";

function Sidebar({ routes, activePath }) {
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
    </aside>
  );
}

function Header() {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Sepolia Testnet MVP</p>
        <h1>소유권 이력 인증 서비스</h1>
      </div>
      <div className="walletPill">
        <span className="statusDot" />
        {shortenAddress(connectedWallet)}
      </div>
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
