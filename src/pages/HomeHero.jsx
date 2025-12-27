import { Link } from "react-router-dom";
import heroBg from "../assets/hero.jpg";
import { motion } from "framer-motion";

/* ---------------- ANIMATION VARIANTS ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function HomeHero() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* PARALLAX BACKGROUND SECTION */}
      <section className="relative min-h-screen overflow-hidden">
        {/* PARALLAX BACKGROUND IMAGE */}
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            transform: 'translateZ(0)', // Hardware acceleration
            willChange: 'transform',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        />
        
        {/* DARK OVERLAY FOR BETTER READABILITY */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* ANIMATED PARTICLES FOR DEPTH */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-[1px] bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10">
          <motion.div
            className="flex flex-col items-center justify-center text-center min-h-[90vh] px-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
            >
              🤖 AI That Helps You
              <span className="block text-[var(--accent)] mt-3">
                Cook • Travel • Explore
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-gray-200 text-lg max-w-2xl"
            >
              Smart AI assistants for Recipes, Tours, and Travel planning.
              Supports Tamil & English voice interaction.
            </motion.p>

            {/* GLASSMORPHISM CTA BUTTONS */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex justify-center gap-4 flex-wrap"
            >
              <Link
                to="/recipe"
                className="glass-effect px-8 py-4 rounded-xl backdrop-blur-lg border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2 text-white font-semibold text-lg">
                  <span className="text-2xl">🍲</span>
                  Try Recipe AI
                </span>
              </Link>

              <Link
                to="/tour"
                className="glass-effect px-8 py-4 rounded-xl backdrop-blur-lg border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2 text-white font-semibold text-lg">
                  <span className="text-2xl">🧳</span>
                  Tour AI
                </span>
              </Link>

              <Link
                to="/travel"
                className="glass-effect px-8 py-4 rounded-xl backdrop-blur-lg border border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center gap-2 text-white font-semibold text-lg">
                  <span className="text-2xl">✈</span>
                  Travel AI
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* FEATURE CARDS WITH GLASSMORPHISM */}
          <div className="relative z-10 pb-32 px-6">
            <motion.div
              className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <Feature
                emoji="🍲"
                title="Recipe AI"
                text="Voice or text recipe search with step-by-step cooking guidance."
                link="/recipe"
              />

              <Feature
                emoji="🧳"
                title="Tour AI"
                text="Discover destinations and plan smart tours effortlessly."
                link="/tour"
              />

              <Feature
                emoji="✈"
                title="Travel AI"
                text="AI-powered itineraries and travel recommendations."
                link="/travel"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- FEATURE CARD ---------------- */

function Feature({ emoji, title, text, link }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative"
    >
      {/* GLASSMORPHISM CARD */}
      <div className="glass-effect rounded-3xl p-8 text-center backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300 shadow-xl hover:shadow-2xl">
        <div className="text-6xl mb-4">{emoji}</div>

        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

        <p className="text-gray-200 mb-6">{text}</p>

        <Link
          to={link}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-medium transition-all duration-300"
        >
          Explore
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </motion.div>
  );
}