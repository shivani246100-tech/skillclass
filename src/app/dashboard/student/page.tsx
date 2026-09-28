import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
  PlayCircle,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function StudentDashboard() {
  const student = await requireUser(["STUDENT"]);

  if (!student) {
    redirect("/login");
  }

  const now = new Date();

  const [subscriptions, payments, liveSessions] =
    await Promise.all([
      prisma.subscription.findMany({
        where: {
          studentId: student.id,
        },
        include: {
          course: {
            include: {
              teacher: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          startDate: "desc",
        },
      }),

      prisma.payment.findMany({
        where: {
          userId: student.id,
        },
        include: {
          course: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.liveSession.findMany({
        where: {
          startsAt: {
            gte: now,
          },
          course: {
            active: true,
            approvalStatus: "APPROVED",
            subscriptions: {
              some: {
                studentId: student.id,
                status: "ACTIVE",
                endDate: {
                  gte: now,
                },
              },
            },
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          startsAt: "asc",
        },
      }),
    ]);

  const activeSubscriptions = subscriptions.filter(
    (subscription) =>
      subscription.status === "ACTIVE" &&
      subscription.endDate > now
  );

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount),
    0
  );

  const nextClass = liveSessions[0];

  return (
    <>
      <Navbar />

      <main className="student-dashboard">
        <div className="container">

          {/* HERO */}

          <section className="student-hero">
            <div className="student-hero-content">
              <div className="student-badge">
                <Sparkles size={15} />
                <span>Student Learning Hub</span>
              </div>

              <h1>
                Welcome back,
                <br />
                <span>{student.name}</span>
              </h1>

              <p>
                Continue your learning journey, join upcoming
                live classes and keep track of your courses.
              </p>

              <div className="student-hero-actions">
                <Link
                  href="/dashboard/student"
                  className="student-btn student-btn-light"
                >
                  <BookOpen size={18} />
                  My Learning
                </Link>

                <Link
                  href="/"
                  className="student-btn student-btn-outline"
                >
                  Explore SkillClass
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            <div className="student-hero-visual">
              <div className="hero-orb hero-orb-one" />
              <div className="hero-orb hero-orb-two" />

              <div className="learning-card">
                <div className="learning-icon">
                  <GraduationCap size={30} />
                </div>

                <div>
                  <span>Learning Progress</span>
                  <strong>Keep Learning</strong>
                </div>

                <div className="learning-check">
                  <CheckCircle2 size={23} />
                </div>
              </div>

              <div className="floating-card floating-card-top">
                <PlayCircle size={19} />
                <div>
                  <strong>{liveSessions.length}</strong>
                  <span>Upcoming Classes</span>
                </div>
              </div>

              <div className="floating-card floating-card-bottom">
                <WalletCards size={19} />
                <div>
                  <strong>
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </strong>
                  <span>Total Payments</span>
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}

          <section className="student-stats">
            <div className="student-stat-card">
              <div className="stat-icon purple">
                <BookOpen size={21} />
              </div>

              <div>
                <span>My Courses</span>
                <strong>{subscriptions.length}</strong>
              </div>
            </div>

            <div className="student-stat-card">
              <div className="stat-icon blue">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <span>Active Courses</span>
                <strong>{activeSubscriptions.length}</strong>
              </div>
            </div>

            <div className="student-stat-card">
              <div className="stat-icon green">
                <CreditCard size={21} />
              </div>

              <div>
                <span>Payments</span>
                <strong>{payments.length}</strong>
              </div>
            </div>

            <div className="student-stat-card">
              <div className="stat-icon orange">
                <CalendarDays size={21} />
              </div>

              <div>
                <span>Upcoming Classes</span>
                <strong>{liveSessions.length}</strong>
              </div>
            </div>
          </section>

          {/* NEXT CLASS */}

          {nextClass && (
            <section className="next-class-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    NEXT UP
                  </span>

                  <h2>Your next live class</h2>
                </div>
              </div>

              <div className="next-class-card">
                <div className="next-class-main">
                  <div className="live-pill">
                    <span />
                    LIVE CLASS
                  </div>

                  <h3>{nextClass.title}</h3>

                  <p>
                    {nextClass.course.title}
                  </p>

                  <div className="class-time">
                    <Clock3 size={18} />

                    <span>
                      {nextClass.startsAt.toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/student/live/${nextClass.id}`}
                  className="join-class-btn"
                >
                  <PlayCircle size={19} />
                  Join Live Class
                  <ArrowRight size={17} />
                </Link>
              </div>
            </section>
          )}

          {/* UPCOMING LIVE CLASSES */}

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  LIVE LEARNING
                </span>

                <h2>Upcoming Live Classes</h2>

                <p>
                  Your scheduled classes are ready here.
                </p>
              </div>
            </div>

            {liveSessions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CalendarDays size={28} />
                </div>

                <h3>No upcoming live classes</h3>

                <p>
                  Your teacher has not scheduled an upcoming
                  live class yet.
                </p>
              </div>
            ) : (
              <div className="student-course-grid">
                {liveSessions.map((session) => (
                  <div
                    className="student-course-card"
                    key={session.id}
                  >
                    <div className="course-cover live-cover">
                      <div className="cover-label">
                        <PlayCircle size={16} />
                        LIVE CLASS
                      </div>

                      <div className="cover-decoration">
                        <GraduationCap size={48} />
                      </div>
                    </div>

                    <div className="student-card-content">
                      <span className="course-label">
                        UPCOMING
                      </span>

                      <h3>{session.title}</h3>

                      <p className="course-name">
                        {session.course.title}
                      </p>

                      <div className="date-row">
                        <CalendarDays size={16} />

                        {session.startsAt.toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </div>

                      <Link
                        href={`/dashboard/student/live/${session.id}`}
                        className="card-action"
                      >
                        Join Class
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MY COURSES */}

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  MY LEARNING
                </span>

                <h2>My Courses</h2>

                <p>
                  Manage your active and previous subscriptions.
                </p>
              </div>
            </div>

            {subscriptions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <BookOpen size={28} />
                </div>

                <h3>No courses yet</h3>

                <p>
                  Purchase a live class to start learning.
                </p>

                <Link
                  href="/"
                  className="empty-action"
                >
                  Explore SkillClass
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="student-course-grid">
                {subscriptions.map((subscription) => {
                  const isActive =
                    subscription.status === "ACTIVE" &&
                    subscription.endDate > now;

                  return (
                    <div
                      className="student-course-card"
                      key={subscription.id}
                    >
                      <div className="course-cover course-cover-purple">
                        <div className="cover-label">
                          <GraduationCap size={16} />
                          COURSE
                        </div>

                        <div className="cover-decoration">
                          <BookOpen size={48} />
                        </div>
                      </div>

                      <div className="student-card-content">
                        <div className="status-line">
                          <span className="course-label">
                            LIVE COURSE
                          </span>

                          <span
                            className={
                              isActive
                                ? "status-active"
                                : "status-inactive"
                            }
                          >
                            {isActive
                              ? "Active"
                              : subscription.status}
                          </span>
                        </div>

                        <h3>
                          {subscription.course.title}
                        </h3>

                        <p className="course-name">
                          Teacher:{" "}
                          {subscription.course.teacher.name}
                        </p>

                        <div className="validity-row">
                          <span>Valid until</span>

                          <strong>
                            {subscription.endDate.toLocaleDateString(
                              "en-IN"
                            )}
                          </strong>
                        </div>

                        {isActive && (
                          <div className="active-message">
                            <CheckCircle2 size={16} />
                            Subscription Active
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* PAYMENT HISTORY */}

          <section className="dashboard-section payment-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  TRANSACTIONS
                </span>

                <h2>Payment History</h2>

                <p>
                  Keep track of your SkillClass payments.
                </p>
              </div>

              <div className="payment-total">
                <span>Total Paid</span>
                <strong>
                  ₹{totalPaid.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CreditCard size={28} />
                </div>

                <h3>No payment records</h3>

                <p>
                  Your payment history will appear here.
                </p>
              </div>
            ) : (
              <div className="payment-list">
                {payments.map((payment) => (
                  <div
                    className="payment-row"
                    key={payment.id}
                  >
                    <div className="payment-icon">
                      <CreditCard size={20} />
                    </div>

                    <div className="payment-info">
                      <strong>
                        {payment.course?.title ||
                          "Course Payment"}
                      </strong>

                      <span>
                        {payment.createdAt.toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </span>
                    </div>

                    <div className="payment-amount">
                      <strong>
                        ₹
                        {Number(
                          payment.amount
                        ).toLocaleString("en-IN")}
                      </strong>

                      <span
                        className={`payment-status ${String(
                          payment.status
                        ).toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <style>{`
        .student-dashboard {
          min-height: calc(100vh - 76px);
          background:
            radial-gradient(
              circle at 10% 5%,
              rgba(99, 102, 241, 0.07),
              transparent 28%
            ),
            #f7f8fc;
          padding: 34px 0 80px;
        }

        .student-hero {
          min-height: 390px;
          border-radius: 30px;
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          background:
            radial-gradient(
              circle at 85% 15%,
              rgba(255,255,255,0.18),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #312e81 0%,
              #4f46e5 48%,
              #7c3aed 100%
            );
          box-shadow:
            0 25px 60px rgba(49, 46, 129, 0.22);
        }

        .student-hero-content {
          padding: 55px;
          position: relative;
          z-index: 3;
        }

        .student-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          border-radius: 999px;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .02em;
        }

        .student-hero h1 {
          color: white;
          font-size: clamp(38px, 5vw, 58px);
          line-height: 1.04;
          letter-spacing: -0.045em;
          margin: 24px 0 17px;
        }

        .student-hero h1 span {
          color: #ddd6fe;
        }

        .student-hero p {
          max-width: 600px;
          color: rgba(255,255,255,0.78);
          font-size: 16px;
          line-height: 1.7;
          margin: 0;
        }

        .student-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .student-btn {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          text-decoration: none;
          font-weight: 750;
          transition: .2s ease;
        }

        .student-btn:hover {
          transform: translateY(-2px);
        }

        .student-btn-light {
          color: #312e81;
          background: white;
        }

        .student-btn-outline {
          color: white;
          border: 1px solid rgba(255,255,255,.28);
          background: rgba(255,255,255,.08);
        }

        .student-hero-visual {
          min-height: 390px;
          position: relative;
          overflow: hidden;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.13);
        }

        .hero-orb-one {
          width: 310px;
          height: 310px;
          right: -80px;
          top: 30px;
        }

        .hero-orb-two {
          width: 190px;
          height: 190px;
          right: 60px;
          bottom: -80px;
        }

        .learning-card {
          position: absolute;
          z-index: 4;
          right: 65px;
          top: 105px;
          width: 285px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-radius: 18px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 25px 50px rgba(15,23,42,.18);
        }

        .learning-icon {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #ede9fe;
          color: #6d28d9;
        }

        .learning-card span,
        .floating-card span {
          display: block;
          color: #64748b;
          font-size: 12px;
        }

        .learning-card strong {
          display: block;
          margin-top: 3px;
          color: #111827;
          font-size: 15px;
        }

        .learning-check {
          margin-left: auto;
          color: #16a34a;
        }

        .floating-card {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          border-radius: 14px;
          background: rgba(255,255,255,.94);
          box-shadow: 0 15px 35px rgba(15,23,42,.15);
          color: #4f46e5;
        }

        .floating-card strong {
          display: block;
          color: #111827;
          font-size: 14px;
        }

        .floating-card-top {
          right: 25px;
          top: 55px;
        }

        .floating-card-bottom {
          right: 100px;
          bottom: 52px;
        }

        .student-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .student-stat-card {
          background: white;
          border: 1px solid #e8eaf0;
          border-radius: 18px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 7px 25px rgba(15,23,42,.04);
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          display: grid;
          place-items: center;
        }

        .stat-icon.purple {
          background: #ede9fe;
          color: #6d28d9;
        }

        .stat-icon.blue {
          background: #dbeafe;
          color: #2563eb;
        }

        .stat-icon.green {
          background: #dcfce7;
          color: #16a34a;
        }

        .stat-icon.orange {
          background: #ffedd5;
          color: #ea580c;
        }

        .student-stat-card span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 650;
        }

        .student-stat-card strong {
          display: block;
          color: #111827;
          font-size: 25px;
          margin-top: 2px;
        }

        .dashboard-section,
        .next-class-section {
          margin-top: 48px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .eyebrow {
          color: #6366f1;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .14em;
        }

        .section-heading h2 {
          color: #111827;
          font-size: 29px;
          letter-spacing: -.025em;
          margin: 6px 0 5px;
        }

        .section-heading p {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        .next-class-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 26px 28px;
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #f5f3ff
            );
          border: 1px solid #ddd6fe;
        }

        .live-pill {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #dc2626;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .08em;
        }

        .live-pill span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
        }

        .next-class-main h3 {
          font-size: 23px;
          margin: 9px 0 5px;
          color: #111827;
        }

        .next-class-main p {
          color: #64748b;
          margin: 0;
        }

        .class-time {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4f46e5;
          font-weight: 700;
          font-size: 14px;
          margin-top: 13px;
        }

        .join-class-btn {
          min-height: 48px;
          padding: 0 18px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: white;
          background: #4f46e5;
          text-decoration: none;
          font-weight: 750;
          white-space: nowrap;
          transition: .2s ease;
        }

        .join-class-btn:hover,
        .card-action:hover,
        .empty-action:hover {
          transform: translateY(-2px);
        }

        .student-course-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .student-course-card {
          overflow: hidden;
          border-radius: 20px;
          background: white;
          border: 1px solid #e7e9ef;
          box-shadow: 0 8px 30px rgba(15,23,42,.045);
          transition: .22s ease;
        }

        .student-course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 40px rgba(15,23,42,.09);
        }

        .course-cover {
          height: 145px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 18px;
        }

        .live-cover {
          background:
            radial-gradient(circle at 80% 20%, #818cf8, transparent 28%),
            linear-gradient(135deg, #312e81, #4f46e5);
          color: white;
        }

        .course-cover-purple {
          background:
            radial-gradient(circle at 80% 20%, #a78bfa, transparent 28%),
            linear-gradient(135deg, #581c87, #7c3aed);
          color: white;
        }

        .cover-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border-radius: 8px;
          background: rgba(255,255,255,.13);
          border: 1px solid rgba(255,255,255,.18);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
        }

        .cover-decoration {
          position: absolute;
          right: 28px;
          bottom: -5px;
          opacity: .22;
        }

        .student-card-content {
          padding: 20px;
        }

        .course-label {
          color: #6366f1;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .1em;
        }

        .student-card-content h3 {
          color: #111827;
          font-size: 18px;
          line-height: 1.3;
          margin: 8px 0 7px;
        }

        .course-name {
          color: #64748b;
          font-size: 13px;
          margin: 0;
        }

        .date-row,
        .validity-row {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #475569;
          font-size: 13px;
          margin-top: 16px;
        }

        .date-row {
          color: #4f46e5;
          font-weight: 650;
        }

        .card-action {
          margin-top: 19px;
          width: 100%;
          min-height: 43px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #4f46e5;
          background: #eef2ff;
          text-decoration: none;
          font-weight: 750;
          font-size: 13px;
          transition: .2s ease;
        }

        .status-line {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .status-active,
        .status-inactive {
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .status-active {
          color: #15803d;
          background: #dcfce7;
        }

        .status-inactive {
          color: #64748b;
          background: #f1f5f9;
        }

        .validity-row {
          justify-content: space-between;
          border-top: 1px solid #eef0f4;
          padding-top: 13px;
        }

        .validity-row strong {
          color: #111827;
        }

        .active-message {
          margin-top: 13px;
          padding: 9px 10px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #15803d;
          background: #f0fdf4;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 700;
        }

        .empty-state {
          text-align: center;
          padding: 50px 25px;
          background: white;
          border: 1px dashed #d8dce5;
          border-radius: 20px;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          border-radius: 17px;
          color: #6366f1;
          background: #eef2ff;
        }

        .empty-state h3 {
          color: #111827;
          margin: 0 0 6px;
        }

        .empty-state p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .empty-action {
          width: fit-content;
          margin: 20px auto 0;
          padding: 11px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 750;
          font-size: 13px;
          transition: .2s ease;
        }

        .payment-total {
          text-align: right;
        }

        .payment-total span {
          display: block;
          color: #64748b;
          font-size: 12px;
        }

        .payment-total strong {
          display: block;
          color: #111827;
          font-size: 22px;
          margin-top: 3px;
        }

        .payment-list {
          overflow: hidden;
          background: white;
          border: 1px solid #e7e9ef;
          border-radius: 18px;
        }

        .payment-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 17px 20px;
          border-bottom: 1px solid #eef0f4;
        }

        .payment-row:last-child {
          border-bottom: none;
        }

        .payment-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: grid;
          place-items: center;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 11px;
        }

        .payment-info {
          flex: 1;
          min-width: 0;
        }

        .payment-info strong {
          display: block;
          color: #111827;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .payment-info span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        .payment-amount {
          text-align: right;
        }

        .payment-amount strong {
          display: block;
          color: #111827;
          font-size: 14px;
        }

        .payment-status {
          display: inline-block;
          margin-top: 5px;
          padding: 4px 8px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 9px;
          font-weight: 850;
        }

        @media (max-width: 1000px) {
          .student-hero {
            grid-template-columns: 1fr;
          }

          .student-hero-visual {
            min-height: 230px;
          }

          .student-hero-content {
            padding: 42px;
          }

          .learning-card {
            top: 35px;
            right: 50%;
            transform: translateX(50%);
          }

          .floating-card-top {
            right: 20px;
            top: 15px;
          }

          .floating-card-bottom {
            right: 30px;
            bottom: 20px;
          }

          .student-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .student-course-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .student-dashboard {
            padding-top: 20px;
          }

          .student-hero {
            border-radius: 22px;
          }

          .student-hero-content {
            padding: 30px 24px;
          }

          .student-hero h1 {
            font-size: 38px;
          }

          .student-hero-actions {
            flex-direction: column;
          }

          .student-btn {
            width: 100%;
          }

          .student-hero-visual {
            min-height: 220px;
          }

          .student-stats,
          .student-course-grid {
            grid-template-columns: 1fr;
          }

          .next-class-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .join-class-btn {
            width: 100%;
            justify-content: center;
          }

          .section-heading {
            align-items: flex-start;
          }

          .payment-total {
            display: none;
          }

          .payment-row {
            padding: 15px;
          }
        }

        @media (max-width: 430px) {
          .learning-card {
            width: 245px;
            right: 50%;
          }

          .floating-card-top {
            right: 10px;
          }

          .floating-card-bottom {
            left: 15px;
            right: auto;
          }

          .student-hero h1 {
            font-size: 34px;
          }

          .section-heading h2 {
            font-size: 25px;
          }
        }
      `}</style>
    </>
  );
}