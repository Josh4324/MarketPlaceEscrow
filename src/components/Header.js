import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-inner3">
          <Link to="/">
            <div className="logo">DeMarket</div>
          </Link>

          <div className="header-inner2">
            <Link to="/profile">
              <div>Profile</div>
            </Link>

            <Link to="/products">
              <div>Find Products</div>
            </Link>

            <Link to="/myproducts">
              <div>Your Products</div>
            </Link>
          </div>
        </div>

        <div className="header-inner4">
          <Link to="/product">
            <button className="hbut">Create Product</button>
          </Link>

          <ConnectButton
            showBalance={{ smallScreen: true, largeScreen: false }}
          />
        </div>
      </div>
    </div>
  );
}
