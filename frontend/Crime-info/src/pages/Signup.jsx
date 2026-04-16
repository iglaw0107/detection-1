import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThreeBackground from "../components/ui/ThreeBackground";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const inputBase = `w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border text-white text-sm placeholder-gray-500 focus:outline-none transition-all duration-300`;
  const inputNormal = `${inputBase} border-white/10 focus:border-purple-500/60 focus:bg-white/[0.08]`;
  const inputError = `${inputBase} border-red-500/50 focus:border-red-500 focus:bg-red-500/[0.05]`;

  const passwordStrength = () => {
    const len = form.password.length;
    if (len >= 12) return { level: 4, label: "Strong", color: "bg-green-500" };
    if (len >= 10) return { level: 3, label: "Good", color: "bg-yellow-500" };
    if (len >= 8) return { level: 2, label: "Fair", color: "bg-orange-500" };
    return { level: 1, label: "Too short", color: "bg-red-500" };
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!agreed) newErrors.agreed = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err?.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password ? passwordStrength() : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      <ThreeBackground />

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#1a0533]/60 via-[#0a0a0f]/40 to-[#0a0a0f]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none z-[1]" />
      <div
        className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[440px]"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-widest bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              CRIMEAI
            </span>
          </motion.div>

          {/* Card */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-purple-500/30 via-transparent to-cyan-500/30 opacity-50 blur-sm" />
            <div className="relative rounded-3xl bg-[#111118]/90 backdrop-blur-xl border border-white/[0.08] p-8 md:p-10 shadow-2xl shadow-black/50">

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
                <p className="text-sm text-gray-400">Start using CrimeAI today</p>
              </div>

              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 text-center"
                >
                  {serverError}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({}); }}
                    placeholder="John Doe"
                    className={errors.name ? inputError : inputNormal}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 mt-1.5 ml-1">
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({}); }}
                    placeholder="you@example.com"
                    className={errors.email ? inputError : inputNormal}
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 mt-1.5 ml-1">
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({}); }}
                      placeholder="Min 8 characters"
                      className={`${errors.password ? inputError : inputNormal} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 mt-1.5 ml-1">
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Strength indicator */}
                  {strength && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= strength.level ? strength.color : "bg-white/10"}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-500">{strength.label}</p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Confirm Password</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({}); }}
                    placeholder="••••••••••"
                    className={errors.confirmPassword ? inputError : inputNormal}
                  />
                  <AnimatePresence>
                    {errors.confirmPassword && (
                      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 mt-1.5 ml-1">
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <div className="relative w-4 h-4 mt-0.5 cursor-pointer flex-shrink-0" onClick={() => setAgreed(!agreed)}>
                    <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${agreed ? "bg-purple-600 border-purple-600" : "border-white/20 hover:border-white/40"}`}>
                      {agreed && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    I agree to the{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</a>
                  </span>
                </div>
                {errors.agreed && (
                  <p className="text-xs text-red-400 ml-1 -mt-2">{errors.agreed}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-medium text-sm transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? <><Spinner /> Creating account...</> : "Create Account"}
                </motion.button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-gray-600 mt-8"
          >
            Protected by end-to-end encryption
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}