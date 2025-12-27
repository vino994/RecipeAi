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

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function HomeHero() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      
      {/* PARALLAX BACKGROUND LAYERS */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main background with parallax effect */}
        <div 
          className="absolute inset-0 bg-fixed bg-cover bg-center scale-105"
          style={{ 
            backgroundImage: `url(${heroBg})`,
            backgroundAttachment: 'fixed',
            willChange: 'transform'
          }}
        />
        
        {/* Gradient overlay layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
        
        {/* Animated floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* HERO CONTENT */}
      <section className="relative min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8">
        
        {/* MAIN HERO TEXT */}
        <motion.div
          className="relative z-10 w-full max-w-6xl mx-auto text-center pt-32 md:pt-40"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={floatingAnimation}
            className="inline-block mb-6"
          >
            <div className="glass-blur rounded-2xl px-6 py-2 inline-flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-white/90 font-medium">Powered by AI</span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight"
          >
            <span className="block">Cook Smart</span>
            <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              With AI Chef
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Your personal AI cooking assistant that speaks both{" "}
            <span className="text-cyan-300 font-semibold">English</span> and{" "}
            <span className="text-purple-300 font-semibold">தமிழ்</span>.
            Get instant recipes, voice guidance, and step-by-step cooking help.
          </motion.p>

          {/* CALL TO ACTION BUTTONS */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              to="/recipe"
              className="group relative px-8 py-4 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0.5 bg-black/90 rounded-2xl" />
              <div className="relative flex items-center justify-center gap-3 text-white font-bold text-lg">
                <span className="text-2xl">🍳</span>
                Start Cooking with AI
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>

            <motion.a
              href="#features"
              variants={fadeUp}
              className="glass-blur px-6 py-3 rounded-xl text-white/90 font-medium hover:text-white transition-colors border border-white/20 hover:border-white/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎬 See Demo
            </motion.a>
          </motion.div>

          {/* VOICE DEMO INDICATOR */}
          <motion.div
            variants={fadeUp}
            className="mt-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-4 bg-cyan-400 rounded-full"
                  animate={{
                    height: ["0.5rem", "1.5rem", "0.5rem"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-white/70">Voice Assistant Ready</span>
          </motion.div>
        </motion.div>

        {/* FEATURE CARDS SECTION */}
        <div id="features" className="relative z-10 w-full max-w-7xl mx-auto pb-32 px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Three powerful AI assistants for all your cooking and travel needs
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <FeatureCard
              emoji="🍲"
              title="Recipe AI"
              description="Voice or text recipe search with step-by-step cooking guidance in Tamil & English."
              features={["Voice Commands", "Bilingual Support", "Step-by-Step Audio", "Ingredient Search"]}
              gradient="from-cyan-500/20 to-cyan-600/20"
              link="/recipe"
              delay={0}
            />

            <FeatureCard
              emoji="🧳"
              title="Tour AI"
              description="Discover destinations and plan smart tours effortlessly with AI recommendations."
              features={["Destination Finder", "Itinerary Planner", "Local Tips", "Budget Planning"]}
              gradient="from-purple-500/20 to-pink-600/20"
              link="/tour"
              delay={0.2}
            />

            <FeatureCard
              emoji="✈"
              title="Travel AI"
              description="AI-powered itineraries, booking suggestions, and travel recommendations."
              features={["Smart Itineraries", "Best Deals", "Weather Info", "Local Culture Guide"]}
              gradient="from-orange-500/20 to-red-600/20"
              link="/travel"
              delay={0.4}
            />
          </motion.div>
        </div>

        {/* SCROLL INDICATOR */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="glass-blur w-10 h-16 rounded-full flex items-start justify-center pt-3">
            <div className="w-1 h-4 bg-white/60 rounded-full" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ---------------- FEATURE CARD COMPONENT ---------------- */

function FeatureCard({ emoji, title, description, features, gradient, link, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="group relative"
    >
      {/* GLOW EFFECT */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-3xl blur opacity-0 group-hover:opacity-70 transition duration-500`} />
      
      {/* GLASS CARD */}
      <div className="relative h-full rounded-3xl p-8
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-xl
        border border-white/20
        shadow-2xl
        flex flex-col
        group-hover:border-white/30 transition-colors">
        
        {/* EMOJI */}
        <motion.div 
          className="text-6xl mb-6 inline-block"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {emoji}
        </motion.div>

        {/* TITLE */}
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

        {/* DESCRIPTION */}
        <p className="text-white/70 mb-6 flex-grow">{description}</p>

        {/* FEATURES LIST */}
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span className="text-sm text-white/80">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* LINK */}
        <Link
          to={link}
          className="group/link inline-flex items-center justify-center gap-2
            bg-white/10 hover:bg-white/20
            border border-white/20 hover:border-white/40
            text-white font-medium py-3 px-6 rounded-xl
            transition-all duration-300"
        >
          <span>Explore {title}</span>
          <span className="group-hover/link:translate-x-1 transition-transform">→</span>
        </Link>

        {/* DECORATIVE ELEMENTS */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10" />
        <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-white/5 border border-white/10" />
      </div>
    </motion.div>
  );
}