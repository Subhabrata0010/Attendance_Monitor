import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import EmailLookup from "./components/EmailLookup";
import Admin from "./components/Admin";
import QRScanner from "./components/QRScanner";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <EmailLookup />
              </>
            }
          />
          <Route path="/Admin" element={<QRScanner />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
