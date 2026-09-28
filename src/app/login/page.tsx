"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      const redirectPath = data?.redirect || "/";

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">

        {/* LEFT SIDE */}
        <section className="auth-brand-panel">
          <div className="brand-decoration brand-decoration-one" />
          <div className="brand-decoration brand-decoration-two" />

          <Link href="/" className="auth-logo">
            <span className="auth-logo-mark">S</span>
            <span>
              Skill<span>Class</span>
            </span>
          </Link>

          <div className="auth-brand-content">
            <div className="auth-small-badge">
              <GraduationCap size={16} />
              Modern Learning Platform
            </div>

            <h1>
              Learn.
              <br />
              Grow.
              <br />
              <span>Achieve.</span>
            </h1>

            <p>
              Connect with expert teachers, join live classes and discover
              quality digital learning resources — all in one place.
            </p>

            <div className="auth-benefits">
              <div>
                <span className="auth-benefit-icon">
                  <BookOpen size={19} />
                </span>
                <div>
                  <strong>Learn From Experts</strong>
                  <small>Structured live classes made for you.</small>
                </div>
              </div>

              <div>
                <span className="auth-benefit-icon">
                  <GraduationCap size={19} />
                </span>
                <div>
                  <strong>Build Your Skills</strong>
                  <small>Learn at your own pace and grow confidently.</small>
                </div>
              </div>

              <div>
                <span className="auth-benefit-icon">
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <strong>Simple & Secure</strong>
                  <small>A trusted platform for your learning journey.</small>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <span>SkillClass</span>
            <span>Learn • Teach • Grow</span>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-form-panel">
          <div className="auth-form-container">

            <div className="mobile-auth-logo">
              <span className="auth-logo-mark">S</span>
              <span>
                Skill<span>Class</span>
              </span>
            </div>

            <div className="auth-heading">
              <span className="auth-form-kicker">WELCOME BACK</span>

              <h2>Login to SkillClass</h2>

              <p>
                Continue your learning journey with SkillClass.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">

              <div className="auth-field">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="password">Password</label>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-register-text">
              Don&apos;t have an account?{" "}
              <Link href="/register">
                Create Account
                <ArrowRight size={15} />
              </Link>
            </p>

            <div className="auth-info-box">
              <ShieldCheck size={18} />

              <div>
                <strong>Account Information</strong>
                <p>
                  Student, Teacher and Seller can register themselves.
                  Admin access is managed by the owner.
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: #f5f7fb;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
        }

        .auth-shell {
          width: 100%;
          max-width: 1500px;
          min-height: calc(100vh - 48px);
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(480px, 0.92fr);
          box-shadow:
            0 25px 80px rgba(15, 23, 42, 0.12),
            0 5px 20px rgba(15, 23, 42, 0.05);
        }

        /* LEFT */

        .auth-brand-panel {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(139, 92, 246, 0.35),
              transparent 28%
            ),
            radial-gradient(
              circle at 10% 90%,
              rgba(79, 70, 229, 0.3),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #312e81 0%,
              #4f46e5 48%,
              #6d28d9 100%
            );
          color: #ffffff;
          padding: 52px 58px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .brand-decoration {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.13);
          pointer-events: none;
        }

        .brand-decoration-one {
          width: 430px;
          height: 430px;
          right: -230px;
          top: -190px;
        }

        .brand-decoration-two {
          width: 340px;
          height: 340px;
          left: -220px;
          bottom: -200px;
        }

        .auth-logo {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          width: fit-content;
          color: #ffffff;
          text-decoration: none;
          font-size: 25px;
          font-weight: 850;
          letter-spacing: -0.7px;
        }

        .auth-logo span:last-child span {
          color: #ddd6fe;
        }

        .auth-logo-mark {
          width: 46px;
          height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.24);
          font-size: 23px;
          font-weight: 900;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
        }

        .auth-brand-content {
          position: relative;
          z-index: 2;
          max-width: 650px;
          margin: auto 0;
          padding: 55px 0;
        }

        .auth-small-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.17);
          color: #ede9fe;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .auth-brand-content h1 {
          margin: 0;
          font-size: clamp(58px, 6vw, 92px);
          line-height: 0.93;
          letter-spacing: -5px;
          font-weight: 900;
        }

        .auth-brand-content h1 span {
          color: #ddd6fe;
        }

        .auth-brand-content > p {
          max-width: 580px;
          margin: 30px 0 0;
          color: rgba(255, 255, 255, 0.78);
          font-size: 18px;
          line-height: 1.75;
        }

        .auth-benefits {
          margin-top: 38px;
          display: grid;
          gap: 17px;
        }

        .auth-benefits > div {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .auth-benefit-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.13);
        }

        .auth-benefits strong {
          display: block;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .auth-benefits small {
          color: rgba(255, 255, 255, 0.64);
          font-size: 12px;
        }

        .auth-brand-footer {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          color: rgba(255, 255, 255, 0.52);
          font-size: 12px;
          font-weight: 600;
        }

        /* RIGHT */

        .auth-form-panel {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .auth-form-container {
          width: 100%;
          max-width: 490px;
        }

        .mobile-auth-logo {
          display: none;
        }

        .auth-heading {
          margin-bottom: 34px;
        }

        .auth-form-kicker {
          color: #5b4de8;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 1.6px;
        }

        .auth-heading h2 {
          margin: 9px 0 9px;
          color: #111827;
          font-size: 40px;
          line-height: 1.12;
          letter-spacing: -1.5px;
          font-weight: 850;
        }

        .auth-heading p {
          margin: 0;
          color: #64748b;
          font-size: 15px;
          line-height: 1.6;
        }

        .auth-form {
          display: grid;
          gap: 21px;
        }

        .auth-field {
          display: grid;
          gap: 8px;
        }

        .auth-field label {
          color: #1e293b;
          font-size: 13px;
          font-weight: 750;
        }

        .auth-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auth-field input {
          width: 100%;
          height: 56px;
          box-sizing: border-box;
          padding: 0 16px;
          border: 1px solid #dbe1ea;
          border-radius: 13px;
          outline: none;
          background: #fbfcfe;
          color: #111827;
          font-size: 15px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .auth-field input::placeholder {
          color: #94a3b8;
        }

        .auth-field input:focus {
          border-color: #6d5ce7;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(91, 77, 232, 0.1);
        }

        .auth-error {
          padding: 12px 14px;
          border-radius: 11px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          font-size: 13px;
          line-height: 1.5;
        }

        .auth-submit {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 13px;
          background: linear-gradient(135deg, #5b4de8, #7048d9);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(91, 77, 232, 0.22);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .auth-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(91, 77, 232, 0.28);
        }

        .auth-submit:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .auth-divider {
          position: relative;
          margin: 29px 0 22px;
          text-align: center;
        }

        .auth-divider::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: #e8ebf0;
        }

        .auth-divider span {
          position: relative;
          z-index: 1;
          padding: 0 12px;
          background: #ffffff;
          color: #94a3b8;
          font-size: 11px;
          font-weight: 750;
        }

        .auth-register-text {
          margin: 0;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        .auth-register-text a {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #5b4de8;
          text-decoration: none;
          font-weight: 800;
        }

        .auth-register-text a:hover {
          text-decoration: underline;
        }

        .auth-info-box {
          margin-top: 27px;
          padding: 15px;
          display: flex;
          gap: 11px;
          border: 1px solid #e7e9f2;
          border-radius: 13px;
          background: #fafaff;
          color: #64748b;
        }

        .auth-info-box > svg {
          flex: 0 0 auto;
          color: #5b4de8;
          margin-top: 1px;
        }

        .auth-info-box strong {
          display: block;
          color: #334155;
          font-size: 12px;
          margin-bottom: 4px;
        }

        .auth-info-box p {
          margin: 0;
          font-size: 11px;
          line-height: 1.55;
        }

        /* TABLET */

        @media (max-width: 1050px) {
          .auth-page {
            padding: 15px;
          }

          .auth-shell {
            grid-template-columns: 1fr 0.9fr;
          }

          .auth-brand-panel {
            padding: 40px;
          }

          .auth-form-panel {
            padding: 40px;
          }

          .auth-brand-content h1 {
            font-size: 64px;
          }
        }

        /* MOBILE */

        @media (max-width: 780px) {
          .auth-page {
            min-height: 100vh;
            padding: 0;
            background: #ffffff;
          }

          .auth-shell {
            min-height: 100vh;
            border-radius: 0;
            grid-template-columns: 1fr;
            box-shadow: none;
          }

          .auth-brand-panel {
            min-height: 330px;
            padding: 28px 25px;
          }

          .auth-brand-content {
            padding: 35px 0 15px;
          }

          .auth-brand-content h1 {
            font-size: 54px;
            letter-spacing: -3px;
          }

          .auth-brand-content > p {
            margin-top: 18px;
            font-size: 14px;
            line-height: 1.55;
          }

          .auth-benefits {
            display: none;
          }

          .auth-brand-footer {
            display: none;
          }

          .auth-form-panel {
            padding: 42px 25px 50px;
            align-items: flex-start;
          }

          .mobile-auth-logo {
            display: none;
          }

          .auth-heading h2 {
            font-size: 32px;
          }
        }

        @media (max-width: 430px) {
          .auth-brand-panel {
            min-height: 290px;
          }

          .auth-logo {
            font-size: 21px;
          }

          .auth-logo-mark {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .auth-brand-content h1 {
            font-size: 46px;
          }

          .auth-form-panel {
            padding: 35px 20px 40px;
          }

          .auth-heading {
            margin-bottom: 27px;
          }

          .auth-heading h2 {
            font-size: 29px;
          }
        }
      `}</style>
    </main>
  );
}