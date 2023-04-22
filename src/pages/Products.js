import React, { useState, useEffect } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import marketABI from "../abis/market.json";
import { marketAddress } from "../utils/constants";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { data: signer } = useSigner();

  console.log(signer);

  const createMarketContract = async () => {
    const marketContract = new ethers.Contract(
      marketAddress,
      marketABI.abi,
      signer
    );
    return marketContract;
  };

  const getProducts = async () => {
    const contract = await createMarketContract();
    try {
      const prod = await contract.fetchAllProducts();
      console.log(prod);
      setProducts(prod);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    getProducts();
  }, [signer]);
  return (
    <div>
      <Header />
      <section className="home-section2">
        <div className="live">
          {products.map((item, index) => {
            return (
              <div key={index} className="card">
                <img className="cimg" src={item.img[0]} alt="hero" />
                <div className="textflex1">
                  <div className="text5">{item.name}</div>
                  <div className="text6">
                    {Number(ethers.BigNumber.from(item.amount)) / 10 ** 18}{" "}
                    matic
                  </div>
                </div>
                <div className="text7">Category - {item.category}</div>
                <div className="bidflex">
                  <Link to={`/product/${item.productId}`}>
                    <button className="bidbut1">Buy</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
