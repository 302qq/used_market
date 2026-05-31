import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ItemRegistryProvider } from "./context/ItemRegistryContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProvider>
      <ItemRegistryProvider>
        <App />
      </ItemRegistryProvider>
    </WalletProvider>
  </React.StrictMode>
);
