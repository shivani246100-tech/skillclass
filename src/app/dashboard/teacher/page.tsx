"use client";

import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  approvalStatus: string;
  active: boolean;
};

type LiveSession = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  joinUrl: string | null;
  course: {
    id: string;
    title: string;
  };
};

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [savingSession, setSavingSession] = useState(false);
  const [message, setMessage] = useState("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<LiveSession[]>([]);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    monthlyFee: "",
    startDate: "",
    startTime: "",
    endTime: "",
    schedule: "",
  });

  const [sessionForm, setSessionForm] = useState({
    courseId: "",
    title: "",
    startsAt: "",
    endsAt: "",
    joinUrl: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setMessage("");

      const [coursesResponse, sessionsResponse] = await Promise.all([
        fetch("/api/teacher/courses", {
          method: "GET",
          cache: "no-store",
        }),
        fetch("/api/teacher/sessions", {
          method: "GET",
          cache: "no-store",
        }),
      ]);

      if (!coursesResponse.ok) {
        setMessage("Unable to load your courses.");
        return;
      }

      if (!sessionsResponse.ok) {
        setMessage("Unable to load your live sessions.");
        return;
      }

      const coursesData = await coursesResponse.json();
      const sessionsData = await sessionsResponse.json();

      if (Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);

        const approvedCourse = coursesData.courses.find(
          (course: Course) =>
            course.approvalStatus === "APPROVED" && course.active
        );

        if (approvedCourse) {
          setSessionForm((previous) => ({
            ...previous,
            courseId: previous.courseId || approvedCourse.id,
          }));
        }
      }

      if (Array.isArray(sessionsData.sessions)) {
        setSessions(sessionsData.sessions);
      }
    } catch (error) {
      console.error("Load teacher dashboard error:", error);
      setMessage("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  function handleCourseChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value,
    });
  }

  function handleSessionChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setSessionForm({
      ...sessionForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCourseSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSavingCourse(true);
    setMessage("");

    try {
      const response = await fetch("/api/teacher/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: courseForm.title,
          description: courseForm.description,
          monthlyFee: Number(courseForm.monthlyFee),
          startDate: courseForm.startDate || null,
          startTime: courseForm.startTime || null,
          endTime: courseForm.endTime || null,
          schedule: courseForm.schedule || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to create course.");
        return;
      }

      setMessage(
        "Course submitted successfully! Admin approval is pending."
      );

      setCourseForm({
        title: "",
        description: "",
        monthlyFee: "",
        startDate: "",
        startTime: "",
        endTime: "",
        schedule: "",
      });

      await loadData();
    } catch (error) {
      console.error("Create course error:", error);
      setMessage("Something went wrong.");
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleSessionSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!sessionForm.courseId) {
      setMessage("Please select an approved course.");
      return;
    }

    setSavingSession(true);
    setMessage("");

    try {
      const response = await fetch("/api/teacher/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: sessionForm.courseId,
          title: sessionForm.title,
          startsAt: sessionForm.startsAt,
          endsAt: sessionForm.endsAt || null,
          joinUrl: sessionForm.joinUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to create live session.");
        return;
      }

      setMessage(
        "Live session created successfully! Students with an active subscription can join it."
      );

      setSessionForm((previous) => ({
        ...previous,
        title: "",
        startsAt: "",
        endsAt: "",
        joinUrl: "",
      }));

      await loadData();
    } catch (error) {
      console.error("Create session error:", error);
      setMessage("Something went wrong.");
    } finally {
      setSavingSession(false);
    }
  }

  const approvedCourses = courses.filter(
    (course) =>
      course.approvalStatus === "APPROVED" && course.active
  );

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <h2>Loading Teacher Dashboard...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div
        className="container"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "24px",
              borderRadius: "8px",
              background: "#eef6ff",
            }}
          >
            {message}
          </div>
        )}

        {/* CREATE COURSE */}

        <div className="feature-panel">
          <h1>Create Your Course</h1>

          <p>
            Create your live class and submit it for Admin
            approval. Students will be able to see the course
            after approval.
          </p>

          <form onSubmit={handleCourseSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label>Course Title</label>

              <input
                name="title"
                value={courseForm.title}
                onChange={handleCourseChange}
                placeholder="Example: Class 10 Mathematics"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Description</label>

              <textarea
                name="description"
                value={courseForm.description}
                onChange={handleCourseChange}
                placeholder="Describe your course..."
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Monthly Fee (₹)</label>

              <input
                type="number"
                name="monthlyFee"
                value={courseForm.monthlyFee}
                onChange={handleCourseChange}
                placeholder="Example: 499"
                min="1"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Class Start Date</label>

              <input
                type="date"
                name="startDate"
                value={courseForm.startDate}
                onChange={handleCourseChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label>Start Time</label>

                <input
                  type="time"
                  name="startTime"
                  value={courseForm.startTime}
                  onChange={handleCourseChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div>
                <label>End Time</label>

                <input
                  type="time"
                  name="endTime"
                  value={courseForm.endTime}
                  onChange={handleCourseChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Schedule</label>

              <input
                name="schedule"
                value={courseForm.schedule}
                onChange={handleCourseChange}
                placeholder="Example: Monday, Wednesday & Friday"
                style={{
                  width: "100%",
                  padding: "12px",
                  marginTop: "6px",
                }}
              />
            </div>

            <button
              type="submit"
              className="btn"
              disabled={savingCourse}
            >
              {savingCourse
                ? "Submitting..."
                : "Submit Course for Approval"}
            </button>
          </form>
        </div>

        {/* LIVE SESSION */}

        <div
          className="feature-panel"
          style={{ marginTop: "30px" }}
        >
          <h2>Create Live Session</h2>

          <p>
            Create a live class session for one of your approved
            courses.
          </p>

          {approvedCourses.length === 0 ? (
            <div className="card">
              <h3>No approved courses</h3>

              <p className="muted">
                Your course must be approved by Admin before you
                can create a live session.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSessionSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label>Select Course</label>

                <select
                  name="courseId"
                  value={sessionForm.courseId}
                  onChange={handleSessionChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                >
                  <option value="">
                    Select an approved course
                  </option>

                  {approvedCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label>Session Title</label>

                <input
                  name="title"
                  value={sessionForm.title}
                  onChange={handleSessionChange}
                  placeholder="Example: Mathematics Live Class - Algebra"
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label>Start Date & Time</label>

                <input
                  type="datetime-local"
                  name="startsAt"
                  value={sessionForm.startsAt}
                  onChange={handleSessionChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label>End Date & Time</label>

                <input
                  type="datetime-local"
                  name="endsAt"
                  value={sessionForm.endsAt}
                  onChange={handleSessionChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Live Class URL</label>

                <input
                  type="url"
                  name="joinUrl"
                  value={sessionForm.joinUrl}
                  onChange={handleSessionChange}
                  placeholder="https://..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingSession}
              >
                {savingSession
                  ? "Creating Session..."
                  : "Create Live Session"}
              </button>
            </form>
          )}
        </div>

        {/* LIVE SESSIONS LIST */}

        <div
          className="feature-panel"
          style={{ marginTop: "30px" }}
        >
          <h2>Your Live Sessions</h2>

          {sessions.length === 0 ? (
            <div className="card">
              <p className="muted">
                No live sessions created yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {sessions.map((session) => (
                <div className="card" key={session.id}>
                  <h3>{session.title}</h3>

                  <p className="muted">
                    Course: {session.course.title}
                  </p>

                  <p>
                    <strong>Starts:</strong>{" "}
                    {new Date(session.startsAt).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {session.endsAt && (
                    <p>
                      <strong>Ends:</strong>{" "}
                      {new Date(session.endsAt).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  )}

                  {session.joinUrl && (
                    <a
                      href={session.joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Open Live Class
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}