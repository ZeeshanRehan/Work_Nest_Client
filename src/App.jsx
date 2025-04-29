import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center px-4"
    >
      <h1 className="text-5xl font-extrabold text-blue-800 mb-4 drop-shadow">
        Welcome to <span className="text-blue-600">WorkNest</span> 🪺
      </h1>
      <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-md">
        Organize your productivity, chat in groups, and stay accountable with friends.
      </p>
      <div className="flex gap-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/login">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow-md hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/signup">
            <button className="bg-white text-blue-600 border border-blue-600 px-6 py-2 rounded-xl shadow-md hover:bg-blue-50 transition">
              Sign Up
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default App;
