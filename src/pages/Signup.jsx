import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { loginWithGoogle, setCredentials } from "../redux/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import orungLogo from "../assets/Orung Logo.png";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/signup", form);
      setVerificationEmail(form.email);
      setVerificationStep(true);
      toast.success("Account created. Check your email for the verification code.");
    } catch (error) {
      toast.error(error.response?.data?.message || "We couldn't create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/auth/verify-otp", {
        email: verificationEmail,
        otp,
      });
      dispatch(setCredentials({
        token: response.data.token,
        role: response.data.user.role,
      }));
      toast.success("Your email is verified. Welcome to Orung!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "That code could not be verified.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await dispatch(loginWithGoogle(credentialResponse.credential)).unwrap();
      toast.success("Your Orung account is ready.");
      navigate("/");
    } catch (error) {
      toast.error(error || "Google sign-up failed. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f5f0] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto grid min-h-[680px] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_30px_90px_-45px_rgba(18,18,18,.35)] lg:grid-cols-[.95fr_1.05fr]">
        <section className="relative hidden overflow-hidden bg-[#171715] p-12 text-[#faf9f6] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -bottom-40 -left-36 size-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,78,31,.32),transparent_68%)]" />
          <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3" aria-label="Orung home">
            <img className="size-11 rounded-full bg-white object-contain p-1" src={orungLogo} alt="" />
            <span className="font-display text-xl font-black tracking-[.15em]">ORUNG</span>
          </Link>
          <div className="relative z-10 max-w-lg">
            <p className="mb-5 font-mono text-[10px] tracking-[.2em] text-[#ff7952]">FIND YOUR NEXT FAVORITE</p>
            <h1 className="font-display text-6xl font-black uppercase leading-[.9]">Make room for your next thing.</h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Join Orung for thoughtful edits, new-season finds and a shopping experience made around you.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-5 text-xs text-white/55">
            <ShieldCheck size={17} className="text-[#ff7952]" />
            Your account starts with a quick email verification.
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Link to="/" className="mb-9 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#ff4e1f]">
              <ArrowLeft size={16} /> Back to Orung
            </Link>

            {verificationStep ? (
              <>
                <p className="mb-3 font-mono text-[10px] font-semibold tracking-[.18em] text-[#ff4e1f]">ONE LAST STEP</p>
                <h2 className="text-4xl font-black tracking-tight text-[#171715]">Verify your email</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  We sent a six-digit code to <span className="font-semibold text-slate-700">{verificationEmail}</span>. Enter it below to activate your account.
                </p>
                <form onSubmit={handleVerify} className="mt-8 space-y-5">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Verification code</span>
                    <input
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center font-mono text-2xl tracking-[.5em] outline-none transition placeholder:text-slate-300 focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={submitting || otp.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171715] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Verifying..." : "Verify and continue"} {!submitting && <ArrowRight size={17} />}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationStep(false);
                    setOtp("");
                  }}
                  className="mt-5 w-full text-center text-sm font-semibold text-slate-500 hover:text-[#d9461d]"
                >
                  Use a different email
                </button>
              </>
            ) : (
              <>
                <p className="mb-3 font-mono text-[10px] font-semibold tracking-[.18em] text-[#ff4e1f]">CREATE YOUR ACCOUNT</p>
                <h2 className="text-4xl font-black tracking-tight text-[#171715]">Join Orung</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">A few details, then you’re all set.</p>

                <form onSubmit={handleSignup} className="mt-8 space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Full name</span>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#ff4e1f] focus:bg-white focus:ring-4 focus:ring-[#ff4e1f]/10"
                      required
                    />
                  </label>
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
                        autoComplete="new-password"
                        minLength={8}
                        value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        placeholder="At least 8 characters"
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
                    <span className="block text-xs text-slate-400">Use at least 8 characters.</span>
                  </label>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171715] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#ff4e1f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Creating account..." : "Create account"} {!submitting && <ArrowRight size={17} />}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400">
                  <span className="h-px flex-1 bg-slate-200" /> Or sign up with <span className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google sign-up failed. Please try again.")} />
                </div>
                <p className="mt-8 text-center text-sm text-slate-500">
                  Already have an account? <NavLink to="/login" className="font-bold text-[#d9461d] hover:underline">Sign in</NavLink>
                </p>
              </>
            )}
          </motion.div>
        </section>
      </div>
    </main>
  );
};

export default Signup;
