import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { API_BASE } from '@/lib/api';

export default function Signup() {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const resp = await api.post('/auth/signup', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      const success = await login(formData.email, formData.password as string);
      if (success) {
        navigate('/', { replace: true });
      } else {
        setError('Signup succeeded but automatic login failed. Please sign in.');
      }
    } catch (err: unknown) {
      let msg = 'An error occurred during signup. Please try again.'
      if (err && typeof err === 'object') {
        const e = err as { response?: { data?: { msg?: unknown } }; message?: unknown }
        const respMsg = e.response?.data?.msg
        const message = e.message
        if (typeof respMsg === 'string') msg = respMsg
        else if (typeof message === 'string') msg = message
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-14 h-14 mb-8">
            <div className="absolute inset-0 border border-[#c9a961]/20 animate-ping" />
            <div className="absolute inset-3 border border-[#c9a961]/40 animate-pulse" />
          </div>
          <p className="text-white/25 text-[10px] tracking-[0.5em] uppercase font-light">Loading</p>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#292524] flex">
      {/* ── LEFT: HERO IMAGE ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.08] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xLmpwZyIsImlhdCI6MTc2MzYyOTcwNCwiZXhwIjoxNzk1MTY1NzA0fQ.Ihw6Bmfj9cx-SsrMzKzH0bt-4Qej5J0sfxw-JgKWllA')`
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#292524]/30 to-[#292524]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#292524]/60 to-transparent" />

        {/* Branding overlay */}
        <div className="relative z-10 flex flex-col justify-end p-16 pb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#c9a961]" />
            <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">The Bush Collection</p>
          </div>
          <h2 className="text-4xl xl:text-5xl font-extralight text-white/90 leading-[1.1] mb-4">
            Begin Your<br />
            <span className="italic text-[#c9a961]/80">Safari Journey</span>
          </h2>
          <p className="text-white/35 text-sm font-light leading-relaxed max-w-sm">
            Create an account to book handpicked lodges, camps &amp; retreats across East Africa.
          </p>
        </div>

        {/* Vertical text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2">
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/10 font-light [writing-mode:vertical-lr] rotate-180">
            Est. 1983 — Curated Safari Experiences
          </span>
        </div>
      </div>

      {/* ── RIGHT: FORM ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-[#c9a961]" />
              <p className="text-[#c9a961] text-[10px] tracking-[0.4em] uppercase font-medium">The Bush Collection</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extralight text-white/90 mb-3">
              Create Account
            </h1>
            <p className="text-white/30 text-sm font-light">
              Join us to book safaris and share your experiences
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 border border-red-500/20 bg-red-500/5 px-5 py-4"
            >
              <p className="text-red-400/80 text-sm font-light">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-white/40 text-[10px] tracking-[0.2em] uppercase font-light mb-3">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full h-13 px-5 bg-transparent text-white/80 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#c9a961]/40 placeholder:text-white/15 text-sm font-light tracking-wide outline-none transition-all duration-300"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white/40 text-[10px] tracking-[0.2em] uppercase font-light mb-3">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full h-13 px-5 bg-transparent text-white/80 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#c9a961]/40 placeholder:text-white/15 text-sm font-light tracking-wide outline-none transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-white/40 text-[10px] tracking-[0.2em] uppercase font-light mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full h-13 px-5 pr-12 bg-transparent text-white/80 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#c9a961]/40 placeholder:text-white/15 text-sm font-light tracking-wide outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-white/40 text-[10px] tracking-[0.2em] uppercase font-light mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full h-13 px-5 pr-12 bg-transparent text-white/80 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#c9a961]/40 placeholder:text-white/15 text-sm font-light tracking-wide outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-2"
            >
              {isLoading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
            <span className="text-white/15 text-[9px] tracking-[0.3em] uppercase font-light">or continue with</span>
            <div className="flex-1 h-[1px] bg-white/[0.06]" />
          </div>

          {/* Google OAuth Button */}
          <a
            href={`${API_BASE}auth/google`}
            className="w-full h-14 border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] text-white/60 hover:text-white/80 text-xs tracking-[0.15em] uppercase font-light transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google</span>
          </a>

          {/* Login link */}
          <p className="text-center text-white/30 text-sm font-light mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#c9a961] hover:text-[#c9a961]/70 font-medium transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
