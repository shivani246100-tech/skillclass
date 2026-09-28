import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "status approved";
    case "PENDING_APPROVAL":
      return "status pending";
    case "REJECTED":
      return "status rejected";
    case "DISABLED":
      return "status disabled";
    default:
      return "status draft";
  }
}

function statusText(status: string) {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "PENDING_APPROVAL":
      return "Pending";
    case "REJECTED":
      return "Rejected";
    case "DISABLED":
      return "Disabled";
    default:
      return "Draft";
  }
}

export default async function SellerDashboard() {
  const user = await requireUser(["SELLER"]);

  if (!user) {
    return (
      <main className="access-page">
        <div className="access-card">
          <div className="access-icon">🔒</div>
          <h1>Access Denied</h1>
          <p>Please login with a seller account.</p>
          <Link href="/login" className="primary-btn">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  const [
    totalBooks,
    approvedBooks,
    pendingBooks,
    rejectedBooks,
    salesCount,
    paymentSummary,
    wallet,
    recentBooks,
    recentPayments,
  ] = await Promise.all([
    prisma.pdfBook.count({
      where: {
        sellerId: user.id,
      },
    }),

    prisma.pdfBook.count({
      where: {
        sellerId: user.id,
        approvalStatus: "APPROVED",
      },
    }),

    prisma.pdfBook.count({
      where: {
        sellerId: user.id,
        approvalStatus: "PENDING_APPROVAL",
      },
    }),

    prisma.pdfBook.count({
      where: {
        sellerId: user.id,
        approvalStatus: "REJECTED",
      },
    }),

    prisma.pdfPurchase.count({
      where: {
        pdfBook: {
          sellerId: user.id,
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "APPROVED",
        pdfBook: {
          sellerId: user.id,
        },
      },
      _sum: {
        amount: true,
        commission: true,
        recipientAmount: true,
      },
      _count: {
        _all: true,
      },
    }),

    prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        balance: true,
      },
    }),

    prisma.pdfBook.findMany({
      where: {
        sellerId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        price: true,
        coverUrl: true,
        approvalStatus: true,
        createdAt: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.payment.findMany({
      where: {
        status: "APPROVED",
        pdfBook: {
          sellerId: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        amount: true,
        commission: true,
        recipientAmount: true,
        createdAt: true,
        pdfBook: {
          select: {
            title: true,
          },
        },
      },
    }),
  ]);

  const grossSales = paymentSummary._sum.amount ?? 0;
  const commission = paymentSummary._sum.commission ?? 0;
  const earnings = paymentSummary._sum.recipientAmount ?? 0;
  const walletBalance = wallet?.balance ?? 0;
  const approvedPayments = paymentSummary._count._all;

  return (
    <main className="seller-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f5f7fb;
          color: #111827;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          text-decoration: none;
        }

        .seller-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(99, 102, 241, 0.08),
              transparent 32%
            ),
            #f5f7fb;
        }

        .topbar {
          height: 76px;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e8ebf2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 34px;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(14px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #111827;
          font-weight: 800;
          font-size: 21px;
          letter-spacing: -0.4px;
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          border-radius: 13px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          display: grid;
          place-items: center;
          color: white;
          font-size: 18px;
          font-weight: 900;
          box-shadow: 0 8px 22px rgba(79, 70, 229, 0.25);
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .search {
          width: 250px;
          height: 42px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
          padding: 0 15px;
          outline: none;
          color: #6b7280;
        }

        .notification {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: white;
          display: grid;
          place-items: center;
          font-size: 18px;
        }

        .user-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 6px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        .user-info strong {
          display: block;
          font-size: 14px;
        }

        .user-info span {
          display: block;
          color: #8a94a6;
          font-size: 12px;
          margin-top: 2px;
        }

        .layout {
          display: flex;
          min-height: calc(100vh - 76px);
        }

        .sidebar {
          width: 245px;
          background: #fff;
          border-right: 1px solid #e8ebf2;
          padding: 25px 16px;
          flex-shrink: 0;
        }

        .side-label {
          color: #9aa3b2;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 13px;
          margin: 5px 0 12px;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nav a {
          color: #667085;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 13px;
          border-radius: 11px;
          font-size: 14px;
          font-weight: 600;
          transition: 0.2s;
        }

        .nav a:hover {
          background: #f3f5ff;
          color: #4f46e5;
        }

        .nav a.active {
          color: #fff;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          box-shadow: 0 8px 18px rgba(79, 70, 229, 0.18);
        }

        .nav-icon {
          width: 25px;
          text-align: center;
          font-size: 17px;
        }

        .sidebar-bottom {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #edf0f4;
        }

        .main {
          flex: 1;
          padding: 30px;
          min-width: 0;
        }

        .hero {
          position: relative;
          overflow: hidden;
          min-height: 245px;
          border-radius: 24px;
          padding: 34px;
          color: white;
          background:
            radial-gradient(
              circle at 90% 20%,
              rgba(255,255,255,0.25),
              transparent 25%
            ),
            linear-gradient(135deg, #2563eb 0%, #4f46e5 48%, #7c3aed 100%);
          box-shadow: 0 20px 45px rgba(79, 70, 229, 0.22);
        }

        .hero:after {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border: 45px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          right: -80px;
          top: -110px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .hero h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -1px;
        }

        .hero p {
          margin: 12px 0 23px;
          color: rgba(255,255,255,0.84);
          font-size: 15px;
          line-height: 1.6;
          max-width: 600px;
        }

        .hero-actions {
          display: flex;
          gap: 11px;
          flex-wrap: wrap;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 17px;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 800;
          background: white;
          color: #3730a3;
        }

        .hero-btn.secondary {
          background: rgba(255,255,255,0.13);
          color: white;
          border: 1px solid rgba(255,255,255,0.25);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .stat {
          background: white;
          border: 1px solid #e9ecf2;
          border-radius: 17px;
          padding: 19px;
          box-shadow: 0 5px 18px rgba(15,23,42,0.035);
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background: #eef2ff;
          font-size: 17px;
        }

        .stat h3 {
          margin: 16px 0 3px;
          font-size: 25px;
          letter-spacing: -0.7px;
        }

        .stat p {
          margin: 0;
          color: #8992a3;
          font-size: 12px;
          font-weight: 600;
        }

        .section-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(310px, 0.75fr);
          gap: 20px;
          margin-top: 20px;
        }

        .card {
          background: white;
          border: 1px solid #e8ebf2;
          border-radius: 19px;
          overflow: hidden;
          box-shadow: 0 5px 18px rgba(15,23,42,0.035);
        }

        .card-header {
          padding: 20px 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #edf0f4;
        }

        .card-title h2 {
          margin: 0;
          font-size: 16px;
          letter-spacing: -0.2px;
        }

        .card-title p {
          margin: 4px 0 0;
          color: #929baa;
          font-size: 12px;
        }

        .view-link {
          color: #4f46e5;
          font-size: 12px;
          font-weight: 800;
        }

        .book-list {
          padding: 6px 20px 12px;
        }

        .book-row {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px 0;
          border-bottom: 1px solid #f0f2f5;
        }

        .book-row:last-child {
          border-bottom: 0;
        }

        .book-cover {
          width: 50px;
          height: 58px;
          border-radius: 9px;
          overflow: hidden;
          flex-shrink: 0;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          display: grid;
          place-items: center;
          color: #4f46e5;
          font-size: 21px;
          font-weight: 900;
        }

        .book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-info {
          min-width: 0;
          flex: 1;
        }

        .book-info strong {
          display: block;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .book-info span {
          display: block;
          color: #929baa;
          font-size: 11px;
          margin-top: 4px;
        }

        .book-price {
          font-weight: 800;
          font-size: 13px;
          margin-right: 8px;
        }

        .status {
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status.approved {
          background: #ecfdf3;
          color: #07883f;
        }

        .status.pending {
          background: #fff7e6;
          color: #b76b00;
        }

        .status.rejected {
          background: #fff0f0;
          color: #c24141;
        }

        .status.disabled {
          background: #f1f5f9;
          color: #64748b;
        }

        .status.draft {
          background: #eef2ff;
          color: #4f46e5;
        }

        .quick-grid {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }

        .quick {
          min-height: 92px;
          padding: 15px;
          border-radius: 14px;
          background: #f8f9fc;
          border: 1px solid #edf0f4;
          transition: 0.2s;
        }

        .quick:hover {
          transform: translateY(-2px);
          border-color: #d7dcff;
          background: #f7f7ff;
        }

        .quick-icon {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .quick strong {
          display: block;
          color: #202636;
          font-size: 12px;
        }

        .quick span {
          display: block;
          color: #8b94a4;
          font-size: 10px;
          margin-top: 3px;
        }

        .earnings-card {
          margin-top: 20px;
        }

        .earning-body {
          padding: 20px;
        }

        .earning-main {
          border-radius: 15px;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4ff, #f8f4ff);
          border: 1px solid #e8e9ff;
        }

        .earning-label {
          color: #727b8d;
          font-size: 12px;
          font-weight: 700;
        }

        .earning-value {
          margin-top: 7px;
          font-size: 31px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .earning-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 13px;
        }

        .earning-detail {
          background: white;
          border: 1px solid #e9ecf3;
          border-radius: 12px;
          padding: 13px;
        }

        .earning-detail span {
          display: block;
          color: #929baa;
          font-size: 10px;
        }

        .earning-detail strong {
          display: block;
          margin-top: 5px;
          font-size: 14px;
        }

        .payment-list {
          padding: 5px 20px 13px;
        }

        .payment-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 13px 0;
          border-bottom: 1px solid #f0f2f5;
        }

        .payment-row:last-child {
          border-bottom: 0;
        }

        .payment-name {
          min-width: 0;
        }

        .payment-name strong {
          display: block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 190px;
        }

        .payment-name span {
          display: block;
          color: #949cab;
          font-size: 10px;
          margin-top: 4px;
        }

        .payment-amount {
          text-align: right;
          white-space: nowrap;
        }

        .payment-amount strong {
          display: block;
          color: #07883f;
          font-size: 12px;
        }

        .payment-amount span {
          color: #a0a7b3;
          font-size: 10px;
        }

        .empty {
          padding: 35px 20px;
          text-align: center;
          color: #9099a8;
          font-size: 12px;
        }

        .empty-icon {
          font-size: 30px;
          margin-bottom: 8px;
        }

        .footer-note {
          text-align: center;
          padding: 25px 0 5px;
          color: #a1a8b4;
          font-size: 11px;
        }

        .access-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f5f7fb;
          padding: 20px;
        }

        .access-card {
          width: min(420px, 100%);
          background: white;
          border: 1px solid #e8ebf2;
          border-radius: 20px;
          padding: 35px;
          text-align: center;
        }

        .access-icon {
          font-size: 35px;
        }

        .access-card h1 {
          margin: 12px 0 8px;
        }

        .access-card p {
          color: #7c8494;
          font-size: 14px;
          margin-bottom: 22px;
        }

        .primary-btn {
          display: inline-flex;
          padding: 11px 18px;
          background: #4f46e5;
          color: white;
          border-radius: 10px;
          font-weight: 700;
        }

        @media (max-width: 1150px) {
          .stats {
            grid-template-columns: repeat(3, 1fr);
          }

          .section-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            width: 215px;
          }
        }

        @media (max-width: 850px) {
          .topbar {
            padding: 0 18px;
          }

          .search {
            display: none;
          }

          .sidebar {
            width: 72px;
            padding: 20px 9px;
          }

          .side-label,
          .nav-text,
          .user-info {
            display: none;
          }

          .nav a {
            justify-content: center;
            padding: 12px 5px;
          }

          .nav-icon {
            width: auto;
          }

          .main {
            padding: 20px;
          }

          .hero h1 {
            font-size: 28px;
          }
        }

        @media (max-width: 650px) {
          .topbar {
            height: 68px;
          }

          .layout {
            min-height: calc(100vh - 68px);
          }

          .brand span {
            display: none;
          }

          .notification {
            display: none;
          }

          .stats {
            grid-template-columns: 1fr 1fr;
          }

          .main {
            padding: 14px;
          }

          .hero {
            padding: 25px 20px;
            border-radius: 19px;
          }

          .hero h1 {
            font-size: 25px;
          }

          .hero p {
            font-size: 13px;
          }

          .book-price {
            display: none;
          }

          .status {
            display: none;
          }

          .quick-grid {
            grid-template-columns: 1fr 1fr;
          }

          .earning-details {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .sidebar {
            display: none;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .user-chip {
            display: none;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-btn {
            width: 100%;
          }
        }
      `}</style>

      <header className="topbar">
        <Link href="/dashboard/seller" className="brand">
          <div className="brand-logo">S</div>
          <span>SkillClass</span>
        </Link>

        <div className="top-actions">
          <input
            className="search"
            placeholder="Search your dashboard..."
            readOnly
          />

          <div className="notification">🔔</div>

          <div className="user-chip">
            <div className="avatar">
              {user.name?.charAt(0)?.toUpperCase() || "S"}
            </div>

            <div className="user-info">
              <strong>{user.name}</strong>
              <span>Seller Account</span>
            </div>
          </div>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="side-label">Workspace</div>

          <nav className="nav">
            <Link href="/dashboard/seller" className="active">
              <span className="nav-icon">⌂</span>
              <span className="nav-text">Home</span>
            </Link>

            <Link href="/dashboard/seller/pdf-books">
              <span className="nav-icon">📚</span>
              <span className="nav-text">PDF Books</span>
            </Link>

            <Link href="/dashboard/seller/upload">
              <span className="nav-icon">＋</span>
              <span className="nav-text">Add Book</span>
            </Link>

            <Link href="/dashboard/seller/sales">
              <span className="nav-icon">📊</span>
              <span className="nav-text">Sales</span>
            </Link>

            <Link href="/dashboard/seller/earnings">
              <span className="nav-icon">₹</span>
              <span className="nav-text">Earnings & Wallet</span>
            </Link>

            <Link href="/dashboard/seller/profile">
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </Link>

            <Link href="/dashboard/seller/settings">
              <span className="nav-icon">⚙</span>
              <span className="nav-text">Settings</span>
            </Link>
          </nav>

          <div className="sidebar-bottom">
            <div className="side-label">Account</div>

            <nav className="nav">
              <Link href="/logout">
                <span className="nav-icon">↪</span>
                <span className="nav-text">Logout</span>
              </Link>
            </nav>
          </div>
        </aside>

        <section className="main">
          <div className="hero">
            <div className="hero-content">
              <div className="hero-tag">
                ✦ Seller Workspace
              </div>

              <h1>
                Sell. Share. Grow.
              </h1>

              <p>
                Welcome back, {user.name}. Manage your digital books,
                track sales and grow your earnings — all from one place.
              </p>

              <div className="hero-actions">
                <Link
                  href="/dashboard/seller/upload"
                  className="hero-btn"
                >
                  ＋ Upload New PDF
                </Link>

                <Link
                  href="/dashboard/seller/pdf-books"
                  className="hero-btn secondary"
                >
                  View My Books →
                </Link>
              </div>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-top">
                <div className="stat-icon">📚</div>
              </div>
              <h3>{totalBooks}</h3>
              <p>Total PDF Books</p>
            </div>

            <div className="stat">
              <div className="stat-top">
                <div className="stat-icon">✓</div>
              </div>
              <h3>{approvedBooks}</h3>
              <p>Approved Books</p>
            </div>

            <div className="stat">
              <div className="stat-top">
                <div className="stat-icon">⏳</div>
              </div>
              <h3>{pendingBooks}</h3>
              <p>Pending Approval</p>
            </div>

            <div className="stat">
              <div className="stat-top">
                <div className="stat-icon">🛒</div>
              </div>
              <h3>{salesCount}</h3>
              <p>Total Sales</p>
            </div>

            <div className="stat">
              <div className="stat-top">
                <div className="stat-icon">₹</div>
              </div>
              <h3>₹{walletBalance.toLocaleString("en-IN")}</h3>
              <p>Wallet Balance</p>
            </div>
          </div>

          <div className="section-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <h2>My PDF Books</h2>
                  <p>Your latest uploaded digital products</p>
                </div>

                <Link
                  href="/dashboard/seller/pdf-books"
                  className="view-link"
                >
                  View All →
                </Link>
              </div>

              <div className="book-list">
                {recentBooks.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">📚</div>
                    <div>No PDF books yet.</div>

                    <div style={{ marginTop: 12 }}>
                      <Link
                        href="/dashboard/seller/upload"
                        className="view-link"
                      >
                        Upload your first book →
                      </Link>
                    </div>
                  </div>
                ) : (
                  recentBooks.map((book) => (
                    <div className="book-row" key={book.id}>
                      <div className="book-cover">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={book.title}
                          />
                        ) : (
                          "PDF"
                        )}
                      </div>

                      <div className="book-info">
                        <strong>{book.title}</strong>

                        <span>
                          {book.category?.name || "General"} •{" "}
                          {formatDate(book.createdAt)}
                        </span>
                      </div>

                      <div className="book-price">
                        ₹{book.price.toLocaleString("en-IN")}
                      </div>

                      <span
                        className={statusClass(
                          book.approvalStatus
                        )}
                      >
                        {statusText(book.approvalStatus)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <h2>Quick Actions</h2>
                  <p>Manage your seller account</p>
                </div>
              </div>

              <div className="quick-grid">
                <Link
                  href="/dashboard/seller/upload"
                  className="quick"
                >
                  <div className="quick-icon">📤</div>
                  <strong>Upload PDF</strong>
                  <span>Add a new digital book</span>
                </Link>

                <Link
                  href="/dashboard/seller/pdf-books"
                  className="quick"
                >
                  <div className="quick-icon">📚</div>
                  <strong>My Books</strong>
                  <span>Manage your products</span>
                </Link>

                <Link
                  href="/dashboard/seller/sales"
                  className="quick"
                >
                  <div className="quick-icon">📈</div>
                  <strong>Sales</strong>
                  <span>See your sales history</span>
                </Link>

                <Link
                  href="/dashboard/seller/earnings"
                  className="quick"
                >
                  <div className="quick-icon">💰</div>
                  <strong>Earnings</strong>
                  <span>Wallet & income</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="section-grid">
            <div className="card earnings-card">
              <div className="card-header">
                <div className="card-title">
                  <h2>Earnings Overview</h2>
                  <p>Approved PDF book payments</p>
                </div>

                <Link
                  href="/dashboard/seller/earnings"
                  className="view-link"
                >
                  Details →
                </Link>
              </div>

              <div className="earning-body">
                <div className="earning-main">
                  <div className="earning-label">
                    Your Total Earnings
                  </div>

                  <div className="earning-value">
                    ₹{earnings.toLocaleString("en-IN")}
                  </div>

                  <div className="earning-details">
                    <div className="earning-detail">
                      <span>Gross Sales</span>
                      <strong>
                        ₹{grossSales.toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="earning-detail">
                      <span>Platform Commission</span>
                      <strong>
                        ₹{commission.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card earnings-card">
              <div className="card-header">
                <div className="card-title">
                  <h2>Recent Sales</h2>
                  <p>Latest approved payments</p>
                </div>

                <Link
                  href="/dashboard/seller/sales"
                  className="view-link"
                >
                  View All →
                </Link>
              </div>

              <div className="payment-list">
                {recentPayments.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🛍️</div>
                    No sales yet.
                  </div>
                ) : (
                  recentPayments.map((payment) => (
                    <div className="payment-row" key={payment.id}>
                      <div className="payment-name">
                        <strong>
                          {payment.pdfBook?.title ||
                            "PDF Book"}
                        </strong>

                        <span>
                          {formatDate(payment.createdAt)}
                        </span>
                      </div>

                      <div className="payment-amount">
                        <strong>
                          +₹
                          {payment.recipientAmount.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        <span>
                          Sale ₹
                          {payment.amount.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="footer-note">
            SkillClass Seller Dashboard • {approvedPayments} approved
            payment{approvedPayments === 1 ? "" : "s"}
          </div>
        </section>
      </div>
    </main>
  );
}