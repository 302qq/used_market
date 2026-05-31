import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ItemRegistryProvider } from "./context/ItemRegistryContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WalletProvider>
      <ItemRegistryProvider>
        <App />
      </ItemRegistryProvider>
    </WalletProvider>
  </StrictMode>
);
