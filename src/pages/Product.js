// @ts-nocheck
import React, { useState, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import marketABI from "../abis/market.json";
import { marketAddress } from "../utils/constants";
import { Web3Storage } from "web3.storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";

export default function Product() {
  const [fileUrl, setFileUrl] = useState(null);
  const [files, setFiles] = useState([]);
  const nameRef = useRef();
  const descRef = useRef();
  const amountRef = useRef();
  const categoryRef = useRef();

  const { data: signer } = useSigner();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      toast.info("uploading image......");
      const client = new Web3Storage({
        token: process.env.REACT_APP_TOKEN,
      });

      const cid = await client.put(e.target.files, {
        name: file.name,
        maxRetries: 3,
      });

      const url = `https://ipfs.io/ipfs/${cid}/${file.name}`;
      console.log(url);
      toast.success("img uploaded successfully");
      setFileUrl(url);
      setFiles([...files, url]);
      console.log(files);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  const createMarketContract = async () => {
    const auctionContract = new ethers.Contract(
      marketAddress,
      marketABI.abi,
      signer
    );
    return auctionContract;
  };

  const createProduct = async (evt) => {
    evt.preventDefault();
    const contract = await createMarketContract();
    const id = toast.loading("Transaction in progress..");
    const name = nameRef.current.value;
    const desc = descRef.current.value;
    const amount = ethers.utils.parseEther(amountRef.current.value);
    const category = categoryRef.current.value;

    try {
      const tx = await contract.createProduct(
        name,
        desc,
        amount,
        category,
        files
      );
      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => (window.location.href = "/"), 5000);
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={createProduct} className="auction">
        <div className="text10">Create Product</div>
        <div className="formflex">
          <div className="imgbox">
            <div className="text21">You can upload more than one image</div>
            <input onChange={onChange} type="file" />
            <div>
              {files.map((item) => {
                return <img className="imgf" src={item} />;
              })}
            </div>
          </div>
          <div className="formbox">
            <div className="input-box">
              <label className="label">Product Name</label>
              <input
                ref={nameRef}
                className="input"
                placeholder="Enter Item Name"
                required
              />
            </div>
            <div className="input-box">
              <label className="label">Product Description</label>
              <textarea required ref={descRef} className="textarea"></textarea>
            </div>
            <div className="input-box">
              <label className="label">Amount</label>
              <input
                ref={amountRef}
                className="input"
                placeholder="Enter Amount"
                required
              />
            </div>

            <div className="input-box">
              <label className="label">Category</label>
              <select ref={categoryRef} className="input">
                <option>Select category</option>
                <option>Furnitures</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Cars</option>
                <option>Property</option>
                <option>Art</option>
              </select>
            </div>

            <button className="aubut">Create Product</button>
          </div>
        </div>
      </form>
    </div>
  );
}
