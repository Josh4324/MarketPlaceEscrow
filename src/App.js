import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./bem/header.css";
import "./bem/footer.css";
import "./bem/home.css";
import "./bem/mint.css";
import "./App.scss";

import { AnimatePresence } from "framer-motion";
import AnimatedRoutes from "./AnimatedRoutes";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AnimatePresence>
          <AnimatedRoutes />
        </AnimatePresence>
        <ToastContainer autoClose={15000} />
      </BrowserRouter>
    </div>
  );
}

export default App;
