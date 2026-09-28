import Link from "next/link";
import { getCurrentUser, dashboardPath } from "@/lib/auth";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="nav">
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Link href="/" className="logo">
          <span className="logo-mark">S</span>
          SkillClass
        </Link>

        <nav className="nav-links">
          <Link href="/">Home</Link>

          <Link href="/classes">Classes</Link>

          <Link href="/pdf-books">PDF Books</Link>

          {!user && (
            <>
              <Link href="/teacher">Become a Teacher</Link>
              <Link href="/seller">Become a Seller</Link>
            </>
          )}

          {user ? (
            <>
              <Link
                href={dashboardPath(user.role)}
                className="btn btn-outline"
              >
                Dashboard
              </Link>

              <form
                action="/api/auth/logout"
                method="POST"
                style={{ display: "inline" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                Login
              </Link>

              <Link href="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}