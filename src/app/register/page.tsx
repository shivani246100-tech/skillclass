"use client";

import { FormEvent, useState } from "react";
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

  function changeField(
    field: keyof typeof form,
    value: string
  ) {
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
          Create Account
        </span>

        <h1 style={{ marginTop: 15 }}>
          Join SkillClass
        </h1>

        <p className="muted">
          Choose your account type and create your
          SkillClass account.
        </p>

        <form onSubmit={submit}>
          {/* ROLE SELECTION */}

          <div className="form-group">
            <label>
              Choose Account Type
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: 10,
                marginTop: 8,
              }}
            >
              {/* STUDENT */}

              <button
                type="button"
                onClick={() =>
                  changeField(
                    "role",
                    "STUDENT"
                  )
                }
                style={{
                  padding: "14px 8px",
                  borderRadius: 12,
                  border:
                    form.role === "STUDENT"
                      ? "2px solid #2563eb"
                      : "1px solid #d1d5db",
                  background:
                    form.role === "STUDENT"
                      ? "#eff6ff"
                      : "#ffffff",
                  color:
                    form.role === "STUDENT"
                      ? "#1d4ed8"
                      : "#374151",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                  }}
                >
                  🎓
                </span>

                <br />

                Student
              </button>

              {/* TEACHER */}

              <button
                type="button"
                onClick={() =>
                  changeField(
                    "role",
                    "TEACHER"
                  )
                }
                style={{
                  padding: "14px 8px",
                  borderRadius: 12,
                  border:
                    form.role === "TEACHER"
                      ? "2px solid #7c3aed"
                      : "1px solid #d1d5db",
                  background:
                    form.role === "TEACHER"
                      ? "#f5f3ff"
                      : "#ffffff",
                  color:
                    form.role === "TEACHER"
                      ? "#6d28d9"
                      : "#374151",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                  }}
                >
                  👨‍🏫
                </span>

                <br />

                Teacher
              </button>

              {/* SELLER */}

              <button
                type="button"
                onClick={() =>
                  changeField(
                    "role",
                    "SELLER"
                  )
                }
                style={{
                  padding: "14px 8px",
                  borderRadius: 12,
                  border:
                    form.role === "SELLER"
                      ? "2px solid #059669"
                      : "1px solid #d1d5db",
                  background:
                    form.role === "SELLER"
                      ? "#ecfdf5"
                      : "#ffffff",
                  color:
                    form.role === "SELLER"
                      ? "#047857"
                      : "#374151",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                  }}
                >
                  📚
                </span>

                <br />

                Seller
              </button>
            </div>

            <small
              style={{
                display: "block",
                marginTop: 8,
                color: "#6b7280",
              }}
            >
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

          <div className="form-group">
            <label>
              Full Name
            </label>

            <input
              value={form.name}
              onChange={(e) =>
                changeField(
                  "name",
                  e.target.value
                )
              }
              placeholder="Your full name"
              required
            />
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label>
              Email
            </label>

            <input
              value={form.email}
              onChange={(e) =>
                changeField(
                  "email",
                  e.target.value
                )
              }
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* MOBILE */}

          <div className="form-group">
            <label>
              Mobile Number
            </label>

            <input
              value={form.mobile}
              onChange={(e) =>
                changeField(
                  "mobile",
                  e.target.value
                )
              }
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              value={form.password}
              onChange={(e) =>
                changeField(
                  "password",
                  e.target.value
                )
              }
              type="password"
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                padding: 12,
                marginTop: 10,
                borderRadius: 10,
                background: "#fef2f2",
                color: "#b91c1c",
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}

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
              ? "Creating Account..."
              : "Create Account"}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#2563eb",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Login
            </a>
          </p>

          <p
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            Admin accounts are managed by the
            SkillClass owner.
          </p>
        </form>
      </div>
    </main>
  );
}