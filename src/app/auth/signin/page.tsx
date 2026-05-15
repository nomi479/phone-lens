"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (response?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *,
        *::before,
        *::after { box-sizing: border-box; }

        .si-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 5rem);
          display: flex;
          align-items: stretch;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* ── LEFT PANEL ── */
        .si-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: #0a0a0f;
          flex-direction: column;
          justify-content: space-between;
          flex: 0 0 44%;
          padding: 3.5rem;
        }
        @media (min-width: 768px) { .si-left { display: flex; } }

        .si-noise {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .si-glow-a {
          position: absolute; width: 480px; height: 480px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          top: -100px; right: -80px; pointer-events: none;
        }
        .si-glow-b {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 70%);
          bottom: 80px; left: -60px; pointer-events: none;
        }

        .si-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.35rem;
          color: #fff; letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 0.5rem;
          position: relative; z-index: 1;
        }
        .si-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          flex-shrink: 0;
        }

        .si-hero { position: relative; z-index: 1; }

        .si-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(165,168,255,0.85);
          margin-bottom: 1.25rem;
        }
        .eyebrow-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .si-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 2.8rem; line-height: 1.1;
          letter-spacing: -0.045em; color: #fff;
          margin: 0 0 1.1rem;
        }
        .si-title-accent {
          background: linear-gradient(90deg, #818cf8 0%, #22d3ee 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .si-desc {
          font-size: 0.92rem; font-weight: 300;
          color: rgba(255,255,255,0.45); line-height: 1.75;
          max-width: 310px;
        }

        .si-features { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 2rem; }
        .si-feature {
          display: flex; align-items: center; gap: 0.75rem;
          font-size: 0.85rem; color: rgba(255,255,255,0.45);
        }
        .si-feature-icon {
          width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.2);
          display: flex; align-items: center; justify-content: center;
        }
        .si-feature-icon svg { width: 13px; height: 13px; }

        .si-bottom-card {
          position: relative; z-index: 1;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.35rem 1.5rem;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
        }
        .si-bottom-card-label {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          margin-bottom: 0.5rem;
        }
        .si-bottom-card-text {
          font-size: 0.875rem; color: rgba(255,255,255,0.45); line-height: 1.65;
        }

        /* ── RIGHT PANEL ── */
        .si-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 3rem 2rem; background: #0f0f17;
          position: relative; overflow-y: auto;
        }

        .si-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 40% 30%, black 15%, transparent 72%);
        }

        .si-form-wrap {
          width: 100%; max-width: 400px;
          position: relative; z-index: 1;
        }

        .si-form-header { margin-bottom: 2.2rem; }
        .si-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 700;
          letter-spacing: -0.04em; color: #fff;
          margin: 0 0 0.55rem;
        }
        .si-form-sub {
          font-size: 0.875rem; color: rgba(255,255,255,0.38);
        }
        .si-form-sub a {
          color: #818cf8; text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .si-form-sub a:hover { color: #a5b4fc; }

        /* form card */
        .si-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.5rem;
          background: rgba(255,255,255,0.025);
          display: flex; flex-direction: column; gap: 1.1rem;
        }

        .si-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .si-label {
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }
        .si-input-wrap { position: relative; }
        .si-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 0.8rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          appearance: none;
        }
        .si-input.has-toggle { padding-right: 3rem; }
        .si-input::placeholder { color: rgba(255,255,255,0.2); }
        .si-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .si-toggle-btn {
          position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 0;
          color: rgba(255,255,255,0.3); transition: color 0.2s;
          display: flex; align-items: center;
        }
        .si-toggle-btn:hover { color: rgba(255,255,255,0.65); }
        .si-toggle-btn svg { width: 17px; height: 17px; }

        /* forgot */
        .si-forgot {
          display: flex; justify-content: flex-end; margin-top: -0.4rem;
        }
        .si-forgot a {
          font-size: 0.8rem; color: rgba(255,255,255,0.3);
          text-decoration: none; transition: color 0.2s;
        }
        .si-forgot a:hover { color: #818cf8; }

        /* error */
        .si-error {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0.9rem; padding: 0.75rem 1rem;
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          font-size: 0.85rem; color: #fca5a5;
        }
        .si-error svg { flex-shrink: 0; width: 15px; height: 15px; }

        /* submit */
        .si-submit {
          margin-top: 1.3rem;
          width: 100%; padding: 0.9rem 1.5rem;
          border-radius: 10px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          letter-spacing: 0.02em; color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          box-shadow: 0 4px 22px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
        }
        .si-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%);
          pointer-events: none;
        }
        .si-submit:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 7px 28px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .si-submit:active:not(:disabled) { transform: translateY(0); }
        .si-submit:disabled {
          cursor: not-allowed;
          background: rgba(255,255,255,0.08); box-shadow: none;
        }

        .si-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .si-divider {
          display: flex; align-items: center; gap: 0.75rem; margin-top: 1.2rem;
        }
        .si-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .si-divider-text {
          font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.2); white-space: nowrap;
        }

        .si-signup-link {
          margin-top: 1.25rem; text-align: center;
          font-size: 0.85rem; color: rgba(255,255,255,0.3);
        }
        .si-signup-link a {
          color: #818cf8; font-weight: 500; text-decoration: none; transition: color 0.2s;
        }
        .si-signup-link a:hover { color: #a5b4fc; }

        /* responsive tweaks */
        @media (max-width: 767px) {
          .si-form-title { font-size: 1.65rem; }
          .si-right { padding: 2rem 1.25rem; }
        }
      `}</style>

      <main className="si-root" aria-label="Sign in to PhoneLenz">
        {/* ── Left panel ── */}
        <aside className="si-left" aria-hidden="true">
          <div className="si-noise" />
          <div className="si-glow-a" />
          <div className="si-glow-b" />

          {/* Logo */}
          <div className="si-logo">
            <span className="si-logo-dot" />
            PhoneLenz
          </div>

          {/* Hero */}
          <div className="si-hero">
            <div className="si-eyebrow">
              <span className="eyebrow-pulse" />
              Secure Login
            </div>
            <h1 className="si-title">
              Welcome<br />
              <span className="si-title-accent">back.</span>
            </h1>
            <p className="si-desc">
              Access your profile, manage orders, track repairs, and pick up right where you left off.
            </p>

            <div className="si-features">
              {[
                {
                  label: "Manage listings & purchases",
                  icon: (
                    <svg viewBox="0 0 14 14" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="1" width="12" height="12" rx="2"/>
                      <path d="M4 7h6M4 9.5h4"/>
                    </svg>
                  ),
                },
                {
                  label: "Real-time repair tracking",
                  icon: (
                    <svg viewBox="0 0 14 14" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="7" cy="7" r="6"/>
                      <path d="M7 4v3l2 2"/>
                    </svg>
                  ),
                },
                {
                  label: "Saved checkout details",
                  icon: (
                    <svg viewBox="0 0 14 14" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3.5" width="12" height="8" rx="1.5"/>
                      <path d="M1 6.5h12"/>
                    </svg>
                  ),
                },
              ].map(({ label, icon }) => (
                <div className="si-feature" key={label}>
                  <div className="si-feature-icon">{icon}</div>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom card */}
          <div className="si-bottom-card">
            <p className="si-bottom-card-label">Fast account access</p>
            <p className="si-bottom-card-text">
              Your session is encrypted and secured with industry-standard credential hashing.
            </p>
          </div>
        </aside>

        {/* ── Right panel (form) ── */}
        <section className="si-right">
          <div className="si-grid-bg" />

          <div className="si-form-wrap">
            <header className="si-form-header">
              <h2 className="si-form-title">Sign in</h2>
              <p className="si-form-sub">
                New to PhoneLenz?{" "}
                <Link href="/auth/signup">Create an account</Link>
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="si-card">
                {/* Email */}
                <div className="si-field">
                  <label htmlFor="email" className="si-label">Email</label>
                  <div className="si-input-wrap">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="si-input"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="si-field">
                  <label htmlFor="password" className="si-label">Password</label>
                  <div className="si-input-wrap">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="si-input has-toggle"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="si-toggle-btn"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forgot password */}
              <div className="si-forgot">
                <Link href="/auth/forgot-password">Forgot password?</Link>
              </div>

              {/* Error */}
              {error && (
                <div className="si-error" role="alert">
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/>
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="si-submit"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="si-spinner" />
                    Signing in…
                  </>
                ) : (
                  "Sign in →"
                )}
              </button>

              <div className="si-divider">
                <span className="si-divider-line" />
                <span className="si-divider-text">or</span>
                <span className="si-divider-line" />
              </div>

              <p className="si-signup-link">
                Dont have an account? <Link href="/auth/signup">Sign up free</Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}