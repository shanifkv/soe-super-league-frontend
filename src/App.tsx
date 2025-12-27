import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import Home from "./pages/Home";
import Teams from "./pages/Teams";

export default function App() {
  return (
    <>
      <Header />

      {/* Offset for fixed header */}
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </div>
    </>
  );
}
