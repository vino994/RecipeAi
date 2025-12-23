import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "text-[var(--accent)] font-semibold"
      : "text-[var(--darkText)]";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[var(--main)] to-[var(--secondary)] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <div className="text-xl font-bold text-[var(--darkText)]">
            🤖 JD Recipe Ai
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex gap-10">
            <Link className={isActive("/recipe")} to="/recipe">Recipe AI</Link>
            <Link className={isActive("/tour")} to="/tour">Tour AI</Link>
            <Link className={isActive("/travel")} to="/travel">Travel AI</Link>
          </div>

          <div className="hidden sm:flex gap-3">
            <button className="bg-white px-4 py-1 rounded-xl shadow">Login</button>
            <button className="bg-[var(--accent)] text-white px-4 py-1 rounded-xl shadow">
              Sign Up
            </button>
          </div>

          {/* Mobile */}
          <button className="sm:hidden text-2xl" onClick={() => setOpen(true)}>☰</button>
        </div>
      </nav>
    </>
  );
}
