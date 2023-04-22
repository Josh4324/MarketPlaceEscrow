import React, { useEffect, useState, useRef } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useSigner, useAccount } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { toast } from "react-toastify";
import busdABI from "../abis/busd.json";
import nftABI from "../abis/nft.json";
import marketABI from "../abis/market.json";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import {
  marketAddress,
  busdAddress,
  farm100Address,
  farm200Address,
  farm500Address,
} from "../utils/constants";
import axios from "axios";

export default function Mint(props) {
  const { data: signer } = useSigner();
  const selectRef = useRef();

  const [nft, setNFT] = useState([]);
  const [loading, setLoading] = useState(false);
  const [back, setBack] = useState([]);
  const [allowance, setAllowance] = useState(0);
  const [app, setApp] = useState(0);
  const { address } = useAccount();

  const createMarketContract = async () => {
    const marketContract = new ethers.Contract(
      marketAddress,
      marketABI.abi,
      signer
    );
    return marketContract;
  };

  const createBUSDContract = async () => {
    const marketContract = new ethers.Contract(
      busdAddress,
      busdABI.abi,
      signer
    );
    return marketContract;
  };

  const getAllNFTs = async () => {
    setLoading(true);
    const contract = await createMarketContract();
    const nfts = await contract.fetchListItems();

    let item;

    const items = await Promise.all(
      nfts.map(async (i) => {
        const marketContract = new ethers.Contract(
          i.nftaddress,
          nftABI.abi,
          signer
        );
        const tokenUri = await marketContract.tokenURI(
          Number(BigNumber.from(i.tokenId))
        );

        const meta = await axios.get(tokenUri, {
          headers: {
            Accept: "text/plain",
          },
        });

        item = {
          price: Number(BigNumber.from(i.price)) / 10 ** 18,
          description: meta.data.description,
          image: meta.data.image,
          name: meta.data.name,
          owner: i.owner,
          tokenId: i.tokenId,
          sold: i.sold,
          nftaddress: i.nftaddress,
          listId: i.listId,
        };

        return item;
      })
    );

    const filter = items.filter(
      (item) => item.owner === "0xCF59aC8b973A5B1fF452f2d1654899F97edecdFF"
    );

    console.log(filter);

    setNFT(filter);
    setBack(filter);
    setLoading(false);
  };

  const checkFilter = () => {
    let res;
    if (selectRef.current.value === "BakerFarmNFT ($100)") {
      res = back.filter((item) => item.nftaddress === farm100Address);
      console.log(res);
      setNFT(res);
    } else if (selectRef.current.value === "BakerFarmNFT ($200)") {
      res = back.filter((item) => item.nftaddress === farm200Address);
      setNFT(res);
    } else if (selectRef.current.value === "BakerFarmNFT ($500)") {
      res = back.filter((item) => item.nftaddress === farm500Address);
      setNFT(res);
    } else {
      setNFT(back);
    }
  };

  const search = (name) => {
    const res = back.filter((item) => item.name.includes(name));
    setNFT(res);
  };

  const approve = async (amount) => {
    if (amount === "") {
      return toast.error("Please enter  amount");
    }
    const contract = await createBUSDContract();
    const id = toast.loading("Approval in progress..");
    try {
      const allow = await contract.approve(
        marketAddress,
        ethers.utils.parseEther(String(amount))
      );
      await allow.wait();
      toast.update(id, {
        render: "Approval successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setApp(1);
      //setTimeout(() => window.location.reload(), 5000);
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

  const buy = async (nftaddress, tokenId) => {
    console.log(nftaddress, tokenId);
    const contract = await createMarketContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const allow = await contract.buy(nftaddress, tokenId);
      await allow.wait();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => window.location.reload(), 5000);
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

  const checkAllowance = async (owner, spender) => {
    const contract = await createBUSDContract();
    try {
      const allow = await contract.allowance(owner, spender);
      console.log("all", Number(BigNumber.from(allow)));
      setAllowance(allow);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllNFTs();
    checkAllowance(address, marketAddress);
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [signer]);

  useEffect(() => {
    getAllNFTs();
    checkAllowance(address, marketAddress);
  }, [app]);

  return (
    <div className="full-bg">
      <Header />
      <main>
        <section className="mint-section1">
          <div className="mint_text1">Mint {nft.length} BServe NFTs</div>
          <div className="mint_text2">BServe</div>
        </section>

        <section className="mint-section2">
          <div className="mint-section2-inner">
            <input
              className="search "
              type="search"
              onChange={(evt) => search(evt.target.value)}
              placeholder="Search Nfts or collection name"
            />
            <div className="filterx">
              <div className="filter-text">Filter by</div>
              <select onChange={checkFilter} ref={selectRef} className="snft">
                <option>All</option>
                <option>BakerFarmNFT ($100)</option>
                <option>BakerFarmNFT ($200)</option>
                <option>BakerFarmNFT ($500)</option>
              </select>
              {/*  <div className="artflex">
                <img
                  onClick={() =>
                    checkFilter("0x76428C58831679F525C9950423DA53e8592df894")
                  }
                  src="./images/art1.svg"
                  alt="art1"
                />
                <img
                  onClick={() =>
                    checkFilter("0x9eC8f57a30cf5b3a68F9E39AdCdff6365f0d4A0e")
                  }
                  src="./images/art2.svg"
                  alt="art2"
                />
                <img
                  onClick={() =>
                    checkFilter("0xC00EC860aa059F450389C7171959F678681350aE")
                  }
                  src="./images/art3.svg"
                  alt="art3"
                />
              </div> */}
            </div>
          </div>

          <div className="nftlist">
            {nft.map((item, index) => {
              return (
                <Tilt className="">
                  <div key={index} className="nft">
                    <img className="nftimg" src={item.image} alt="nft1" />
                    <div className="nftflex">
                      <div>
                        <div className="mint_text3 ">{item.name}</div>
                        <div className="mint_text4">
                          {item.name.slice(0, -3)}
                        </div>
                      </div>
                      <div>
                        <div className="mint_text3 "> {item.price} BUSD</div>
                        <div className="mint_text4">Mint fee</div>
                      </div>
                    </div>
                    {item.price >
                    Number(BigNumber.from(allowance / 10 ** 18)) ? (
                      <button
                        onClick={() => approve(item.price)}
                        className="nftbut"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => buy(item.nftaddress, item.tokenId)}
                        className="nftbut"
                      >
                        Mint NFT
                      </button>
                    )}
                  </div>
                </Tilt>
              );
            })}

            <div className="mint_textc2">
              {loading === true
                ? "Loading ......."
                : nft.length === 0
                ? "No NFTS"
                : ""}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
