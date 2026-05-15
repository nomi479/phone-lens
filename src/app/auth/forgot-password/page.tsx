"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRetype, setShowRetype] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password || !retypePassword) {
      setError("Please complete every field.");
      return;
    }

    if (password !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, retypePassword }),
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to reset your password.");
      return;
    }

    setSuccess("Password updated successfully. Redirecting you to sign in…");
    setEmail("");
    setPassword("");
    setRetypePassword("");

    window.setTimeout(() => router.push("/auth/signin"), 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .fp-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 5rem);
          display: flex;
          align-items: stretch;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* ── LEFT PANEL ── */
        .fp-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: #0a0a0f;
          flex-direction: column;
          justify-content: space-between;
          flex: 0 0 44%;
          padding: 3.5rem;
        }
        @media (min-width: 768px) { .fp-left { display: flex; } }

        .fp-noise {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .fp-glow-a {
          position: absolute; width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
          top: -80px; left: -100px; pointer-events: none;
        }
        .fp-glow-b {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 70%);
          bottom: 60px; right: -50px; pointer-events: none;
        }

        /* Lock illustration */
        .fp-lock-wrap {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center;
          width: 72px; height: 72px; border-radius: 20px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          margin-bottom: 2.2rem;
        }
        .fp-lock-wrap svg { width: 34px; height: 34px; }

        .fp-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.35rem;
          color: #fff; letter-spacing: -0.02em;
          display: flex; align-items: center; gap: 0.5rem;
          position: relative; z-index: 1;
        }
        .fp-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          flex-shrink: 0;
        }

        .fp-hero { position: relative; z-index: 1; }

        .fp-eyebrow {
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
        .fp-eyebrow-pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
          animation: fp-pulse 2s ease-in-out infinite;
        }
        @keyframes fp-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .fp-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 2.75rem; line-height: 1.1;
          letter-spacing: -0.045em; color: #fff;
          margin: 0 0 1.1rem;
        }
        .fp-title-accent {
          background: linear-gradient(90deg, #818cf8 0%, #22d3ee 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .fp-desc {
          font-size: 0.92rem; font-weight: 300;
          color: rgba(255,255,255,0.42); line-height: 1.75;
          max-width: 300px;
        }

        /* Steps */
        .fp-steps {
          display: flex; flex-direction: column; gap: 0; margin-top: 2.2rem;
          position: relative;
        }
        .fp-step {
          display: flex; align-items: flex-start; gap: 0.9rem;
          padding-bottom: 1.4rem; position: relative;
        }
        .fp-step:last-child { padding-bottom: 0; }
        .fp-step-line {
          position: absolute; left: 13px; top: 28px;
          width: 1px; bottom: 0;
          background: linear-gradient(to bottom, rgba(99,102,241,0.3), transparent);
        }
        .fp-step:last-child .fp-step-line { display: none; }
        .fp-step-num {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 0.7rem; font-weight: 700;
          color: #818cf8; margin-top: 1px;
        }
        .fp-step-text { font-size: 0.85rem; color: rgba(255,255,255,0.42); line-height: 1.6; padding-top: 0.25rem; }
        .fp-step-text strong { color: rgba(255,255,255,0.65); font-weight: 500; }

        .fp-bottom-card {
          position: relative; z-index: 1;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.35rem 1.5rem;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
        }
        .fp-bottom-card-label {
          font-size: 0.65rem; font-weight: 600; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(255,255,255,0.28);
          margin-bottom: 0.5rem;
        }
        .fp-bottom-card-text {
          font-size: 0.875rem; color: rgba(255,255,255,0.42); line-height: 1.65;
        }

        /* ── RIGHT PANEL ── */
        .fp-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 3rem 2rem; background: #0f0f17;
          position: relative; overflow-y: auto;
        }

        .fp-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 40% 30%, black 15%, transparent 72%);
        }

        .fp-form-wrap {
          width: 100%; max-width: 420px;
          position: relative; z-index: 1;
        }

        .fp-form-header { margin-bottom: 2rem; }
        .fp-form-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem; font-weight: 700;
          letter-spacing: -0.04em; color: #fff;
          margin: 0 0 0.55rem;
        }
        .fp-form-sub {
          font-size: 0.875rem; color: rgba(255,255,255,0.38);
        }
        .fp-form-sub a {
          color: #818cf8; text-decoration: none;
          font-weight: 500; transition: color 0.2s;
        }
        .fp-form-sub a:hover { color: #a5b4fc; }

        /* Progress bar shown when success */
        .fp-progress-wrap {
          height: 3px; border-radius: 999px;
          background: rgba(255,255,255,0.07);
          margin-bottom: 1.4rem; overflow: hidden;
        }
        .fp-progress-bar {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          animation: fp-progress 1.5s ease forwards;
        }
        @keyframes fp-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* card */
        .fp-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.5rem;
          background: rgba(255,255,255,0.025);
          display: flex; flex-direction: column; gap: 1.1rem;
        }

        .fp-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .fp-label {
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }
        .fp-input-wrap { position: relative; }
        .fp-input {
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
        .fp-input.has-toggle { padding-right: 3rem; }
        .fp-input::placeholder { color: rgba(255,255,255,0.2); }
        .fp-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        /* divider */
        .fp-divider {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .fp-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .fp-divider-text {
          font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.2); white-space: nowrap;
        }

        .fp-toggle-btn {
          position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; padding: 0;
          color: rgba(255,255,255,0.28); transition: color 0.2s;
          display: flex; align-items: center;
        }
        .fp-toggle-btn:hover { color: rgba(255,255,255,0.6); }
        .fp-toggle-btn svg { width: 17px; height: 17px; }

        /* feedback */
        .fp-error {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0.9rem; padding: 0.75rem 1rem;
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          font-size: 0.85rem; color: #fca5a5;
        }
        .fp-error svg { flex-shrink: 0; width: 15px; height: 15px; }

        .fp-success {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0.9rem; padding: 0.75rem 1rem;
          border-radius: 10px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          font-size: 0.85rem; color: #86efac;
        }
        .fp-success svg { flex-shrink: 0; width: 15px; height: 15px; }

        /* submit */
        .fp-submit {
          margin-top: 1.3rem; width: 100%;
          padding: 0.9rem 1.5rem;
          border-radius: 10px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          letter-spacing: 0.02em; color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          box-shadow: 0 4px 22px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;
        }
        .fp-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%);
          pointer-events: none;
        }
        .fp-submit:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 7px 28px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .fp-submit:active:not(:disabled) { transform: translateY(0); }
        .fp-submit:disabled {
          cursor: not-allowed;
          background: rgba(255,255,255,0.08); box-shadow: none;
        }

        .fp-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff; border-radius: 50%;
          animation: fp-spin 0.7s linear infinite;
        }
        @keyframes fp-spin { to { transform: rotate(360deg); } }

        .fp-footer-links {
          margin-top: 1.4rem; text-align: center;
          font-size: 0.85rem; color: rgba(255,255,255,0.28);
        }
        .fp-footer-links a {
          color: #818cf8; font-weight: 500; text-decoration: none; transition: color 0.2s;
        }
        .fp-footer-links a:hover { color: #a5b4fc; }
        .fp-footer-sep { margin: 0 0.5rem; opacity: 0.4; }

        @media (max-width: 767px) {
          .fp-form-title { font-size: 1.65rem; }
          .fp-right { padding: 2rem 1.25rem; }
          .fp-title { font-size: 2.1rem; }
        }
      `}</style>

      <main className="fp-root" aria-label="Reset your PhoneLenz password">

        {/* ── LEFT PANEL ── */}
        <aside className="fp-left" aria-hidden="true">
          <div className="fp-noise" />
          <div className="fp-glow-a" />
          <div className="fp-glow-b" />

          {/* Logo */}
          <div className="fp-logo">
            <span className="fp-logo-dot" />
            PhoneLenz
          </div>

          {/* Hero */}
          <div className="fp-hero">
            <div className="fp-lock-wrap">
              <svg viewBox="0 0 34 34" fill="none" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="7" y="15" width="20" height="14" rx="3"/>
                <path d="M11 15v-4a6 6 0 0 1 12 0v4"/>
                <circle cx="17" cy="22" r="1.5" fill="#818cf8" stroke="none"/>
                <line x1="17" y1="23.5" x2="17" y2="26"/>
              </svg>
            </div>

            <div className="fp-eyebrow">
              <span className="fp-eyebrow-pulse" />
              Password Reset
            </div>

            <h1 className="fp-title">
              Locked<br />
              <span className="fp-title-accent">out? No worries.</span>
            </h1>
            <p className="fp-desc">
              Enter your account email and set a new password. You will be signed back in within seconds.
            </p>

            {/* Steps */}
            <div className="fp-steps">
              {[
                { n: "1", title: "Enter your email", body: "The address linked to your PhoneLenz account." },
                { n: "2", title: "Set a new password", body: "Choose something strong and unique." },
                { n: "3", title: "Sign in instantly", body: "You'll be redirected automatically on success." },
              ].map(({ n, title, body }) => (
                <div className="fp-step" key={n}>
                  <div className="fp-step-line" />
                  <div className="fp-step-num">{n}</div>
                  <p className="fp-step-text">
                    <strong>{title} — </strong>{body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom card */}
          <div className="fp-bottom-card">
            <p className="fp-bottom-card-label">Quick reset</p>
            <p className="fp-bottom-card-text">
              If your email exists in our system, your password is updated immediately and your new credentials work right away.
            </p>
          </div>
        </aside>

        {/* ── RIGHT PANEL ── */}
        <section className="fp-right">
          <div className="fp-grid-bg" />

          <div className="fp-form-wrap">
            <header className="fp-form-header">
              <h2 className="fp-form-title">Reset password</h2>
              <p className="fp-form-sub">
                Remembered it?{" "}
                <Link href="/auth/signin">Sign in instead</Link>
              </p>
            </header>

            {/* Progress bar on success */}
            {success && (
              <div className="fp-progress-wrap" role="progressbar" aria-label="Redirecting…">
                <div className="fp-progress-bar" />
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="fp-card">

                {/* Email */}
                <div className="fp-field">
                  <label htmlFor="email" className="fp-label">Email address</label>
                  <div className="fp-input-wrap">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="fp-input"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="fp-divider">
                  <span className="fp-divider-line" />
                  <span className="fp-divider-text">New password</span>
                  <span className="fp-divider-line" />
                </div>

                {/* New password */}
                <div className="fp-field">
                  <label htmlFor="password" className="fp-label">New Password</label>
                  <div className="fp-input-wrap">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="fp-input has-toggle"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="fp-toggle-btn"
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

                {/* Confirm password */}
                <div className="fp-field">
                  <label htmlFor="retypePassword" className="fp-label">Confirm Password</label>
                  <div className="fp-input-wrap">
                    <input
                      id="retypePassword"
                      name="retypePassword"
                      type={showRetype ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={retypePassword}
                      onChange={(e) => setRetypePassword(e.target.value)}
                      className="fp-input has-toggle"
                      placeholder="Repeat your new password"
                    />
                    <button
                      type="button"
                      className="fp-toggle-btn"
                      aria-label={showRetype ? "Hide confirm password" : "Show confirm password"}
                      onClick={() => setShowRetype((v) => !v)}
                    >
                      {showRetype ? (
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

              {/* Error */}
              {error && (
                <div className="fp-error" role="alert">
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/>
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="fp-success" role="status">
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#4ade80" strokeWidth="1.5"/>
                    <path d="M5 8l2 2 4-4" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !!success}
                className="fp-submit"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="fp-spinner" />
                    Resetting password…
                  </>
                ) : success ? (
                  "Redirecting…"
                ) : (
                  "Reset password →"
                )}
              </button>
            </form>

            {/* Footer links */}
            <p className="fp-footer-links">
              <Link href="/auth/signin">Sign in</Link>
              <span className="fp-footer-sep">·</span>
              <Link href="/auth/signup">Create account</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}