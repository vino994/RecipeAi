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
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[var(--main)] to-[var(--secondary)] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <div className="text-xl font-bold text-[var(--darkText)]">
            🤖 JD Recipe AI
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex gap-10">
            <Link className={isActive("/recipe")} to="/recipe">Recipe AI</Link>
            <Link className={isActive("/tour")} to="/tour">Tour AI</Link>
            <Link className={isActive("/travel")} to="/travel">Travel AI</Link>
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden sm:flex gap-3">
            <button className="bg-white px-4 py-1 rounded-xl shadow">
              Login
            </button>
            <button className="bg-[var(--accent)] text-white px-4 py-1 rounded-xl shadow">
              Sign Up
            </button>
          </div>

          {/* HAMBURGER */}
          <button
            className="sm:hidden text-3xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="sm:hidden bg-white shadow-lg border-t">
            <div className="flex flex-col gap-4 px-6 py-5 text-lg">

              <Link
                to="/recipe"
                onClick={() => setOpen(false)}
                className={isActive("/recipe")}
              >
                🍲 Recipe AI
              </Link>

              <Link
                to="/tour"
                onClick={() => setOpen(false)}
                className={isActive("/tour")}
              >
                🧳 Tour AI
              </Link>

              <Link
                to="/travel"
                onClick={() => setOpen(false)}
                className={isActive("/travel")}
              >
                ✈ Travel AI
              </Link>

              <hr />

              <button
                onClick={() => setOpen(false)}
                className="bg-gray-100 px-4 py-2 rounded-xl"
              >
                Login
              </button>

              <button
                onClick={() => setOpen(false)}
                className="bg-[var(--accent)] text-white px-4 py-2 rounded-xl"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
