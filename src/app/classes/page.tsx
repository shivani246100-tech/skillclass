import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export default async function Classes() {
  const courses = await prisma.course.findMany({
    where: {
      approvalStatus: "APPROVED",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      teacher: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Explore Live Classes</h2>
              <p>Learn from verified teachers through live classes.</p>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="card">
              <h3>No live classes available</h3>
              <p className="muted">
                New classes will appear here after Admin approval.
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {courses.map((course) => (
                <div className="card" key={course.id}>
                  <div className="course-thumb">LIVE CLASS</div>

                  <h3>{course.title}</h3>

                  <div className="muted">
                    Teacher: {course.teacher.name}
                  </div>

                  <p className="muted">
                    {course.description}
                  </p>

                  <div className="meta">
                    <span>
                      Monthly Fee
                    </span>

                    <span className="price">
                      ₹{Number(course.monthlyFee).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Link
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    href={`/classes/${course.slug}`}
                  >
                    View Course
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}