import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Sidebar({ toggle }) {
  return (
    <div className={toggle ? "sidebar animation1" : "sidebar animation2"}>
      <Link className="atag" to="/mint">
        <div className="side-item">Mint NFT</div>
      </Link>
      <Link className="atag" to="/collections">
        <div className="side-item">Collections</div>
      </Link>
      <Link className="atag" to="/resell">
        <div className="side-item">Resell</div>
      </Link>
      <Link className="atag" to="/faq">
        <div className="side-item">FAQ</div>
      </Link>
      <Link className="atag" to="/contact">
        <div className="side-item">Contact us</div>
      </Link>
      <div className="side-item">Whitepaper</div>
      <Link className="atag" to="/roadmap">
        <div className="side-item">Roadmap</div>
      </Link>
      <div className="">
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        className="btn1"
                        onClick={openConnectModal}
                        type="button"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported || chain.id !== 97) {
                    return (
                      <button
                        className="btn1"
                        onClick={openChainModal}
                        type="button"
                      >
                        Wrong network - {chain.name}
                      </button>
                    );
                  }

                  return (
                    <div>
                      <button
                        className="btn3"
                        onClick={openAccountModal}
                        type="button"
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ""}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
}
