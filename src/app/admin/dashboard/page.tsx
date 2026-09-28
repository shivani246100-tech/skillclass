"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
students: number;
teachers: number;
sellers: number;
pendingPayments: number;
pendingCourses: number;
pendingPdfBooks: number;
platformEarnings: number;
};

type PendingCourse = {
id: string;
title: string;
description: string;
monthlyFee: number;
schedule: string | null;
startTime: string | null;
endTime: string | null;
createdAt: string;
teacher: {
id: string;
name: string;
email: string;
};
category: {
id: string;
name: string;
} | null;
};

type PendingPayment = {
id: string;
amount: number;
status: string;
createdAt: string;
user: {
id: string;
name: string;
email: string;
mobile: string | null;
};
course: {
id: string;
title: string;
monthlyFee: number;
} | null;
pdfBook: {
id: string;
title: string;
price: number;
} | null;
};

const menuItems = [
"Dashboard",
"Students",
"Teachers",
"Sellers",
"Classes",
"Live Sessions",
"PDF Books",
"Orders",
"Payments",
"Approvals",
"Wallets",
"Transactions",
"Withdrawals",
"Commission",
"Categories",
"Notifications",
"Audit Logs",
"Settings",
];

export default function AdminDashboard() {
const [stats, setStats] = useState<Stats>({
students: 0,
teachers: 0,
sellers: 0,
pendingPayments: 0,
pendingCourses: 0,
pendingPdfBooks: 0,
platformEarnings: 0,
});

const [courses, setCourses] = useState<PendingCourse[]>([]);
const [payments, setPayments] = useState<PendingPayment[]>([]);

const [loading, setLoading] = useState(true);
const [coursesLoading, setCoursesLoading] = useState(true);
const [paymentsLoading, setPaymentsLoading] = useState(true);

const [actionLoading, setActionLoading] = useState<string | null>(null);
const [message, setMessage] = useState("");

async function loadStats() {
try {
const response = await fetch("/api/admin/stats", {
cache: "no-store",
});

  if (!response.ok) {
    throw new Error("Failed to load stats");
  }

  const data = await response.json();

  setStats(data);
} catch (error) {
  console.error("Dashboard stats error:", error);
} finally {
  setLoading(false);
}

}

async function loadCourses() {
try {
const response = await fetch("/api/admin/courses", {
cache: "no-store",
});

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to load courses"
    );
  }

  setCourses(data.courses || []);
} catch (error) {
  console.error("Pending courses error:", error);
} finally {
  setCoursesLoading(false);
}

}

async function loadPayments() {
try {
const response = await fetch("/api/admin/payment", {
cache: "no-store",
});

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to load payments"
    );
  }

  setPayments(data.payments || []);
} catch (error) {
  console.error("Pending payments error:", error);
} finally {
  setPaymentsLoading(false);
}

}

useEffect(() => {
loadStats();
loadCourses();
loadPayments();
}, []);

async function handleCourseAction(
courseId: string,
action: "approve" | "reject"
) {
const actionText =
action === "approve" ? "approve" : "reject";

const confirmed = window.confirm(
  `Are you sure you want to ${actionText} this course?`
);

if (!confirmed) {
  return;
}

setActionLoading(courseId);
setMessage("");

try {
  const response = await fetch("/api/admin/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseId,
      action,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setMessage(
      data.error || "Course action failed."
    );
    return;
  }

  setMessage(data.message);

  setCourses((current) =>
    current.filter(
      (course) => course.id !== courseId
    )
  );

  await loadStats();
} catch (error) {
  console.error(
    "Course approval error:",
    error
  );

  setMessage("Something went wrong.");
} finally {
  setActionLoading(null);
}

}

async function handlePaymentAction(
paymentId: string,
action: "approve" | "reject"
) {
const actionText =
action === "approve" ? "approve" : "reject";

const confirmed = window.confirm(
  `Are you sure you want to ${actionText} this payment?`
);

if (!confirmed) {
  return;
}

setActionLoading(paymentId);
setMessage("");

try {
  const response = await fetch(
    "/api/admin/payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentId,
        action,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setMessage(
      data.error || "Payment action failed."
    );
    return;
  }

  setMessage(data.message);

  setPayments((current) =>
    current.filter(
      (payment) => payment.id !== paymentId
    )
  );

  await loadStats();
} catch (error) {
  console.error(
    "Payment approval error:",
    error
  );

  setMessage("Something went wrong.");
} finally {
  setActionLoading(null);
}

}

return (
<main className="dashboard">
<aside className="sidebar">
<div className="logo">
<span className="logo-mark">S</span>
<span>SkillClass</span>
</div>

    <div className="sidebar-section">
      MAIN
    </div>

    {menuItems.map((item, index) => (
      <Link
        key={item}
        href="#"
        className={`side-link ${
          index === 0 ? "active" : ""
        }`}
      >
        <span>{getIcon(item)}</span>
        {item}
      </Link>
    ))}

    <div className="admin-user">
      <div className="admin-avatar">
        A
      </div>

      <div>
        <strong>
          {loading
            ? "Admin"
            : "Platform Admin"}
        </strong>

        <small>
          Platform Owner
        </small>
      </div>
    </div>
  </aside>

  <section className="main">
    <header className="dash-head">
      <div>
        <p className="eyebrow">
          OVERVIEW
        </p>

        <h1>Admin Dashboard</h1>

        <p className="muted">
          Complete platform control and
          financial overview.
        </p>
      </div>

      <div className="header-actions">
        <span className="badge badge-green">
          <span className="status-dot"></span>
          System Online
        </span>

        <Link
          href="/"
          className="btn btn-secondary"
        >
          View Website
        </Link>
      </div>
    </header>

    {message && (
      <div
        style={{
          padding: "14px 16px",
          marginBottom: "20px",
          borderRadius: "10px",
          background: "#eef6ff",
          border: "1px solid #cfe3ff",
        }}
      >
        {message}
      </div>
    )}

    {/* STATS */}

    <div className="stats">
      <div className="stat">
        <div className="stat-top">
          <span className="stat-label">
            Students
          </span>

          <span className="stat-icon">
            👨‍🎓
          </span>
        </div>

        <div className="stat-value">
          {loading
            ? "..."
            : stats.students}
        </div>

        <div className="stat-growth">
          Registered students
        </div>
      </div>

      <div className="stat">
        <div className="stat-top">
          <span className="stat-label">
            Teachers
          </span>

          <span className="stat-icon">
            👨‍🏫
          </span>
        </div>

        <div className="stat-value">
          {loading
            ? "..."
            : stats.teachers}
        </div>

        <div className="stat-growth">
          Registered teachers
        </div>
      </div>

      <div className="stat">
        <div className="stat-top">
          <span className="stat-label">
            Sellers
          </span>

          <span className="stat-icon">
            📚
          </span>
        </div>

        <div className="stat-value">
          {loading
            ? "..."
            : stats.sellers}
        </div>

        <div className="stat-growth">
          Digital PDF sellers
        </div>
      </div>

      <div className="stat">
        <div className="stat-top">
          <span className="stat-label">
            Pending Courses
          </span>

          <span className="stat-icon">
            🎓
          </span>
        </div>

        <div className="stat-value">
          {loading
            ? "..."
            : stats.pendingCourses}
        </div>

        <div className="stat-growth">
          Awaiting admin approval
        </div>
      </div>
    </div>

    {/* COURSE APPROVAL */}

    <div className="card approval-card">
      <div className="card-header">
        <div>
          <h2>
            Course Approval Center
          </h2>

          <p className="muted">
            Review teacher-submitted
            courses before publishing
            them.
          </p>
        </div>

        <span className="badge badge-yellow">
          {courses.length} Pending
        </span>
      </div>

      {coursesLoading ? (
        <div
          style={{
            padding: "30px 0",
          }}
        >
          Loading pending courses...
        </div>
      ) : courses.length === 0 ? (
        <div
          style={{
            padding: "35px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              marginBottom: "10px",
            }}
          >
            ✓
          </div>

          <h3>
            No pending courses
          </h3>

          <p className="muted">
            All submitted courses have
            been reviewed.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>COURSE</th>
                <th>TEACHER</th>
                <th>FEE</th>
                <th>SCHEDULE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>
                    <strong>
                      {course.title}
                    </strong>

                    <small>
                      {course.description
                        .length > 80
                        ? `${course.description.slice(
                            0,
                            80
                          )}...`
                        : course.description}
                    </small>
                  </td>

                  <td>
                    <strong>
                      {course.teacher.name}
                    </strong>

                    <small>
                      {course.teacher.email}
                    </small>
                  </td>

                  <td>
                    <strong>
                      ₹
                      {course.monthlyFee.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <small>
                      Monthly
                    </small>
                  </td>

                  <td>
                    <strong>
                      {course.schedule ||
                        "Not specified"}
                    </strong>

                    <small>
                      {course.startTime &&
                      course.endTime
                        ? `${course.startTime} - ${course.endTime}`
                        : "Time not specified"}
                    </small>
                  </td>

                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="btn btn-primary"
                        disabled={
                          actionLoading ===
                          course.id
                        }
                        onClick={() =>
                          handleCourseAction(
                            course.id,
                            "approve"
                          )
                        }
                      >
                        {actionLoading ===
                        course.id
                          ? "..."
                          : "Approve"}
                      </button>

                      <button
                        className="btn btn-secondary"
                        disabled={
                          actionLoading ===
                          course.id
                        }
                        onClick={() =>
                          handleCourseAction(
                            course.id,
                            "reject"
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* PAYMENT APPROVAL */}

    <div
      className="card approval-card"
      style={{ marginTop: "30px" }}
    >
      <div className="card-header">
        <div>
          <h2>
            Payment Approval Center
          </h2>

          <p className="muted">
            Review successful payments before
            releasing funds to teachers or
            sellers.
          </p>
        </div>

        <span className="badge badge-yellow">
          {payments.length} Pending
        </span>
      </div>

      {paymentsLoading ? (
        <div
          style={{
            padding: "30px 0",
          }}
        >
          Loading pending payments...
        </div>
      ) : payments.length === 0 ? (
        <div
          style={{
            padding: "35px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "40px",
              marginBottom: "10px",
            }}
          >
            ✓
          </div>

          <h3>
            No pending payments
          </h3>

          <p className="muted">
            All payments have been reviewed.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>ITEM</th>
                <th>AMOUNT / SPLIT</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => {
                const isCourse = Boolean(
                  payment.course
                );

                const commissionRate =
                  isCourse ? 0.20 : 0.10;

                const platformAmount =
                  Math.round(
                    payment.amount *
                      commissionRate
                  );

                const recipientAmount =
                  payment.amount -
                  platformAmount;

                return (
                  <tr key={payment.id}>
                    <td>
                      <strong>
                        {payment.user.name}
                      </strong>

                      <small>
                        {payment.user.email}
                      </small>

                      {payment.user.mobile && (
                        <small>
                          {payment.user.mobile}
                        </small>
                      )}
                    </td>

                    <td>
                      <strong>
                        {payment.course?.title ||
                          payment.pdfBook?.title ||
                          "Unknown Item"}
                      </strong>

                      <small>
                        {isCourse
                          ? "Teacher Course"
                          : "PDF Book"}
                      </small>
                    </td>

                    <td>
                      <strong>
                        ₹
                        {payment.amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <small>
                        Platform (
                        {isCourse
                          ? "20%"
                          : "10%"}
                        ): ₹
                        {platformAmount.toLocaleString(
                          "en-IN"
                        )}
                      </small>

                      <small>
                        {isCourse
                          ? "Teacher"
                          : "Seller"}
                        : ₹
                        {recipientAmount.toLocaleString(
                          "en-IN"
                        )}
                      </small>
                    </td>

                    <td>
                      <strong>
                        {new Date(
                          payment.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </strong>

                      <small>
                        {new Date(
                          payment.createdAt
                        ).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </small>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className="btn btn-primary"
                          disabled={
                            actionLoading ===
                            payment.id
                          }
                          onClick={() =>
                            handlePaymentAction(
                              payment.id,
                              "approve"
                            )
                          }
                        >
                          {actionLoading ===
                          payment.id
                            ? "..."
                            : "Approve"}
                        </button>

                        <button
                          className="btn btn-secondary"
                          disabled={
                            actionLoading ===
                            payment.id
                          }
                          onClick={() =>
                            handlePaymentAction(
                              payment.id,
                              "reject"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* FINANCIAL OVERVIEW */}

    <div className="section-title">
      <div>
        <h2>
          Financial Overview
        </h2>

        <p className="muted">
          Platform wallet and approved
          earnings.
        </p>
      </div>
    </div>

    <div className="grid-3">
      <div className="card finance-card">
        <div className="finance-icon">
          ₹
        </div>

        <h3>
          Platform Earnings
        </h3>

        <div className="finance-value">
          ₹
          {stats.platformEarnings.toLocaleString(
            "en-IN"
          )}
        </div>

        <p className="muted">
          Approved commission
        </p>
      </div>

      <div className="card finance-card">
        <div className="finance-icon">
          👨‍🏫
        </div>

        <h3>
          Teacher Wallets
        </h3>

        <div className="finance-value">
          ₹0
        </div>

        <p className="muted">
          Approved teacher credits
        </p>
      </div>

      <div className="card finance-card">
        <div className="finance-icon">
          📚
        </div>

        <h3>
          Seller Wallets
        </h3>

        <div className="finance-value">
          ₹0
        </div>

        <p className="muted">
          Approved seller credits
        </p>
      </div>
    </div>

    {/* QUICK ACTIONS */}

    <div className="card quick-card">
      <div className="card-header">
        <div>
          <h2>
            Quick Actions
          </h2>

          <p className="muted">
            Frequently used admin controls.
          </p>
        </div>
      </div>

      <div className="quick-actions">
        <Link
          href="#"
          className="quick-action"
        >
          <span>👨‍🎓</span>
          <strong>
            Manage Students
          </strong>
        </Link>

        <Link
          href="#"
          className="quick-action"
        >
          <span>👨‍🏫</span>
          <strong>
            Manage Teachers
          </strong>
        </Link>

        <Link
          href="#"
          className="quick-action"
        >
          <span>📚</span>
          <strong>
            Review PDF Books
          </strong>
        </Link>

        <Link
          href="#"
          className="quick-action"
        >
          <span>💳</span>
          <strong>
            Review Payments
          </strong>
        </Link>
      </div>
    </div>
  </section>
</main>

);
}

function getIcon(item: string) {
const icons: Record<string, string> = {
Dashboard: "⌂",
Students: "👨‍🎓",
Teachers: "👨‍🏫",
Sellers: "📚",
Classes: "🎓",
"Live Sessions": "▶",
"PDF Books": "📄",
Orders: "🛒",
Payments: "💳",
Approvals: "✓",
Wallets: "💰",
Transactions: "↔",
Withdrawals: "↓",
Commission: "%",
Categories: "▦",
Notifications: "🔔",
"Audit Logs": "▤",
Settings: "⚙",
};

return icons[item] || "•";
}