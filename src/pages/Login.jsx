import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginWithGoogle } from "../redux/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import orungLogo from "../assets/Orung Logo.png";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const finishLogin = (role) => navigate(role === "admin" ? "/admin/dashboard" : "/");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await dispatch(loginUser(form)).unwrap();
      toast.success("Welcome back.");
      finishLogin(result.role);
    } catch (error) {
      toast.error(error || "We couldn't sign you in. Please check your details.");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast.success("Welcome to Orung.");
      finishLogin(result.role);
    } catch (error) {
      toast.error(error || "Google sign-in failed. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f5f0] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid min-h-[650px] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_-45px_rgba(18,18,18,.35)] lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-[#171715] p-12 text-[#faf9f6] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-32 size-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,78,31,.32),transparent_68%)]" />
          <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3" aria-label="Orung home">
            <img className="size-11 rounded-full bg-white object-contain p-1" src={orungLogo} alt="" />
            <span className="font-display text-xl font-black tracking-[.15em]">ORUNG</span>
          </Link>
          <div className="relative z-10 max-w-lg">
            <p className="mb-5 font-mono text-[10px] tracking-[.2em] text-[#ff7952]">YOUR STYLE, YOUR STORY</p>
            <h1 className="font-display text-6xl font-black uppercase leading-[.9]">Good to have you back.</h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Sign in to pick up where you left off and find something that feels like you.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-5 text-xs text-white/55">
            <ShieldCheck size={17} className="text-[#ff7952]" />
            A more personal way to shop Orung.
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#ff4e1f]">
              <ArrowLeft size={16} /> Back to Orung
            </Link>
            <p className="mb-3 font-mono text-[10px] font-semibold tracking-[.18em] text-[#ff4e1f]">MEMBER SIGN IN</p>
            <h2 className="text-4xl font-black tracking-tight text-[#171715]">Welcome back</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Enter your details to access your account.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Email address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Password</span>
                <span className="relative block">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171715] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"} {!loading && <ArrowRight size={17} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> Or continue with <span className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="flex justify-center">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-in failed. Please try again.")} />
            </div>
            <p className="mt-8 text-center text-sm text-slate-500">
              New to Orung? <NavLink to="/signup" className="font-bold text-[#d9461d] hover:underline">Create an account</NavLink>
            </p>
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default Login;
