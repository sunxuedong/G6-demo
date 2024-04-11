import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Frame from "./routes/frame/index";
import Home from "./routes/home";
import TooltipPlugin from "./routes/tooltip/plugin";
import TooltipCustom from "./routes/tooltip/custom";
import Anchor from "./routes/anchor";
import Demo from "./routes/demo";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<Frame />}>
          <Route index element={<Home />} />
          <Route path="tooltip">
            <Route index element={<TooltipPlugin />} />
            <Route path="plugin" element={<TooltipPlugin />}></Route>
            <Route path="custom" element={<TooltipCustom />}></Route>
          </Route>
          <Route path="anchor" element={<Anchor />} />
          <Route path="demo" element={<Demo />} />
        </Route>
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
