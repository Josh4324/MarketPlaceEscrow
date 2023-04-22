import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="foot">
      <div className="footer">
        <div>
          <img className="lg" src="./images/lg.svg" alt="logo" />

          {/*  <div className="social-footer">
            <img src="./images/telegram.svg" alt="telegram" />
            <img src="./images/instagram.svg" alt="instagram" />
            <img src="./images/twitter.svg" alt="twitter" />
          </div> */}
          {/*  <div className="footer_text1">
            {" "}
            &copy; 2023 Baker Industries Limited. All rights Reserved
          </div> */}
        </div>
        <div className="footer-inner">
          <div>
            <Link to="/">
              <div className="footer_text2">Home</div>
            </Link>
            <Link to="/mint">
              <div className="footer_text2">Mint</div>
            </Link>
            <Link to="/collections">
              <div className="footer_text2">Collections</div>
            </Link>
          </div>
          <div>
            <div className="footer_text2">Whitepaper</div>
            <Link to="/roadmap">
              <div className="footer_text2">Roadmap</div>
            </Link>
            <Link to="/contact">
              <div className="footer_text2">Contact us</div>
            </Link>
          </div>
          <div className="footer_text11">
            {" "}
            &copy; 2023 Baker Industries Limited. All rights Reserved
          </div>

          <img
            onClick={() => {
              window.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
            className="up"
            src="./images/up.svg"
            alt="up"
          />
        </div>
      </div>
    </div>
  );
}
