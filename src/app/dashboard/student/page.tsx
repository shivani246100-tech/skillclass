import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function StudentDashboard() {
  const student = await requireUser(["STUDENT"]);

  if (!student) {
    redirect("/login");
  }

  const now = new Date();

  const [subscriptions, payments, liveSessions] = await Promise.all([
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

  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h1>Student Dashboard</h1>

              <p className="muted">
                Welcome, {student.name}
              </p>
            </div>
          </div>

          {/* STATS */}

          <div className="grid-3">
            <div className="card">
              <h3>My Courses</h3>

              <p className="price">
                {subscriptions.length}
              </p>
            </div>

            <div className="card">
              <h3>Payments</h3>

              <p className="price">
                {payments.length}
              </p>
            </div>

            <div className="card">
              <h3>Active Courses</h3>

              <p className="price">
                {activeSubscriptions.length}
              </p>
            </div>
          </div>

          {/* UPCOMING LIVE SESSIONS */}

          <div style={{ marginTop: 40 }}>
            <div className="section-head">
              <div>
                <h2>Upcoming Live Classes</h2>

                <p className="muted">
                  Your upcoming classes are shown here.
                </p>
              </div>
            </div>

            {liveSessions.length === 0 ? (
              <div className="card">
                <h3>No upcoming live classes</h3>

                <p className="muted">
                  Your teacher has not scheduled an upcoming
                  live class yet.
                </p>
              </div>
            ) : (
              <div className="grid-3">
                {liveSessions.map((session) => (
                  <div className="card" key={session.id}>
                    <div className="course-thumb">
                      LIVE CLASS
                    </div>

                    <h3>{session.title}</h3>

                    <p className="muted">
                      Course: {session.course.title}
                    </p>

                    <p>
                      <strong>Starts:</strong>{" "}
                      {session.startsAt.toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </p>

                    {session.endsAt && (
                      <p>
                        <strong>Ends:</strong>{" "}
                        {session.endsAt.toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    )}

                    <Link
                      href={`/dashboard/student/live/${session.id}`}
                      className="btn btn-primary"
                      style={{
                        width: "100%",
                        textAlign: "center",
                        display: "block",
                        marginTop: "16px",
                      }}
                    >
                      Join Live Class
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* MY COURSES */}

          <div style={{ marginTop: 40 }}>
            <h2>My Courses</h2>

            {subscriptions.length === 0 ? (
              <div className="card">
                <h3>No courses yet</h3>

                <p className="muted">
                  Purchase a live class to see it here.
                </p>
              </div>
            ) : (
              <div className="grid-3">
                {subscriptions.map((subscription) => {
                  const isActive =
                    subscription.status === "ACTIVE" &&
                    subscription.endDate > now;

                  return (
                    <div
                      className="card"
                      key={subscription.id}
                    >
                      <div className="course-thumb">
                        LIVE CLASS
                      </div>

                      <h3>
                        {subscription.course.title}
                      </h3>

                      <p className="muted">
                        Teacher:{" "}
                        {subscription.course.teacher.name}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {subscription.status}
                      </p>

                      <p>
                        <strong>Valid Until:</strong>{" "}
                        {subscription.endDate.toLocaleDateString(
                          "en-IN"
                        )}
                      </p>

                      {isActive && (
                        <p
                          style={{
                            marginTop: "10px",
                            fontWeight: 600,
                          }}
                        >
                          ✓ Subscription Active
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PAYMENT HISTORY */}

          <div style={{ marginTop: 40 }}>
            <h2>Payment History</h2>

            {payments.length === 0 ? (
              <div className="card">
                <p className="muted">
                  No payment records found.
                </p>
              </div>
            ) : (
              <div className="card">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      padding: "15px 0",
                      borderBottom:
                        "1px solid #e5e7eb",
                    }}
                  >
                    <strong>
                      {payment.course?.title || "Course"}
                    </strong>

                    <p className="muted">
                      Amount: ₹
                      {Number(
                        payment.amount
                      ).toLocaleString("en-IN")}
                    </p>

                    <p>
                      Status:{" "}
                      <strong>
                        {payment.status}
                      </strong>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}