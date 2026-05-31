import { useEffect, useMemo, useState } from "react";
import AppShell from "./components/AppShell.jsx";
import Home from "./pages/Home.jsx";
import Market from "./pages/Market.jsx";
import RegisterItem from "./pages/RegisterItem.jsx";
import MyItems from "./pages/MyItems.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import TransactionHistory from "./pages/TransactionHistory.jsx";
import TransferOwnership from "./pages/TransferOwnership.jsx";

const routes = [
  { path: "#/", label: "Home", component: Home },
  { path: "#/market", label: "Market", component: Market },
  { path: "#/register", label: "Register Item", component: RegisterItem },
  { path: "#/my-items", label: "My Items", component: MyItems },
  { path: "#/item/1", label: "Item Detail", component: ItemDetail },
  { path: "#/transactions", label: "Transaction History", component: TransactionHistory },
  { path: "#/transfer/1", label: "Transfer Ownership", component: TransferOwnership }
];

function getHashPath() {
  return window.location.hash || "#/";
}

export default function App() {
  const [path, setPath] = useState(getHashPath);

  useEffect(() => {
    const handleHashChange = () => setPath(getHashPath());
    window.addEventListener("hashchange", handleHashChange);
    if (!window.location.hash) {
      window.location.hash = "/";
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const Page = useMemo(() => {
    if (path.startsWith("#/item/")) return ItemDetail;
    if (path.startsWith("#/transfer/")) return TransferOwnership;
    return routes.find((route) => route.path === path)?.component || Home;
  }, [path]);

  return (
    <AppShell routes={routes} activePath={path}>
      <Page />
    </AppShell>
  );
}
