"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Link2,
  Plus,
  Radio,
  Sparkles,
  Video,
  WalletCards,
} from "lucide-react";

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

      const [
        coursesResponse,
        sessionsResponse,
      ] = await Promise.all([
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

      const coursesData =
        await coursesResponse.json();

      const sessionsData =
        await sessionsResponse.json();

      if (Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);

        const approvedCourse =
          coursesData.courses.find(
            (course: Course) =>
              course.approvalStatus === "APPROVED" &&
              course.active
          );

        if (approvedCourse) {
          setSessionForm((previous) => ({
            ...previous,
            courseId:
              previous.courseId ||
              approvedCourse.id,
          }));
        }
      }

      if (Array.isArray(sessionsData.sessions)) {
        setSessions(sessionsData.sessions);
      }
    } catch (error) {
      console.error(
        "Load teacher dashboard error:",
        error
      );

      setMessage(
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCourseChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value,
    });
  }

  function handleSessionChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setSessionForm({
      ...sessionForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleCourseSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSavingCourse(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/teacher/courses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: courseForm.title,
            description: courseForm.description,
            monthlyFee: Number(
              courseForm.monthlyFee
            ),
            startDate:
              courseForm.startDate || null,
            startTime:
              courseForm.startTime || null,
            endTime:
              courseForm.endTime || null,
            schedule:
              courseForm.schedule || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Failed to create course."
        );
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
      console.error(
        "Create course error:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    } finally {
      setSavingCourse(false);
    }
  }

  async function handleSessionSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!sessionForm.courseId) {
      setMessage(
        "Please select an approved course."
      );
      return;
    }

    setSavingSession(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/teacher/sessions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId:
              sessionForm.courseId,
            title:
              sessionForm.title,
            startsAt:
              sessionForm.startsAt,
            endsAt:
              sessionForm.endsAt || null,
            joinUrl:
              sessionForm.joinUrl || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Failed to create live session."
        );
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
      console.error(
        "Create session error:",
        error
      );

      setMessage(
        "Something went wrong."
      );
    } finally {
      setSavingSession(false);
    }
  }

  const approvedCourses =
    courses.filter(
      (course) =>
        course.approvalStatus ===
          "APPROVED" &&
        course.active
    );

  const pendingCourses =
    courses.filter(
      (course) =>
        course.approvalStatus ===
        "PENDING"
    );

  const inactiveCourses =
    courses.filter(
      (course) => !course.active
    );

  const upcomingSessions =
    useMemo(() => {
      const current = new Date();

      return sessions.filter(
        (session) =>
          new Date(session.startsAt) >=
          current
      );
    }, [sessions]);

  const nextSession =
    upcomingSessions[0];

  if (loading) {
    return (
      <main className="teacher-loading">
        <div className="teacher-loader-card">
          <div className="loader-icon">
            <GraduationCap size={28} />
          </div>

          <h2>
            Loading Teacher Dashboard
          </h2>

          <p>
            Preparing your teaching workspace...
          </p>

          <div className="loader-bar" />
        </div>

        <style>{`
          .teacher-loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 30px;
            background:
              radial-gradient(
                circle at 20% 10%,
                rgba(99,102,241,.08),
                transparent 30%
              ),
              #f7f8fc;
          }

          .teacher-loader-card {
            width: min(420px, 100%);
            padding: 40px 30px;
            text-align: center;
            background: white;
            border: 1px solid #e7e9ef;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(15,23,42,.08);
          }

          .loader-icon {
            width: 62px;
            height: 62px;
            margin: 0 auto 18px;
            display: grid;
            place-items: center;
            color: #4f46e5;
            background: #eef2ff;
            border-radius: 18px;
          }

          .teacher-loader-card h2 {
            margin: 0;
            color: #111827;
          }

          .teacher-loader-card p {
            color: #64748b;
            margin: 8px 0 22px;
          }

          .loader-bar {
            width: 100%;
            height: 5px;
            overflow: hidden;
            border-radius: 99px;
            background: #e5e7eb;
            position: relative;
          }

          .loader-bar::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 42%;
            height: 100%;
            border-radius: inherit;
            background: #4f46e5;
            animation: teacherLoader 1.1s infinite ease-in-out;
          }

          @keyframes teacherLoader {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(250%);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="teacher-dashboard">
      <div className="teacher-container">

        {/* HERO */}

        <section className="teacher-hero">
          <div className="teacher-hero-content">
            <div className="teacher-badge">
              <Sparkles size={15} />
              Teacher Workspace
            </div>

            <h1>
              Teach.
              <br />
              <span>Inspire. Grow.</span>
            </h1>

            <p>
              Create powerful live courses,
              schedule classes and build your
              teaching journey on SkillClass.
            </p>

            <div className="teacher-hero-actions">
              <a
                href="#create-course"
                className="teacher-btn teacher-btn-light"
              >
                <Plus size={18} />
                Create Course
              </a>

              <a
                href="#live-sessions"
                className="teacher-btn teacher-btn-outline"
              >
                <Video size={17} />
                Manage Sessions
              </a>
            </div>
          </div>

          <div className="teacher-hero-visual">
            <div className="hero-circle hero-circle-one" />
            <div className="hero-circle hero-circle-two" />

            <div className="teacher-main-card">
              <div className="teacher-main-icon">
                <GraduationCap size={32} />
              </div>

              <div>
                <span>Your Teaching Hub</span>
                <strong>
                  SkillClass
                </strong>
              </div>

              <CheckCircle2
                size={23}
                className="teacher-check"
              />
            </div>

            <div className="teacher-floating teacher-floating-top">
              <BookOpen size={18} />

              <div>
                <strong>
                  {courses.length}
                </strong>

                <span>
                  Total Courses
                </span>
              </div>
            </div>

            <div className="teacher-floating teacher-floating-bottom">
              <Radio size={18} />

              <div>
                <strong>
                  {upcomingSessions.length}
                </strong>

                <span>
                  Upcoming Classes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MESSAGE */}

        {message && (
          <div
            className={`teacher-message ${
              message.toLowerCase().includes(
                "failed"
              ) ||
              message.toLowerCase().includes(
                "unable"
              ) ||
              message.toLowerCase().includes(
                "something"
              )
                ? "teacher-message-error"
                : "teacher-message-success"
            }`}
          >
            <CheckCircle2 size={18} />

            <span>{message}</span>
          </div>
        )}

        {/* STATS */}

        <section className="teacher-stats">
          <div className="teacher-stat">
            <div className="teacher-stat-icon purple">
              <BookOpen size={21} />
            </div>

            <div>
              <span>Total Courses</span>
              <strong>
                {courses.length}
              </strong>
            </div>
          </div>

          <div className="teacher-stat">
            <div className="teacher-stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <div>
              <span>Approved</span>
              <strong>
                {approvedCourses.length}
              </strong>
            </div>
          </div>

          <div className="teacher-stat">
            <div className="teacher-stat-icon orange">
              <Clock3 size={21} />
            </div>

            <div>
              <span>Pending Approval</span>
              <strong>
                {pendingCourses.length}
              </strong>
            </div>
          </div>

          <div className="teacher-stat">
            <div className="teacher-stat-icon blue">
              <Radio size={21} />
            </div>

            <div>
              <span>Live Sessions</span>
              <strong>
                {sessions.length}
              </strong>
            </div>
          </div>
        </section>

        {/* NEXT SESSION */}

        {nextSession && (
          <section className="teacher-section">
            <div className="teacher-section-heading">
              <div>
                <span className="teacher-eyebrow">
                  NEXT CLASS
                </span>

                <h2>
                  Your upcoming session
                </h2>
              </div>
            </div>

            <div className="next-teacher-class">
              <div>
                <div className="teacher-live-pill">
                  <span />
                  UPCOMING LIVE
                </div>

                <h3>
                  {nextSession.title}
                </h3>

                <p>
                  {nextSession.course.title}
                </p>

                <div className="teacher-class-time">
                  <CalendarDays size={17} />

                  {new Date(
                    nextSession.startsAt
                  ).toLocaleString(
                    "en-IN",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }
                  )}
                </div>
              </div>

              {nextSession.joinUrl && (
                <a
                  href={
                    nextSession.joinUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="teacher-primary-btn"
                >
                  <Video size={18} />
                  Open Live Class
                  <ArrowRight size={16} />
                </a>
              )}
            </div>
          </section>
        )}

        {/* CREATE COURSE */}

        <section
          id="create-course"
          className="teacher-section"
        >
          <div className="teacher-section-heading">
            <div>
              <span className="teacher-eyebrow">
                COURSE CREATOR
              </span>

              <h2>
                Create Your Course
              </h2>

              <p>
                Build your live course and
                submit it for Admin approval.
              </p>
            </div>

            <div className="section-heading-icon">
              <BookOpen size={22} />
            </div>
          </div>

          <div className="teacher-form-card">
            <form
              onSubmit={handleCourseSubmit}
            >
              <div className="form-grid">
                <div className="teacher-field full">
                  <label>
                    Course Title
                  </label>

                  <input
                    name="title"
                    value={
                      courseForm.title
                    }
                    onChange={
                      handleCourseChange
                    }
                    placeholder="Example: Class 10 Mathematics"
                    required
                  />
                </div>

                <div className="teacher-field full">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      courseForm.description
                    }
                    onChange={
                      handleCourseChange
                    }
                    placeholder="Describe what students will learn in your course..."
                    rows={5}
                    required
                  />
                </div>

                <div className="teacher-field">
                  <label>
                    Monthly Fee
                  </label>

                  <div className="input-with-prefix">
                    <span>₹</span>

                    <input
                      type="number"
                      name="monthlyFee"
                      value={
                        courseForm.monthlyFee
                      }
                      onChange={
                        handleCourseChange
                      }
                      placeholder="499"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="teacher-field">
                  <label>
                    Class Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      courseForm.startDate
                    }
                    onChange={
                      handleCourseChange
                    }
                  />
                </div>

                <div className="teacher-field">
                  <label>
                    Start Time
                  </label>

                  <input
                    type="time"
                    name="startTime"
                    value={
                      courseForm.startTime
                    }
                    onChange={
                      handleCourseChange
                    }
                  />
                </div>

                <div className="teacher-field">
                  <label>
                    End Time
                  </label>

                  <input
                    type="time"
                    name="endTime"
                    value={
                      courseForm.endTime
                    }
                    onChange={
                      handleCourseChange
                    }
                  />
                </div>

                <div className="teacher-field full">
                  <label>
                    Schedule
                  </label>

                  <input
                    name="schedule"
                    value={
                      courseForm.schedule
                    }
                    onChange={
                      handleCourseChange
                    }
                    placeholder="Example: Monday, Wednesday & Friday"
                  />
                </div>
              </div>

              <div className="form-footer">
                <div className="form-note">
                  <CheckCircle2 size={17} />

                  <span>
                    Your course will become
                    visible to students after
                    Admin approval.
                  </span>
                </div>

                <button
                  type="submit"
                  className="teacher-primary-btn"
                  disabled={
                    savingCourse
                  }
                >
                  {savingCourse ? (
                    <>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit for Approval
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* CREATE LIVE SESSION */}

        <section className="teacher-section">
          <div className="teacher-section-heading">
            <div>
              <span className="teacher-eyebrow">
                LIVE CLASS
              </span>

              <h2>
                Create Live Session
              </h2>

              <p>
                Schedule a live class for
                students enrolled in your
                approved course.
              </p>
            </div>

            <div className="section-heading-icon">
              <Video size={22} />
            </div>
          </div>

          {approvedCourses.length ===
          0 ? (
            <div className="teacher-empty">
              <div className="teacher-empty-icon">
                <Clock3 size={27} />
              </div>

              <h3>
                No approved courses yet
              </h3>

              <p>
                Your course must be approved
                by Admin before you can create
                a live session.
              </p>

              <a
                href="#create-course"
                className="teacher-secondary-btn"
              >
                Create a Course
                <ArrowRight size={16} />
              </a>
            </div>
          ) : (
            <div className="teacher-form-card">
              <form
                onSubmit={
                  handleSessionSubmit
                }
              >
                <div className="form-grid">
                  <div className="teacher-field full">
                    <label>
                      Select Approved Course
                    </label>

                    <select
                      name="courseId"
                      value={
                        sessionForm.courseId
                      }
                      onChange={
                        handleSessionChange
                      }
                      required
                    >
                      <option value="">
                        Select an approved
                        course
                      </option>

                      {approvedCourses.map(
                        (course) => (
                          <option
                            key={
                              course.id
                            }
                            value={
                              course.id
                            }
                          >
                            {course.title}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="teacher-field full">
                    <label>
                      Session Title
                    </label>

                    <input
                      name="title"
                      value={
                        sessionForm.title
                      }
                      onChange={
                        handleSessionChange
                      }
                      placeholder="Example: Mathematics Live Class - Algebra"
                      required
                    />
                  </div>

                  <div className="teacher-field">
                    <label>
                      Start Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      name="startsAt"
                      value={
                        sessionForm.startsAt
                      }
                      onChange={
                        handleSessionChange
                      }
                      required
                    />
                  </div>

                  <div className="teacher-field">
                    <label>
                      End Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      name="endsAt"
                      value={
                        sessionForm.endsAt
                      }
                      onChange={
                        handleSessionChange
                      }
                    />
                  </div>

                  <div className="teacher-field full">
                    <label>
                      Live Class URL
                    </label>

                    <div className="input-with-icon">
                      <Link2
                        size={18}
                      />

                      <input
                        type="url"
                        name="joinUrl"
                        value={
                          sessionForm.joinUrl
                        }
                        onChange={
                          handleSessionChange
                        }
                        placeholder="https://meet.google.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <div className="form-note">
                    <Radio size={17} />

                    <span>
                      Students with an active
                      subscription can join
                      this session.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="teacher-primary-btn"
                    disabled={
                      savingSession
                    }
                  >
                    {savingSession ? (
                      "Creating Session..."
                    ) : (
                      <>
                        Create Live Session
                        <Video size={17} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* LIVE SESSIONS */}

        <section
          id="live-sessions"
          className="teacher-section"
        >
          <div className="teacher-section-heading">
            <div>
              <span className="teacher-eyebrow">
                SCHEDULE
              </span>

              <h2>
                Your Live Sessions
              </h2>

              <p>
                Manage the live classes you
                have created.
              </p>
            </div>

            <div className="session-count">
              {sessions.length} Sessions
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="teacher-empty">
              <div className="teacher-empty-icon">
                <Video size={27} />
              </div>

              <h3>
                No live sessions yet
              </h3>

              <p>
                Create your first live session
                for an approved course.
              </p>
            </div>
          ) : (
            <div className="session-list">
              {sessions.map(
                (session) => {
                  const isUpcoming =
                    new Date(
                      session.startsAt
                    ) >= new Date();

                  return (
                    <div
                      className="session-card"
                      key={session.id}
                    >
                      <div className="session-icon">
                        <Video size={22} />
                      </div>

                      <div className="session-info">
                        <div className="session-top">
                          <span
                            className={
                              isUpcoming
                                ? "session-status upcoming"
                                : "session-status"
                            }
                          >
                            {isUpcoming
                              ? "UPCOMING"
                              : "COMPLETED"}
                          </span>
                        </div>

                        <h3>
                          {session.title}
                        </h3>

                        <p>
                          {session.course.title}
                        </p>

                        <div className="session-meta">
                          <span>
                            <CalendarDays
                              size={14}
                            />

                            {new Date(
                              session.startsAt
                            ).toLocaleString(
                              "en-IN",
                              {
                                dateStyle:
                                  "medium",
                                timeStyle:
                                  "short",
                              }
                            )}
                          </span>

                          {session.endsAt && (
                            <span>
                              <Clock3
                                size={14}
                              />

                              Ends{" "}
                              {new Date(
                                session.endsAt
                              ).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour:
                                    "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {session.joinUrl && (
                        <a
                          href={
                            session.joinUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="session-open-btn"
                        >
                          <Video
                            size={16}
                          />
                          Open Class
                        </a>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* COURSE STATUS */}

        <section className="teacher-section">
          <div className="teacher-section-heading">
            <div>
              <span className="teacher-eyebrow">
                YOUR COURSES
              </span>

              <h2>
                Course Status
              </h2>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="teacher-empty">
              <div className="teacher-empty-icon">
                <BookOpen size={27} />
              </div>

              <h3>
                No courses created
              </h3>

              <p>
                Your courses will appear here
                after creation.
              </p>
            </div>
          ) : (
            <div className="course-status-grid">
              {courses.map(
                (course) => {
                  const approved =
                    course.approvalStatus ===
                      "APPROVED" &&
                    course.active;

                  const pending =
                    course.approvalStatus ===
                    "PENDING";

                  return (
                    <div
                      className="course-status-card"
                      key={course.id}
                    >
                      <div className="course-status-icon">
                        <GraduationCap
                          size={22}
                        />
                      </div>

                      <div className="course-status-content">
                        <h3>
                          {course.title}
                        </h3>

                        <span
                          className={
                            approved
                              ? "course-status approved"
                              : pending
                              ? "course-status pending"
                              : "course-status other"
                          }
                        >
                          {approved
                            ? "APPROVED"
                            : course.approvalStatus}
                        </span>
                      </div>

                      <div
                        className={
                          approved
                            ? "course-dot active"
                            : "course-dot"
                        }
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* TEACHER EARNINGS PREVIEW */}

        <section className="teacher-earnings">
          <div>
            <div className="earnings-icon">
              <WalletCards size={25} />
            </div>

            <div>
              <span>
                TEACHER EARNINGS
              </span>

              <h2>
                Your SkillClass teaching
                journey
              </h2>

              <p>
                Student course payments and
                teacher settlements are managed
                through the SkillClass platform.
              </p>
            </div>
          </div>

          <div className="earnings-note">
            <CheckCircle2 size={18} />

            <span>
              Your teacher share is handled
              through the platform wallet.
            </span>
          </div>
        </section>
      </div>

      <style>{`
        .teacher-dashboard {
          min-height: 100vh;
          padding: 34px 0 80px;
          background:
            radial-gradient(
              circle at 8% 3%,
              rgba(99,102,241,.08),
              transparent 27%
            ),
            #f7f8fc;
        }

        .teacher-container {
          width: min(1180px, calc(100% - 36px));
          margin: 0 auto;
        }

        .teacher-hero {
          min-height: 380px;
          overflow: hidden;
          position: relative;
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          border-radius: 30px;
          background:
            radial-gradient(
              circle at 80% 20%,
              rgba(255,255,255,.17),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #312e81,
              #4f46e5 52%,
              #7c3aed
            );
          box-shadow:
            0 25px 60px
            rgba(49,46,129,.2);
        }

        .teacher-hero-content {
          position: relative;
          z-index: 4;
          padding: 52px;
        }

        .teacher-badge {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 13px;
          color: white;
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          font-size: 13px;
          font-weight: 750;
        }

        .teacher-hero h1 {
          margin: 23px 0 15px;
          color: white;
          font-size: clamp(42px, 5vw, 60px);
          line-height: 1.02;
          letter-spacing: -.05em;
        }

        .teacher-hero h1 span {
          color: #ddd6fe;
        }

        .teacher-hero p {
          max-width: 590px;
          margin: 0;
          color: rgba(255,255,255,.77);
          font-size: 16px;
          line-height: 1.7;
        }

        .teacher-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 29px;
        }

        .teacher-btn {
          min-height: 47px;
          padding: 0 17px;
          border-radius: 11px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 750;
          transition: .2s ease;
        }

        .teacher-btn:hover,
        .teacher-primary-btn:hover,
        .teacher-secondary-btn:hover,
        .session-open-btn:hover {
          transform: translateY(-2px);
        }

        .teacher-btn-light {
          color: #312e81;
          background: white;
        }

        .teacher-btn-outline {
          color: white;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.25);
        }

        .teacher-hero-visual {
          min-height: 380px;
          position: relative;
          overflow: hidden;
        }

        .hero-circle {
          position: absolute;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 50%;
        }

        .hero-circle-one {
          width: 320px;
          height: 320px;
          right: -70px;
          top: 25px;
        }

        .hero-circle-two {
          width: 185px;
          height: 185px;
          right: 90px;
          bottom: -80px;
        }

        .teacher-main-card {
          position: absolute;
          z-index: 4;
          top: 105px;
          right: 55px;
          width: 285px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 13px;
          background: rgba(255,255,255,.96);
          border-radius: 18px;
          box-shadow:
            0 25px 50px
            rgba(15,23,42,.18);
        }

        .teacher-main-icon {
          width: 50px;
          height: 50px;
          flex: 0 0 50px;
          display: grid;
          place-items: center;
          color: #6d28d9;
          background: #ede9fe;
          border-radius: 14px;
        }

        .teacher-main-card span,
        .teacher-floating span {
          display: block;
          color: #64748b;
          font-size: 12px;
        }

        .teacher-main-card strong {
          display: block;
          color: #111827;
          margin-top: 3px;
        }

        .teacher-check {
          margin-left: auto;
          color: #16a34a;
        }

        .teacher-floating {
          position: absolute;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 15px;
          background: rgba(255,255,255,.94);
          border-radius: 14px;
          color: #4f46e5;
          box-shadow:
            0 15px 35px
            rgba(15,23,42,.14);
        }

        .teacher-floating strong {
          display: block;
          color: #111827;
          font-size: 14px;
        }

        .teacher-floating-top {
          right: 20px;
          top: 48px;
        }

        .teacher-floating-bottom {
          right: 90px;
          bottom: 45px;
        }

        .teacher-message {
          margin-top: 18px;
          padding: 14px 17px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 13px;
          font-size: 14px;
          font-weight: 650;
        }

        .teacher-message-success {
          color: #166534;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .teacher-message-error {
          color: #b91c1c;
          background: #fef2f2;
          border: 1px solid #fecaca;
        }

        .teacher-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 20px;
        }

        .teacher-stat {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          background: white;
          border: 1px solid #e7e9ef;
          border-radius: 18px;
          box-shadow:
            0 7px 25px
            rgba(15,23,42,.04);
        }

        .teacher-stat-icon {
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          display: grid;
          place-items: center;
          border-radius: 13px;
        }

        .teacher-stat-icon.purple {
          color: #6d28d9;
          background: #ede9fe;
        }

        .teacher-stat-icon.green {
          color: #16a34a;
          background: #dcfce7;
        }

        .teacher-stat-icon.orange {
          color: #ea580c;
          background: #ffedd5;
        }

        .teacher-stat-icon.blue {
          color: #2563eb;
          background: #dbeafe;
        }

        .teacher-stat span {
          display: block;
          color: #64748b;
          font-size: 12px;
          font-weight: 650;
        }

        .teacher-stat strong {
          display: block;
          color: #111827;
          font-size: 25px;
          margin-top: 2px;
        }

        .teacher-section {
          margin-top: 48px;
        }

        .teacher-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .teacher-eyebrow {
          color: #6366f1;
          font-size: 11px;
          font-weight: 850;
          letter-spacing: .14em;
        }

        .teacher-section-heading h2 {
          margin: 6px 0 5px;
          color: #111827;
          font-size: 29px;
          letter-spacing: -.03em;
        }

        .teacher-section-heading p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .next-teacher-class {
          padding: 25px 27px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-radius: 21px;
          border: 1px solid #ddd6fe;
          background:
            linear-gradient(
              135deg,
              #eef2ff,
              #f5f3ff
            );
        }

        .teacher-live-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #dc2626;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .1em;
        }

        .teacher-live-pill span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ef4444;
        }

        .next-teacher-class h3 {
          margin: 9px 0 5px;
          color: #111827;
          font-size: 22px;
        }

        .next-teacher-class p {
          margin: 0;
          color: #64748b;
        }

        .teacher-class-time {
          margin-top: 13px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #4f46e5;
          font-size: 13px;
          font-weight: 700;
        }

        .teacher-primary-btn {
          min-height: 46px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          border-radius: 11px;
          color: white;
          background: #4f46e5;
          text-decoration: none;
          font-weight: 750;
          cursor: pointer;
          transition: .2s ease;
        }

        .teacher-primary-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
        }

        .teacher-form-card {
          padding: 28px;
          background: white;
          border: 1px solid #e7e9ef;
          border-radius: 22px;
          box-shadow:
            0 8px 30px
            rgba(15,23,42,.045);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 19px;
        }

        .teacher-field {
          min-width: 0;
        }

        .teacher-field.full {
          grid-column: 1 / -1;
        }

        .teacher-field label {
          display: block;
          margin-bottom: 7px;
          color: #334155;
          font-size: 13px;
          font-weight: 750;
        }

        .teacher-field input,
        .teacher-field textarea,
        .teacher-field select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #dce1e9;
          border-radius: 11px;
          background: #fff;
          color: #111827;
          padding: 12px 13px;
          font: inherit;
          font-size: 14px;
          outline: none;
          transition: .18s ease;
        }

        .teacher-field textarea {
          resize: vertical;
          min-height: 125px;
        }

        .teacher-field input:focus,
        .teacher-field textarea:focus,
        .teacher-field select:focus {
          border-color: #818cf8;
          box-shadow:
            0 0 0 3px
            rgba(99,102,241,.1);
        }

        .teacher-field input::placeholder,
        .teacher-field textarea::placeholder {
          color: #a0a8b6;
        }

        .input-with-prefix,
        .input-with-icon {
          display: flex;
          align-items: center;
          overflow: hidden;
          border: 1px solid #dce1e9;
          border-radius: 11px;
          background: white;
        }

        .input-with-prefix:focus-within,
        .input-with-icon:focus-within {
          border-color: #818cf8;
          box-shadow:
            0 0 0 3px
            rgba(99,102,241,.1);
        }

        .input-with-prefix span {
          padding-left: 13px;
          color: #4f46e5;
          font-weight: 800;
        }

        .input-with-prefix input,
        .input-with-icon input {
          border: none;
          box-shadow: none;
        }

        .input-with-prefix input:focus,
        .input-with-icon input:focus {
          box-shadow: none;
        }

        .input-with-icon {
          padding-left: 13px;
          color: #6366f1;
        }

        .input-with-icon input {
          padding-left: 9px;
        }

        .form-footer {
          margin-top: 25px;
          padding-top: 21px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          border-top: 1px solid #eef0f4;
        }

        .form-note {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        }

        .form-note svg {
          flex: 0 0 auto;
          color: #16a34a;
        }

        .section-heading-icon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 13px;
        }

        .teacher-empty {
          padding: 48px 25px;
          text-align: center;
          background: white;
          border: 1px dashed #d8dce5;
          border-radius: 21px;
        }

        .teacher-empty-icon {
          width: 59px;
          height: 59px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          color: #6366f1;
          background: #eef2ff;
          border-radius: 17px;
        }

        .teacher-empty h3 {
          margin: 0 0 7px;
          color: #111827;
        }

        .teacher-empty p {
          max-width: 500px;
          margin: 0 auto;
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .teacher-secondary-btn {
          width: fit-content;
          margin: 19px auto 0;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
          transition: .2s ease;
        }

        .session-count {
          padding: 8px 11px;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 800;
        }

        .session-list {
          display: grid;
          gap: 12px;
        }

        .session-card {
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          background: white;
          border: 1px solid #e7e9ef;
          border-radius: 17px;
          box-shadow:
            0 5px 20px
            rgba(15,23,42,.035);
        }

        .session-icon {
          width: 45px;
          height: 45px;
          flex: 0 0 45px;
          display: grid;
          place-items: center;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 12px;
        }

        .session-info {
          flex: 1;
          min-width: 0;
        }

        .session-top {
          margin-bottom: 5px;
        }

        .session-status {
          padding: 4px 7px;
          border-radius: 999px;
          color: #64748b;
          background: #f1f5f9;
          font-size: 9px;
          font-weight: 850;
        }

        .session-status.upcoming {
          color: #15803d;
          background: #dcfce7;
        }

        .session-info h3 {
          margin: 0;
          color: #111827;
          font-size: 16px;
        }

        .session-info p {
          margin: 4px 0 8px;
          color: #64748b;
          font-size: 13px;
        }

        .session-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          color: #64748b;
          font-size: 11px;
        }

        .session-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .session-open-btn {
          min-height: 39px;
          padding: 0 12px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #4f46e5;
          background: #eef2ff;
          border-radius: 9px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 750;
          white-space: nowrap;
          transition: .2s ease;
        }

        .course-status-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 13px;
        }

        .course-status-card {
          padding: 17px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #e7e9ef;
          border-radius: 16px;
        }

        .course-status-icon {
          width: 43px;
          height: 43px;
          flex: 0 0 43px;
          display: grid;
          place-items: center;
          color: #6d28d9;
          background: #ede9fe;
          border-radius: 11px;
        }

        .course-status-content {
          flex: 1;
          min-width: 0;
        }

        .course-status-content h3 {
          margin: 0 0 6px;
          color: #111827;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .course-status {
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 850;
        }

        .course-status.approved {
          color: #15803d;
          background: #dcfce7;
        }

        .course-status.pending {
          color: #b45309;
          background: #fef3c7;
        }

        .course-status.other {
          color: #64748b;
          background: #f1f5f9;
        }

        .course-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #cbd5e1;
        }

        .course-dot.active {
          background: #22c55e;
          box-shadow:
            0 0 0 4px
            rgba(34,197,94,.1);
        }

        .teacher-earnings {
          margin-top: 48px;
          padding: 27px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              #18181b,
              #312e81
            );
          color: white;
        }

        .teacher-earnings > div:first-child {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .earnings-icon {
          width: 53px;
          height: 53px;
          flex: 0 0 53px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: rgba(255,255,255,.1);
        }

        .teacher-earnings span {
          font-size: 10px;
          font-weight: 850;
          letter-spacing: .12em;
          color: #c4b5fd;
        }

        .teacher-earnings h2 {
          margin: 5px 0;
          font-size: 21px;
        }

        .teacher-earnings p {
          margin: 0;
          color: rgba(255,255,255,.68);
          font-size: 13px;
        }

        .earnings-note {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 13px;
          color: #ddd6fe;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          font-size: 11px;
          letter-spacing: normal !important;
          white-space: nowrap;
        }

        @media (max-width: 1000px) {
          .teacher-hero {
            grid-template-columns: 1fr;
          }

          .teacher-hero-visual {
            min-height: 220px;
          }

          .teacher-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .teacher-main-card {
            top: 30px;
            right: 50%;
            transform: translateX(50%);
          }

          .teacher-floating-top {
            top: 12px;
            right: 15px;
          }

          .teacher-floating-bottom {
            right: 30px;
            bottom: 15px;
          }
        }

        @media (max-width: 720px) {
          .teacher-dashboard {
            padding-top: 20px;
          }

          .teacher-container {
            width: min(
              100% - 24px,
              1180px
            );
          }

          .teacher-hero {
            border-radius: 22px;
          }

          .teacher-hero-content {
            padding: 32px 24px;
          }

          .teacher-hero h1 {
            font-size: 40px;
          }

          .teacher-hero-actions {
            flex-direction: column;
          }

          .teacher-btn {
            width: 100%;
          }

          .teacher-stats {
            grid-template-columns: 1fr 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .teacher-field.full {
            grid-column: auto;
          }

          .form-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .teacher-primary-btn {
            width: 100%;
          }

          .next-teacher-class {
            align-items: flex-start;
            flex-direction: column;
          }

          .next-teacher-class .teacher-primary-btn {
            width: 100%;
          }

          .session-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .session-open-btn {
            width: 100%;
            justify-content: center;
          }

          .course-status-grid {
            grid-template-columns: 1fr;
          }

          .teacher-earnings {
            align-items: flex-start;
            flex-direction: column;
          }

          .earnings-note {
            white-space: normal;
          }
        }

        @media (max-width: 430px) {
          .teacher-stats {
            grid-template-columns: 1fr;
          }

          .teacher-form-card {
            padding: 20px;
          }

          .teacher-main-card {
            width: 245px;
          }

          .teacher-floating-bottom {
            left: 15px;
            right: auto;
          }

          .teacher-section-heading h2 {
            font-size: 25px;
          }
        }
      `}</style>
    </main>
  );
}