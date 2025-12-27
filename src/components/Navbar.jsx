import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Recipe AI", path: "/recipe" },
    { name: "Tour AI", path: "/tour" },
    { name: "Travel AI", path: "/travel" },
  ];

  /* ---------- SHRINK ON SCROLL ---------- */
  useEffect(() => {
    const onScroll = () => {
      setShrink(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        animate={{
          paddingTop: shrink ? "0.5rem" : "0.9rem",
          paddingBottom: shrink ? "0.5rem" : "0.9rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="
          fixed top-0 left-0 w-full z-50
          bg-white/10 backdrop-blur-xl
          border-b border-white/20
          shadow-lg
        "
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          {/* LOGO */}
          <Link
            to="/"
            className="text-xl font-bold text-white"
          >
            🤖 JD Recipe AI
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden sm:flex gap-10 text-lg relative">
            {links.map((link) => {
              const active = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative pb-1 transition ${
                    active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}

                  {/* UNDERLINE */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-0 -bottom-1 h-[3px] w-full bg-white rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="sm:hidden text-3xl text-white"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </motion.nav>

      {/* SPACER */}
      <div className="h-[80px]" />

      {/* ---------- MOBILE GLASS DRAWER ---------- */}
      <AnimatePresence>
        {open && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* DRAWER */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="
                fixed top-0 left-0 h-full w-72 z-50
                bg-white/15 backdrop-blur-xl
                border-r border-white/20
                shadow-2xl
              "
            >
              <div className="px-6 py-6 flex flex-col gap-6">

                {/* CLOSE */}
                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl self-end text-white"
                >
                  ✕
                </button>

                {/* LINKS */}
                {links.map((link) => {
                  const active = location.pathname === link.path;

                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className={`relative pb-2 text-lg transition ${
                        active
                          ? "text-white font-semibold"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {link.name}

                      {active && (
                        <motion.span
                          layoutId="mobile-underline"
                          className="absolute left-0 -bottom-1 h-[3px] w-full bg-white rounded-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
