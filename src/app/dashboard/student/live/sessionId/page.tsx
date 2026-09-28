import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

type PageProps = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function StudentLiveClassPage({
  params,
}: PageProps) {
  const student = await requireUser(["STUDENT"]);

  if (!student) {
    redirect("/login");
  }

  const { sessionId } = await params;

  const now = new Date();

  const session = await prisma.liveSession.findFirst({
    where: {
      id: sessionId,

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
          teacher: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    redirect("/dashboard/student");
  }

  const hasStarted = session.startsAt <= now;

  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container">
          <div
            className="feature-panel"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div className="course-thumb">
              LIVE CLASS
            </div>

            <h1 style={{ marginTop: "20px" }}>
              {session.title}
            </h1>

            <p className="muted">
              Course: {session.course.title}
            </p>

            <p className="muted">
              Teacher: {session.course.teacher.name}
            </p>

            <div
              className="card"
              style={{ marginTop: "24px" }}
            >
              <p>
                <strong>Start:</strong>{" "}
                {session.startsAt.toLocaleString("en-IN", {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>

              {session.endsAt && (
                <p>
                  <strong>End:</strong>{" "}
                  {session.endsAt.toLocaleString("en-IN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>

            {!session.joinUrl ? (
              <div
                className="card"
                style={{ marginTop: "20px" }}
              >
                <h3>Live class link not available</h3>

                <p className="muted">
                  Your teacher has not added a live class
                  meeting link yet.
                </p>
              </div>
            ) : hasStarted ? (
              <div style={{ marginTop: "24px" }}>
                <a
                  href={session.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Join Live Class
                </a>

                <p
                  className="muted"
                  style={{
                    marginTop: "12px",
                    textAlign: "center",
                  }}
                >
                  Your active subscription has been verified.
                </p>
              </div>
            ) : (
              <div
                className="card"
                style={{ marginTop: "20px" }}
              >
                <h3>Class has not started yet</h3>

                <p className="muted">
                  Please return when the scheduled class
                  time begins.
                </p>
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <Link
                href="/dashboard/student"
                className="btn"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}