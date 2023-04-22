import React, { useEffect } from "react";
import { preLoaderAnim } from "../animations";

const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
      <div className="texts-container">
        <span>BAKERSERVE,</span>
        <span>INVEST,</span>
        <span>EARN</span>
      </div>
    </div>
  );
};

export default PreLoader;
