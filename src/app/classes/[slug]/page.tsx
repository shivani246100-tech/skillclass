import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import BuyCourseButton from "@/components/BuyCourseButton";

export default async function CourseDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findFirst({
    where: {
      slug,
      approvalStatus: "APPROVED",
      active: true,
    },
    include: {
      teacher: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="section">
        <div className="container">
          <div className="card">
            <div className="course-thumb">LIVE CLASS</div>

            <h1>{course.title}</h1>

            <p className="muted">
              {course.description}
            </p>

            <div
              className="card"
              style={{ marginTop: 20 }}
            >
              <h2>Course Details</h2>

              <p>
                <strong>Teacher:</strong>{" "}
                {course.teacher.name}
              </p>

              <p>
                <strong>Monthly Fee:</strong>{" "}
                ₹{Number(course.monthlyFee).toLocaleString("en-IN")}
              </p>

              {course.schedule && (
                <p>
                  <strong>Schedule:</strong>{" "}
                  {course.schedule}
                </p>
              )}

              {course.startTime && (
                <p>
                  <strong>Start Time:</strong>{" "}
                  {course.startTime}
                </p>
              )}

              {course.endTime && (
                <p>
                  <strong>End Time:</strong>{" "}
                  {course.endTime}
                </p>
              )}

              <BuyCourseButton
                courseId={course.id}
                price={course.monthlyFee}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}