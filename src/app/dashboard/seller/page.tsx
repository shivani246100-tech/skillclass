import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/DashboardShell";

export default async function SellerDashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SELLER") {
    redirect("/");
  }

  const [books, payments, wallet] = await Promise.all([
    prisma.pdfBook.findMany({
      where: {
        sellerId: user.id,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.payment.findMany({
      where: {
        pdfBook: {
          sellerId: user.id,
        },
        status: "APPROVED",
      },
      include: {
        pdfBook: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
    }),
  ]);

  const pendingBooks = books.filter(
    (book) => book.approvalStatus === "PENDING_APPROVAL"
  );

  const approvedBooks = books.filter(
    (book) => book.approvalStatus === "APPROVED"
  );

  const totalSales = payments.length;

  const totalSalesAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const totalEarnings = payments.reduce(
    (total, payment) => total + payment.recipientAmount,
    0
  );

  const platformCommission = payments.reduce(
    (total, payment) => total + payment.commission,
    0
  );

  return (
    <DashboardShell role="SELLER" name={user.name}>
      <div className="section-head">
        <div>
          <p
            className="muted"
            style={{
              marginBottom: "6px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            SELLER CENTER
          </p>

          <h1>Seller Dashboard</h1>

          <p className="muted">
            Manage your educational PDF books, sales and earnings.
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label">PDF Books</div>
          <div className="stat-value">{books.length}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Approved Books</div>
          <div className="stat-value">{approvedBooks.length}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Sales</div>
          <div className="stat-value">{totalSales}</div>
        </div>

        <div className="stat">
          <div className="stat-label">Wallet</div>
          <div className="stat-value">
            ₹{(wallet?.balance || 0).toLocaleString("en-IN")}
          </div>
        </div>

        <div className="stat">
          <div className="stat-label">Pending Approval</div>
          <div className="stat-value">{pendingBooks.length}</div>
        </div>
      </div>

      {/* Earnings */}
      <div
        className="grid-3"
        style={{
          marginTop: "28px",
        }}
      >
        <div className="card">
          <h3>Total Sales Value</h3>

          <p className="price">
            ₹{totalSalesAmount.toLocaleString("en-IN")}
          </p>

          <p className="muted">
            Approved PDF sales
          </p>
        </div>

        <div className="card">
          <h3>Your Earnings</h3>

          <p className="price">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>

          <p className="muted">
            After 10% platform commission
          </p>
        </div>

        <div className="card">
          <h3>Platform Commission</h3>

          <p className="price">
            ₹{platformCommission.toLocaleString("en-IN")}
          </p>

          <p className="muted">
            10% platform share
          </p>
        </div>
      </div>

      {/* Seller Workspace */}
      <div
        className="card"
        style={{
          marginTop: "30px",
        }}
      >
        <div className="section-head">
          <div>
            <h2>Seller Workspace</h2>

            <p className="muted">
              Upload educational PDF books and submit them for Admin approval.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "18px",
          }}
        >
          <Link
            href="/dashboard/seller/upload"
            className="btn btn-primary"
          >
            ➕ Upload PDF Book
          </Link>

          <a
            href="#books"
            className="btn"
          >
            📚 My PDF Books
          </a>

          <a
            href="#sales"
            className="btn"
          >
            💰 Sales History
          </a>
        </div>
      </div>

      {/* PDF Books */}
      <div
        id="books"
        style={{
          marginTop: "40px",
        }}
      >
        <div className="section-head">
          <div>
            <h2>My PDF Books</h2>

            <p className="muted">
              Manage your uploaded educational books.
            </p>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="card">
            <h3>No PDF books yet</h3>

            <p className="muted">
              Start selling educational content by uploading your first PDF.
            </p>

            <div style={{ marginTop: "18px" }}>
              <Link
                href="/dashboard/seller/upload"
                className="btn btn-primary"
              >
                Upload Your First PDF
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid-3">
            {books.map((book) => (
              <div
                className="card"
                key={book.id}
              >
                <div
                  className="course-thumb"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  PDF BOOK
                </div>

                <h3
                  style={{
                    marginTop: "16px",
                  }}
                >
                  {book.title}
                </h3>

                <p className="muted">
                  {book.description.length > 110
                    ? `${book.description.slice(0, 110)}...`
                    : book.description}
                </p>

                {book.category && (
                  <p className="muted">
                    Category: {book.category.name}
                  </p>
                )}

                {book.author && (
                  <p className="muted">
                    Author: {book.author}
                  </p>
                )}

                {book.language && (
                  <p className="muted">
                    Language: {book.language}
                  </p>
                )}

                <p>
                  <strong>Price:</strong>{" "}
                  ₹{book.price.toLocaleString("en-IN")}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {book.approvalStatus}
                  </span>
                </p>

                <p className="muted">
                  Created:{" "}
                  {book.createdAt.toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sales History */}
      <div
        id="sales"
        style={{
          marginTop: "40px",
        }}
      >
        <div className="section-head">
          <div>
            <h2>Sales History</h2>

            <p className="muted">
              Approved purchases of your PDF books.
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="card">
            <h3>No sales yet</h3>

            <p className="muted">
              Your approved PDF sales will appear here.
            </p>
          </div>
        ) : (
          <div className="card">
            {payments.map((payment) => (
              <div
                key={payment.id}
                style={{
                  padding: "18px 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>
                      {payment.pdfBook?.title || "PDF Book"}
                    </strong>

                    <p className="muted">
                      Date:{" "}
                      {payment.createdAt.toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <strong>
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </strong>

                    <p className="muted">
                      Your share: ₹
                      {payment.recipientAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Earnings Policy */}
      <div
        className="card"
        style={{
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <h3>💰 Seller Earnings</h3>

        <p className="muted">
          SkillClass retains 10% platform commission on approved
          PDF book sales. The seller receives 90%.
        </p>

        <p
          style={{
            marginTop: "10px",
            fontWeight: 600,
          }}
        >
          Example: ₹500 sale → ₹50 platform commission → ₹450 seller share.
        </p>
      </div>
    </DashboardShell>
  );
}