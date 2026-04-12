import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const { signup } = useAuth(); // make sure this exists
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0533] via-[#0f0520] to-[#0a0a0f]" />

      {/* Glow Effects */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full bottom-[-80px] right-[-80px]" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-purple-500/10"
        >
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-sm text-gray-400 mt-1">
              Join <span className="text-purple-400">CrimeAI</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-3">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Name</label>
            <input
              type="text"
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="text-xs text-gray-400 mb-1 block">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f17] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-sm font-medium text-white transition-all shadow-lg shadow-purple-600/20 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition"
          >
            Continue with Google
          </button>

          {/* Login */}
          <p className="text-xs text-center text-gray-500 mt-5">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:text-purple-300">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}