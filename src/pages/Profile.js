import React, { useState, useEffect, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { useBalance } from "wagmi";
import { ethers } from "ethers";
import marketABI from "../abis/market.json";
import { marketAddress } from "../utils/constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

export default function Profile() {
  const { data: signer } = useSigner();
  const amountRef = useRef();
  const { address } = useAccount();
  const [bal, setBalance] = useState(0);
  const [bal2, setBalance2] = useState(0);
  const [pending, setPending] = useState([]);
  const [comp, setComp] = useState([]);
  const [del, setDel] = useState([]);

  const createMarketContract = async () => {
    const marketContract = new ethers.Contract(
      marketAddress,
      marketABI.abi,
      signer
    );
    return marketContract;
  };

  const getBal = async () => {
    const bal = await fetchBalance({ addressOrName: address });
    setBalance(ethers.BigNumber.from(bal.value) / 10 ** 18);
  };

  const confirm = async (id, status) => {
    const contract = await createMarketContract();
    const id1 = toast.loading("Transaction in progress..");
    try {
      const allow = await contract.confirmProduct(id, status);
      await allow.wait();
      toast.update(id1, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => window.location.reload(), 5000);
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

  const accept = (id, status) => {
    confirmAlert({
      title: "Confirm to submit",
      message:
        "Are you sure you want to confirm this request, this means you have checked and confirmed the quality of the product.",
      buttons: [
        {
          label: "Yes",
          onClick: () => confirm(id, status),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const reject = (id, status) => {
    confirmAlert({
      title: "Confirm to submit",
      message:
        "Are you sure you want to reject this request, this means the product is not acceptable and will be returned",
      buttons: [
        {
          label: "Yes",
          onClick: () => confirm(id, status),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const withdraw = async (amount) => {
    console.log(amount);
    const contract = await createMarketContract();
    const id1 = toast.loading("Transaction in progress..");
    try {
      const allow = await contract.withdraw(ethers.utils.parseEther(amount));
      await allow.wait();
      toast.update(id1, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => window.location.reload(), 5000);
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

  const getBal2 = async () => {
    const contract = await createMarketContract();
    try {
      const bal2 = await contract.Balances(address);
      console.log(bal2);
      setBalance2(ethers.BigNumber.from(bal2) / 10 ** 18);
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = async () => {
    const contract = await createMarketContract();
    try {
      const pend = await contract.fetchMyPendingTransactions();
      console.log(pend);
      setPending(pend);
    } catch (error) {
      console.log(error);
    }
  };

  const getComp = async () => {
    const contract = await createMarketContract();
    try {
      const comp = await contract.fetchMyCompletedTransactions();
      console.log(comp);
      setComp(comp);
    } catch (error) {
      console.log(error);
    }
  };

  const getDelivery = async () => {
    const contract = await createMarketContract();
    try {
      const delivery = await contract.fetchProductsDelivery();
      const items = await Promise.all(
        delivery.map(async (i) => {
          const product = await contract.getProduct(i.productId);
          let item = {
            buyer: i.buyer,
            userAddres: i.userAddres,
            productId: i.productId,
            product,
          };
          return item;
        })
      );
      console.log(items);
      setDel(items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBal();
    getBal2();
    getTransactions();
    getComp();
    getDelivery();
  }, [signer, address]);

  return (
    <div>
      <Header />
      <main>
        <div className="cflex">
          <div className="card3">
            <div className="cardt1">Market Balance</div>
            <div className="cardt1">{bal2}</div>

            <input
              ref={amountRef}
              className="with"
              placeholder="Enter Amount"
            />
            <button
              className="withdb"
              onClick={() => withdraw(amountRef.current.value)}
            >
              {" "}
              Withdraw
            </button>
          </div>
          <div className="card3">
            <div className="cardt1">Balance</div>
            <div className="cardt1">{bal}</div>
          </div>
        </div>

        <div>
          {pending.length > 0 ? (
            <div>
              {" "}
              <h3 className="cardt2">Pending Transactions</h3>
              <div>
                {pending.map((item) => {
                  return (
                    <div className="transactList">
                      <div className="cardt1">
                        Product Name - {item.productName}
                      </div>
                      <div className="cardt1">
                        Product Amount -{" "}
                        {Number(ethers.BigNumber.from(item.productAmount)) /
                          10 ** 18}
                      </div>
                      <div className="cardt1">
                        Product Status - {item.status ? "Paid" : "Pending"}
                      </div>
                      <div className="conflex">
                        <button
                          onClick={() => accept(item.productId, true)}
                          className="conbut"
                        >
                          Confirm Transaction
                        </button>
                        <button
                          onClick={() => reject(item.productId, false)}
                          className="conbut"
                        >
                          Reject Transaction
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          {comp.length > 0 ? (
            <div>
              {" "}
              <h3 className="cardt2">Completed Transactions</h3>
              <div>
                {comp.map((item) => {
                  return (
                    <div className="transactList">
                      <div className="cardt1">
                        Product Name - {item.productName}
                      </div>
                      <div className="cardt1">
                        Product Amount -{" "}
                        {Number(ethers.BigNumber.from(item.productAmount)) /
                          10 ** 18}
                      </div>
                      <div className="cardt1">
                        Product Status - {item.status ? "Paid" : "Pending"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div>
          {del.length > 0 ? (
            <div>
              {" "}
              <h3 className="cardt2">Pending Delivery</h3>
              <div>
                {del.map((item) => {
                  return (
                    <div className="transactList1">
                      <div className="cardt1">Buyer Address - {item.buyer}</div>
                      <div className="cardt1">
                        Product Id -{" "}
                        {Number(ethers.BigNumber.from(item.productId))}
                      </div>
                      <div className="cardt1">
                        Product Name - {item.product.name}
                      </div>
                      <div className="cardt1">
                        Delivery Address - {item.userAddres}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
