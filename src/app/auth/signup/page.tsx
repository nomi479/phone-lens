"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password !== retypePassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password, retypePassword, phone }),
    });

    setIsLoading(false);
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Unable to create your account.");
      return;
    }

    router.push("/auth/signin");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .signup-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 5rem);
          display: flex;
          align-items: stretch;
          background: #0a0a0f;
          overflow: hidden;
          position: relative;
        }

        /* ── left panel ── */
        .signup-panel-left {
          display: none;
          position: relative;
          overflow: hidden;
          background: #0a0a0f;
        }
        @media (min-width: 768px) {
          .signup-panel-left { display: flex; flex-direction: column; justify-content: space-between; flex: 0 0 42%; padding: 3.5rem; }
        }

        .panel-noise {
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        .panel-glow-1 {
          position: absolute; width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%);
          top: -80px; left: -100px; pointer-events: none;
        }
        .panel-glow-2 {
          position: absolute; width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%);
          bottom: 60px; right: -60px; pointer-events: none;
        }

        .panel-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.4rem;
          color: #fff;
          letter-spacing: -0.02em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
        }
        .panel-logo-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          flex-shrink: 0;
        }

        .panel-hero {
          position: relative;
        }
        .panel-tagline {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 2.6rem;
          line-height: 1.12;
          letter-spacing: -0.04em;
          color: #fff;
          margin: 0 0 1.2rem;
        }
        .panel-tagline span {
          background: linear-gradient(90deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .panel-sub {
          font-size: 0.95rem;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 320px;
        }

        .panel-card {
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 1.4rem 1.6rem;
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
        }
        .panel-card-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.5rem;
        }
        .panel-card-text {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.65;
        }
        .panel-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 1rem;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(165,168,255,0.9);
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        /* ── right panel (form) ── */
        .signup-panel-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: #0f0f17;
          position: relative;
          overflow-y: auto;
        }

        .form-grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse at 60% 30%, black 20%, transparent 75%);
        }

        .form-container {
          width: 100%;
          max-width: 440px;
          position: relative;
        }

        .form-header { margin-bottom: 2.2rem; }
        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #fff;
          margin: 0 0 0.6rem;
        }
        .form-subtitle {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.4);
        }
        .form-subtitle a {
          color: #818cf8;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .form-subtitle a:hover { color: #a5b4fc; }

        /* inputs */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; }

        .field { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
        }
        .field-input {
          width: 100%;
          box-sizing: border-box;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          color: #fff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .form-section {
          margin-top: 1.1rem;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.4rem;
          background: rgba(255,255,255,0.025);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.2rem 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-label {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          white-space: nowrap;
        }

        /* error */
        .form-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.9rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          font-size: 0.85rem;
          color: #fca5a5;
        }
        .error-icon { flex-shrink: 0; width: 16px; height: 16px; }

        /* submit */
        .submit-btn {
          margin-top: 1.4rem;
          width: 100%;
          padding: 0.9rem 1.5rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          box-shadow: 0 4px 20px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled {
          cursor: not-allowed;
          background: rgba(255,255,255,0.1);
          box-shadow: none;
        }

        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <main className="signup-root">
        {/* ── Left Panel ── */}
        <div className="signup-panel-left">
          <div className="panel-noise" />
          <div className="panel-glow-1" />
          <div className="panel-glow-2" />

          <div className="panel-logo">
            <span className="panel-logo-dot" />
            PhoneLenz
          </div>

          <div className="panel-hero">
            <h1 className="panel-tagline">
              Buy, sell &<br /><span>repair smarter.</span>
            </h1>
            <p className="panel-sub">
              One account for faster purchases, marketplace listings, and real-time repair tracking.
            </p>
          </div>

          <div className="panel-card">
            <p className="panel-card-label">Secure signup</p>
            <p className="panel-card-text">
              Your account is protected with strong password hashing and email-based authentication.
            </p>
            <div className="panel-card-badge">
              <span className="badge-dot" />
              Protected with industry-standard encryption
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="signup-panel-right">
          <div className="form-grid-bg" />
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">Create account</h2>
              <p className="form-subtitle">
                Already have one?{" "}
                <Link href="/auth/signin">Sign in</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="field-row">
                <label className="field">
                  <span className="field-label">First Name</span>
                  <input
                    className="field-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="John"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Last Name</span>
                  <input
                    className="field-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Doe"
                  />
                </label>
              </div>

              {/* Contact + password section */}
              <div className="form-section">
                <label className="field">
                  <span className="field-label">Email</span>
                  <input
                    className="field-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Phone Number</span>
                  <input
                    className="field-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(123) 456-7890"
                  />
                </label>

                <div className="divider">
                  <span className="divider-line" />
                  <span className="divider-label">Password</span>
                  <span className="divider-line" />
                </div>

                <label className="field">
                  <span className="field-label">Password</span>
                  <input
                    className="field-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a strong password"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Confirm Password</span>
                  <input
                    className="field-input"
                    type="password"
                    value={retypePassword}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    required
                    placeholder="Repeat your password"
                  />
                </label>
              </div>

              {error && (
                <div className="form-error">
                  <svg className="error-icon" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5" />
                    <path d="M8 5v3.5M8 10.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Creating account…
                  </>
                ) : (
                  "Create account →"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}