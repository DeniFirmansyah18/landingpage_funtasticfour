"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/admin");
    } catch {
      setError("Email atau password tidak valid. Silakan coba kembali.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 grid-bg-light opacity-60 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full mb-4 shadow-md">
            <span className="font-display tracking-wider text-sm">F4</span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              CMS GATEWAY
            </span>
          </div>
          <h1 className="font-display text-4xl uppercase tracking-tight text-black">
            ADMIN CONSOLE
          </h1>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
            // AUTHORIZED PERSONNEL ONLY
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0e0e0e] text-white rounded-3xl p-8 sm:p-10 border border-neutral-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6 font-mono text-[10px] text-neutral-400">
            <span>SESSION PROTOCOL: TLS_AUTH</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl mb-6 text-xs font-mono bg-red-950/40 border border-red-800/60 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@funtasticfour.id"
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl pl-10 pr-4 py-3.5 text-xs font-mono text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                SECURITY KEY / PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#050505] border border-neutral-800 rounded-xl pl-10 pr-11 py-3.5 text-xs font-mono text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-brutalist-white w-full justify-center py-4 text-xs font-mono font-bold tracking-widest mt-4 disabled:opacity-50"
            >
              {submitting ? (
                "AUTHENTICATING..."
              ) : (
                <>
                  SIGN IN TO CONSOLE
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
