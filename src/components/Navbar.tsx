import Link from "next/link";
import { getCurrentUser, dashboardPath } from "@/lib/auth";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="nav">
      <div className="container nav-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-mark">
            <span>S</span>
          </span>

          <span className="logo-text">
            Skill<span>Class</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>

          <Link href="/classes" className="nav-link">
            Classes
          </Link>

          <Link href="/pdf-books" className="nav-link">
            PDF Books
          </Link>

          {!user && (
            <>
              <Link href="/teacher" className="nav-link nav-special">
                Become a Teacher
              </Link>

              <Link href="/seller" className="nav-link nav-special">
                Become a Seller
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                href={dashboardPath(user.role)}
                className="btn btn-outline nav-dashboard"
              >
                Dashboard
              </Link>

              <form
                action="/api/auth/logout"
                method="POST"
                style={{ display: "inline" }}
              >
                <button type="submit" className="btn btn-primary nav-logout">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>

              <Link href="/register" className="btn btn-primary nav-register">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}