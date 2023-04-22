import React, { useState, useEffect, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import marketABI from "../abis/market.json";
import { marketAddress } from "../utils/constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Detail() {
  let { id } = useParams();

  const deRef = useRef();
  const [product, setProduct] = useState([]);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(images[0]);
  const { data: signer } = useSigner();

  const createMarketContract = async () => {
    const marketContract = new ethers.Contract(
      marketAddress,
      marketABI.abi,
      signer
    );
    return marketContract;
  };

  const getProduct = async () => {
    const contract = await createMarketContract();
    try {
      const prod = await contract.getProduct(id);
      console.log(prod.img);
      setImages(prod.img);
      setImage(prod.img[0]);
      setProduct(prod);
    } catch (error) {
      console.log(error);
    }
  };

  const buy = async () => {
    const contract = await createMarketContract();
    const id1 = toast.loading("Transaction in progress..");
    const delivery = deRef.current.value;
    try {
      const allow = await contract.buyProduct(id, delivery, {
        value: product.amount,
      });
      await allow.wait();
      toast.update(id1, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => (window.location.href = "/profile"), 5000);
    } catch (error) {
      console.log(error);
      toast.update(id1, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const fw = (evt) => {
    evt.preventDefault();
    const index = images.indexOf(image);
    if (index === images.length - 1) {
      setImage(images[0]);
    } else {
      setImage(images[index + 1]);
    }
  };

  const bw = (evt) => {
    evt.preventDefault();
    const index = images.indexOf(image);
    if (index === 0) {
      setImage(images[images.length - 1]);
    } else {
      setImage(images[index - 1]);
    }
  };

  useEffect(() => {
    getProduct();
  }, [signer]);

  return (
    <div>
      <Header />
      <div className="detail">
        <div className="detail1">
          <img className="dimg" src={image} alt="art" />

          <div>
            <button onClick={bw}>Prev</button>
            <button onClick={fw}>Next</button>
          </div>
        </div>
        <div className="detail2">
          <div className="dtf">
            <div className="detail-text1 ">{product.name}</div>

            <div className="detail-text2"></div>
          </div>

          <div className="detail-text3">{product.desc}</div>

          <div className="detail-text5">
            {Number(product.amount) / 10 ** 18} matic
          </div>

          <input
            ref={deRef}
            className="delivery"
            placeholder="Enter Delivery Address"
          />

          <button onClick={buy} className="detailbut">
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}
