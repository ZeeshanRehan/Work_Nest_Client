import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import Logo from "./assets2/logo2.png";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center text-gray-800">
      {/* Navbar */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-md fixed top-0 z-50">
        <RouterLink to="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img src={Logo} alt="WorkNest Logo" className="h-8 w-auto" />
            <span className="font-semibold text-lg text-blue-700">WorkNest</span>
          </div>
        </RouterLink>

        <nav className="flex gap-6 text-sm text-blue-600 font-medium">
          <ScrollLink to="features" smooth={true} duration={500} className="cursor-pointer hover:text-blue-800">Features</ScrollLink>
          <ScrollLink to="about" smooth={true} duration={500} className="cursor-pointer hover:text-blue-800">About</ScrollLink>
          <ScrollLink to="contact" smooth={true} duration={500} className="cursor-pointer hover:text-blue-800">Contact</ScrollLink>
        </nav>
      </header>

      <div className="pt-20"> {/* Push content below fixed navbar */}

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-screen flex flex-col justify-center items-center px-4"
        >
          <h1 className="text-5xl font-extrabold text-blue-800 mb-4 drop-shadow">
            Welcome to <span className="text-blue-600">WorkNest</span> 
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-md">
            Organize productivity, chat in groups, and stay accountable with friends.
          </p>
          <div className="flex gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <RouterLink to="/login">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition">
                  Login
                </button>
              </RouterLink>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <RouterLink to="/signup">
                <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-xl shadow-md hover:bg-blue-50 transition">
                  Sign Up
                </button>
              </RouterLink>
            </motion.div>
          </div>
        </motion.div>

        {/* Why WorkNest Section */}
        <section id="about" className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Why WorkNest?</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Built by a student tired of half-baked group chats and chaotic productivity setups. 
            WorkNest is where simplicity meets structure — chat, organize, and stay on track with the people who matter.
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-blue-50">
          <h2 className="text-3xl font-bold text-blue-700 mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <Feature title="✅ Group Creation" desc="Form groups for projects, classes, or personal goals." />
            <Feature title="💬 Real-time Chat" desc="Message your crew instantly to stay in sync." />
            <Feature title="🎯 Task Tracking" desc="Assign goals and track progress together." />
            <Feature title="🔔 Smart Reminders" desc="Gentle nudges to help you follow through." />
          </div>
        </section>

        {/* Creator Note */}
        <section className="py-20 px-6 bg-white">
          <h2 className="text-3xl font-bold text-blue-700 mb-6">Built with Purpose</h2>
          <p className="max-w-xl mx-auto text-lg text-gray-700">
            This started as a personal tool — something I genuinely needed to stay focused 
            and accountable with my friends. Hope it helps you too 🙌
          </p>
        </section>

        {/* Contact / Feedback */}
        <section id="contact" className="py-20 px-6 bg-blue-100">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Let’s Connect</h2>
          <p className="text-lg text-gray-700 mb-4">
            Have feedback? Wanna collab? Just wanna say hi?
          </p>
          <p className="text-md">
            Reach out at: <a href="mailto:zeeshanrehan12345@gmail.com" className="text-blue-600 underline">zeeshanrehan12345@gmail.com</a>
          </p>
          <p className="text-md">
            Or hit me up on <a href="https://www.linkedin.com/in/zeshan-rehan-504ab0128/" className="text-blue-600 underline">LinkedIn</a>
          </p>
        </section>

        {/* Footer */}
        <footer className="py-6 text-sm text-gray-500 bg-white">
          © 2025 WorkNest | Built with ❤️ by Zeshan
        </footer>
      </div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

export default App;
