"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";

type Role = "STUDENT" | "TEACHER" | "SELLER";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "STUDENT" as Role,
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function changeField(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error || "Registration failed. Please try again."
        );
        return;
      }

      const redirectPaths: Record<Role, string> = {
        STUDENT: "/dashboard/student",
        TEACHER: "/dashboard/teacher",
        SELLER: "/dashboard/seller",
      };

      router.push(
        data?.redirectTo || redirectPaths[form.role]
      );

      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <div className="register-shell">

        {/* LEFT BRAND PANEL */}
        <section className="register-brand">

          <div className="brand-circle circle-one" />
          <div className="brand-circle circle-two" />

          <Link href="/" className="register-logo">
            <span className="register-logo-mark">S</span>
            <span>
              Skill<span>Class</span>
            </span>
          </Link>

          <div className="register-brand-content">

            <div className="register-badge">
              <SparkleIcon />
              JOIN SKILLCLASS
            </div>

            <h1>
              Start Your
              <br />
              <span>Learning</span>
              <br />
              Journey.
            </h1>

            <p>
              Create your SkillClass account and unlock a
              smarter way to learn, teach and share knowledge.
            </p>

            <div className="register-points">

              <div>
                <span>
                  <GraduationCap size={19} />
                </span>
                <div>
                  <strong>Learn</strong>
                  <small>Join live classes from teachers.</small>
                </div>
              </div>

              <div>
                <span>
                  <Users size={19} />
                </span>
                <div>
                  <strong>Teach</strong>
                  <small>Create classes and connect with students.</small>
                </div>
              </div>

              <div>
                <span>
                  <BookOpen size={19} />
                </span>
                <div>
                  <strong>Share Knowledge</strong>
                  <small>Sell useful digital PDF resources.</small>
                </div>
              </div>

            </div>
          </div>

          <div className="register-footer">
            <span>SkillClass</span>
            <span>Learn • Teach • Grow</span>
          </div>

        </section>

        {/* RIGHT FORM */}
        <section className="register-form-panel">

          <div className="register-form-container">

            <div className="register-heading">
              <span className="form-kicker">
                CREATE YOUR ACCOUNT
              </span>

              <h2>Join SkillClass</h2>

              <p>
                Choose your role and create your account.
              </p>
            </div>

            <form onSubmit={submit}>

              {/* ROLE */}
              <div className="field-group">

                <label>Choose Account Type</label>

                <div className="role-grid">

                  <button
                    type="button"
                    onClick={() =>
                      changeField("role", "STUDENT")
                    }
                    className={`role-card ${
                      form.role === "STUDENT"
                        ? "role-active"
                        : ""
                    }`}
                  >
                    <span className="role-icon">
                      <GraduationCap size={21} />
                    </span>

                    <strong>Student</strong>
                    <small>Learn & grow</small>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeField("role", "TEACHER")
                    }
                    className={`role-card ${
                      form.role === "TEACHER"
                        ? "role-active"
                        : ""
                    }`}
                  >
                    <span className="role-icon">
                      <Users size={21} />
                    </span>

                    <strong>Teacher</strong>
                    <small>Teach live classes</small>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      changeField("role", "SELLER")
                    }
                    className={`role-card ${
                      form.role === "SELLER"
                        ? "role-active"
                        : ""
                    }`}
                  >
                    <span className="role-icon">
                      <BookOpen size={21} />
                    </span>

                    <strong>Seller</strong>
                    <small>Sell PDF resources</small>
                  </button>

                </div>

                <small className="selected-role">
                  Selected:{" "}
                  <strong>
                    {form.role === "STUDENT"
                      ? "Student"
                      : form.role === "TEACHER"
                      ? "Teacher"
                      : "Seller"}
                  </strong>
                </small>

              </div>

              {/* NAME */}
              <div className="field-group">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    changeField("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="field-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  value={form.email}
                  onChange={(e) =>
                    changeField("email", e.target.value)
                  }
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {/* MOBILE */}
              <div className="field-group">
                <label htmlFor="mobile">
                  Mobile Number
                  <span className="optional">Optional</span>
                </label>

                <input
                  id="mobile"
                  value={form.mobile}
                  onChange={(e) =>
                    changeField(
                      "mobile",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                />
              </div>

              {/* PASSWORD */}
              <div className="field-group">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  value={form.password}
                  onChange={(e) =>
                    changeField("password", e.target.value)
                  }
                  type="password"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  autoComplete="new-password"
                  required
                />

                <small className="password-hint">
                  Use at least 8 characters for your password.
                </small>
              </div>

              {/* ERROR */}
              {error && (
                <div className="register-error">
                  {error}
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}

                {!loading && <ArrowRight size={19} />}
              </button>

            </form>

            <div className="register-divider">
              <span>OR</span>
            </div>

            <p className="login-text">
              Already have an account?{" "}
              <Link href="/login">
                Login
                <ArrowRight size={15} />
              </Link>
            </p>

            <div className="admin-note">
              <ShieldCheck size={18} />

              <div>
                <strong>Admin Access</strong>
                <p>
                  Admin accounts are managed directly by
                  the SkillClass owner.
                </p>
              </div>
            </div>

          </div>

        </section>

      </div>

      <style jsx>{`

        .register-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 24px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: stretch;
        }

        .register-shell {
          width: 100%;
          max-width: 1500px;
          min-height: calc(100vh - 48px);
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;

          display: grid;
          grid-template-columns:
            minmax(0, 1.05fr)
            minmax(520px, 0.95fr);

          box-shadow:
            0 25px 80px rgba(15, 23, 42, 0.12),
            0 5px 20px rgba(15, 23, 42, 0.05);
        }

        /* LEFT */

        .register-brand {
          position: relative;
          overflow: hidden;

          padding: 50px 58px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 90% 12%,
              rgba(139, 92, 246, 0.35),
              transparent 28%
            ),
            radial-gradient(
              circle at 5% 92%,
              rgba(79, 70, 229, 0.28),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #312e81 0%,
              #4f46e5 48%,
              #6d28d9 100%
            );
        }

        .brand-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.13);
          pointer-events: none;
        }

        .circle-one {
          width: 450px;
          height: 450px;
          right: -240px;
          top: -210px;
        }

        .circle-two {
          width: 350px;
          height: 350px;
          left: -230px;
          bottom: -210px;
        }

        .register-logo {
          position: relative;
          z-index: 2;

          width: fit-content;

          display: inline-flex;
          align-items: center;
          gap: 12px;

          color: white;
          text-decoration: none;

          font-size: 25px;
          font-weight: 850;
          letter-spacing: -0.7px;
        }

        .register-logo > span:last-child > span {
          color: #ddd6fe;
        }

        .register-logo-mark {
          width: 46px;
          height: 46px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.24);

          font-size: 23px;
          font-weight: 900;
        }

        .register-brand-content {
          position: relative;
          z-index: 2;

          max-width: 650px;
          margin: auto 0;

          padding: 45px 0;
        }

        .register-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;

          padding: 9px 13px;

          border-radius: 999px;

          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.17);

          color: #ede9fe;

          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;

          margin-bottom: 24px;
        }

        .register-brand-content h1 {
          margin: 0;

          font-size: clamp(58px, 6vw, 88px);
          line-height: 0.94;

          letter-spacing: -5px;
          font-weight: 900;
        }

        .register-brand-content h1 span {
          color: #ddd6fe;
        }

        .register-brand-content > p {
          max-width: 570px;

          margin: 29px 0 0;

          color: rgba(255,255,255,0.78);

          font-size: 17px;
          line-height: 1.7;
        }

        .register-points {
          margin-top: 35px;

          display: grid;
          gap: 15px;
        }

        .register-points > div {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .register-points > div > span {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.13);
        }

        .register-points strong {
          display: block;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .register-points small {
          color: rgba(255,255,255,0.62);
          font-size: 12px;
        }

        .register-footer {
          position: relative;
          z-index: 2;

          display: flex;
          justify-content: space-between;

          color: rgba(255,255,255,0.52);

          font-size: 12px;
          font-weight: 600;
        }

        /* RIGHT */

        .register-form-panel {
          background: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 55px 60px;
        }

        .register-form-container {
          width: 100%;
          max-width: 510px;
        }

        .register-heading {
          margin-bottom: 25px;
        }

        .form-kicker {
          color: #5b4de8;

          font-size: 11px;
          font-weight: 850;

          letter-spacing: 1.6px;
        }

        .register-heading h2 {
          margin: 8px 0 8px;

          color: #111827;

          font-size: 40px;
          line-height: 1.12;

          letter-spacing: -1.5px;
          font-weight: 850;
        }

        .register-heading p {
          margin: 0;

          color: #64748b;

          font-size: 14px;
          line-height: 1.6;
        }

        .field-group {
          display: grid;
          gap: 7px;

          margin-bottom: 17px;
        }

        .field-group > label {
          display: flex;
          justify-content: space-between;

          color: #1e293b;

          font-size: 12px;
          font-weight: 750;
        }

        .optional {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
        }

        .field-group input {
          width: 100%;
          height: 50px;

          box-sizing: border-box;

          padding: 0 15px;

          border: 1px solid #dbe1ea;
          border-radius: 12px;

          outline: none;

          background: #fbfcfe;
          color: #111827;

          font-size: 14px;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .field-group input::placeholder {
          color: #94a3b8;
        }

        .field-group input:focus {
          border-color: #6d5ce7;
          background: #ffffff;

          box-shadow:
            0 0 0 4px rgba(91,77,232,0.1);
        }

        /* ROLE */

        .role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-top: 7px;
        }

        .role-card {
          min-height: 90px;

          padding: 11px 7px;

          border-radius: 12px;

          border: 1px solid #dbe1ea;

          background: #ffffff;

          color: #475569;

          cursor: pointer;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
        }

        .role-card:hover {
          transform: translateY(-1px);
          border-color: #c7c9ff;
        }

        .role-active {
          border: 2px solid #5b4de8;
          background: #f7f5ff;
          color: #4f46e5;

          box-shadow:
            0 7px 18px rgba(91,77,232,0.09);
        }

        .role-icon {
          width: 32px;
          height: 32px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #f1f3f8;

          margin-bottom: 5px;
        }

        .role-active .role-icon {
          background: #e9e5ff;
          color: #5b4de8;
        }

        .role-card strong {
          font-size: 12px;
          font-weight: 800;
        }

        .role-card small {
          margin-top: 2px;

          color: #94a3b8;

          font-size: 9px;
        }

        .role-active small {
          color: #7c70df;
        }

        .selected-role {
          display: block;

          margin-top: 6px;

          color: #94a3b8;

          font-size: 10px;
        }

        .selected-role strong {
          color: #5b4de8;
        }

        .password-hint {
          color: #94a3b8;
          font-size: 10px;
        }

        .register-error {
          margin: 8px 0 13px;

          padding: 11px 13px;

          border-radius: 10px;

          background: #fff1f2;
          border: 1px solid #fecdd3;

          color: #be123c;

          font-size: 12px;
          line-height: 1.5;
        }

        .register-submit {
          width: 100%;
          min-height: 53px;

          border: 0;
          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #5b4de8,
              #7048d9
            );

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          font-size: 14px;
          font-weight: 800;

          cursor: pointer;

          box-shadow:
            0 11px 25px rgba(91,77,232,0.22);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow:
            0 15px 30px rgba(91,77,232,0.28);
        }

        .register-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-divider {
          position: relative;

          margin: 22px 0 17px;

          text-align: center;
        }

        .register-divider::before {
          content: "";

          position: absolute;

          left: 0;
          right: 0;
          top: 50%;

          height: 1px;

          background: #e8ebf0;
        }

        .register-divider span {
          position: relative;
          z-index: 1;

          padding: 0 10px;

          background: white;

          color: #94a3b8;

          font-size: 10px;
          font-weight: 750;
        }

        .login-text {
          margin: 0;

          text-align: center;

          color: #64748b;

          font-size: 13px;
        }

        .login-text a {
          display: inline-flex;
          align-items: center;
          gap: 3px;

          color: #5b4de8;

          text-decoration: none;

          font-weight: 800;
        }

        .login-text a:hover {
          text-decoration: underline;
        }

        .admin-note {
          margin-top: 20px;

          padding: 13px;

          display: flex;
          gap: 10px;

          border: 1px solid #e7e9f2;
          border-radius: 12px;

          background: #fafaff;

          color: #64748b;
        }

        .admin-note > svg {
          flex: 0 0 auto;
          color: #5b4de8;
        }

        .admin-note strong {
          display: block;

          margin-bottom: 3px;

          color: #334155;

          font-size: 11px;
        }

        .admin-note p {
          margin: 0;

          font-size: 10px;
          line-height: 1.5;
        }

        /* TABLET */

        @media (max-width: 1050px) {

          .register-page {
            padding: 15px;
          }

          .register-shell {
            grid-template-columns:
              1fr
              0.95fr;
          }

          .register-brand {
            padding: 40px;
          }

          .register-form-panel {
            padding: 40px;
          }

          .register-brand-content h1 {
            font-size: 64px;
          }

        }

        /* MOBILE */

        @media (max-width: 780px) {

          .register-page {
            padding: 0;
            background: #ffffff;
          }

          .register-shell {
            min-height: 100vh;
            border-radius: 0;
            grid-template-columns: 1fr;
            box-shadow: none;
          }

          .register-brand {
            min-height: 310px;
            padding: 28px 25px;
          }

          .register-brand-content {
            padding: 30px 0 10px;
          }

          .register-brand-content h1 {
            font-size: 51px;
            letter-spacing: -3px;
          }

          .register-brand-content > p {
            margin-top: 18px;
            font-size: 14px;
            line-height: 1.55;
          }

          .register-points {
            display: none;
          }

          .register-footer {
            display: none;
          }

          .register-form-panel {
            padding: 38px 25px 45px;
            align-items: flex-start;
          }

          .register-heading h2 {
            font-size: 32px;
          }

        }

        @media (max-width: 430px) {

          .register-brand {
            min-height: 275px;
          }

          .register-logo {
            font-size: 21px;
          }

          .register-logo-mark {
            width: 40px;
            height: 40px;
          }

          .register-brand-content h1 {
            font-size: 45px;
          }

          .register-form-panel {
            padding: 32px 20px 40px;
          }

          .register-heading h2 {
            font-size: 29px;
          }

          .role-grid {
            gap: 6px;
          }

          .role-card {
            min-height: 83px;
          }

        }

      `}</style>
    </main>
  );
}

function SparkleIcon() {
  return (
    <span
      style={{
        width: 15,
        height: 15,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ✦
    </span>
  );
}