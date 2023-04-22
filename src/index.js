import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const bnbChainTest = {
  id: 97,
  name: "BNB TESTNET",
  network: "BNB TESTNET",
  iconUrl:
    "https://res.cloudinary.com/josh4324/image/upload/v1665571745/Cjdowner-Cryptocurrency-Binance-Coin_jbz2nh.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  blockExplorers: {
    default: { name: "BSCSCAN", url: "https://testnet.bscscan.com/" },
    etherscan: { name: "BSCSCAN", url: "https://testnet.bscscan.com/" },
  },
  testnet: true,
};
const bnbChain = {
  id: 56,
  name: "BNB",
  network: "BNB",
  iconUrl:
    "https://res.cloudinary.com/josh4324/image/upload/v1665571745/Cjdowner-Cryptocurrency-Binance-Coin_jbz2nh.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: "https://bsc-dataseed.binance.org/",
  },
  blockExplorers: {
    default: { name: "BSCSCAN", url: "https://bscscan.com/" },
    etherscan: { name: "BSCSCAN", url: "https://bscscan.com/" },
  },
  testnet: false,
};

/* const { provider, chains } = configureChains(
  [avalancheChain],
  [jsonRpcProvider({ rpc: (chain) => ({ http: chain.rpcUrls.default }) })]
); */

const { chains, provider } = configureChains(
  [
    /* chain.mainnet,
    chain.polygon,
    chain.optimism,
    chain.arbitrum,
    chain.goerli,
    chain.polygonMumbai,
    bnbChainTest,
    bnbChain, */
    chain.polygonMumbai,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
