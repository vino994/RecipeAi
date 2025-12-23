import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TourAI from "./pages/TourAI";
import TravelAI from "./pages/TravelAI";

export default function App() {
  return (
    <>
      <Navbar />

      {/* PAGE CONTENT WITH TOP SPACE */}
      <main className="pt-10">
        <Routes>
          <Route path="/" element={<Navigate to="/recipe" />} />
          <Route path="/recipe" element={<Home />} />
          <Route path="/tour" element={<TourAI />} />
          <Route path="/travel" element={<TravelAI />} />
        </Routes>
      </main>
    </>
  );
}
