"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Invalid email or password."
        );
        return;
      }

      /*
       * Login API returns:
       *
       * ADMIN   -> /admin/dashboard
       * STUDENT -> /dashboard/student
       * TEACHER -> /dashboard/teacher
       * SELLER  -> /dashboard/seller
       */

      const redirectPath =
        data?.redirect || "/";

      router.push(redirectPath);

      router.refresh();
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">
          Welcome Back
        </span>

        <h1 style={{ marginTop: 15 }}>
          Login to SkillClass
        </h1>

        <p className="muted">
          Login to continue to your
          SkillClass account.
        </p>

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                padding: 12,
                borderRadius: 10,
                background:
                  "#fef2f2",
                color: "#b91c1c",
                fontSize: 13,
                marginTop: 10,
              }}
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              marginTop: 15,
            }}
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        {/* REGISTER */}

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{
              color: "#2563eb",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </p>

        <p
          style={{
            textAlign: "center",
            marginTop: 10,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          Student, Teacher and Seller can
          register themselves.
          <br />
          Admin access is managed by the owner.
        </p>
      </div>
    </main>
  );
}