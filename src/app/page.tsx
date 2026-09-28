import Link from "next/link";
import {
  BookOpen,
  Video,
  ShieldCheck,
  WalletCards,
  Users,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  PlayCircle,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const courses = [
  {
    title: "SSC Maths Live Batch",
    teacher: "Demo Teacher",
    fee: "₹499/month",
    schedule: "Mon–Sat · 7:00 PM",
  },
  {
    title: "UPSC Foundation",
    teacher: "Expert Faculty",
    fee: "₹799/month",
    schedule: "Mon–Fri · 8:00 PM",
  },
  {
    title: "English Communication",
    teacher: "Skill Trainer",
    fee: "₹399/month",
    schedule: "Tue–Sun · 6:00 PM",
  },
];

const pdfs = [
  {
    title: "SSC Maths Complete Notes",
    seller: "Demo Seller",
    price: "₹99",
  },
  {
    title: "General Knowledge Capsule",
    seller: "SkillClass Store",
    price: "₹149",
  },
  {
    title: "English Practice Workbook",
    seller: "Study Resources",
    price: "₹199",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* =====================================================
            HERO SECTION
        ===================================================== */}

        <section className="hero">
          <div className="container hero-grid">

            {/* LEFT SIDE */}
            <div className="hero-content">

              <div className="badge">
                <Sparkles size={15} />
                India&apos;s Modern Learning Platform
              </div>

              <h1>
                Learn Skills.
                <br />
                Learn From <span>Experts.</span>
                <br />
                Grow With SkillClass.
              </h1>

              <p className="hero-description">
                Join live classes from expert teachers, discover useful PDF
                books, and build your skills with a simple and trusted
                learning platform.
              </p>

              <div className="hero-actions">

                <Link
                  href="/register"
                  className="btn btn-primary"
                >
                  Start Learning
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/dashboard/student"
                  className="btn btn-outline"
                >
                  Explore Classes
                  <PlayCircle size={18} />
                </Link>

              </div>

              <div className="hero-features">

                <div>
                  <CheckCircle2 size={17} />
                  Live Classes
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  PDF Books
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  Secure Payments
                </div>

              </div>

            </div>


            {/* =================================================
                RIGHT SIDE - STUDENT LEARNING VISUAL
            ================================================= */}

            <div className="hero-visual">

              <div className="learning-glow"></div>

              <div className="study-scene">

                {/* Floating Book 1 */}

                <div className="float-book float-book-1">
                  <div className="float-book-page"></div>
                  <div className="float-book-cover"></div>
                </div>


                {/* Floating Book 2 */}

                <div className="float-book float-book-2">
                  <div className="float-book-page"></div>
                  <div className="float-book-cover"></div>
                </div>


                {/* Graduation Cap */}

                <div className="float-cap">

                  <div className="cap-diamond"></div>

                  <div className="cap-board"></div>

                  <div className="cap-tassel"></div>

                </div>


                {/* =================================================
                    STUDENT
                ================================================= */}

                <div className="student">

                  <div className="student-head">

                    <div className="student-hair"></div>

                    <div className="student-face">

                      <span className="eye eye-left"></span>

                      <span className="eye eye-right"></span>

                      <span className="nose"></span>

                      <span className="smile"></span>

                    </div>

                  </div>


                  <div className="student-neck"></div>


                  <div className="student-body">

                    <div className="student-shirt">
                      <span>SC</span>
                    </div>

                    <div className="student-arm arm-left"></div>

                    <div className="student-arm arm-right"></div>

                  </div>

                </div>


                {/* =================================================
                    LAPTOP
                ================================================= */}

                <div className="laptop">

                  <div className="laptop-screen">

                    <div className="screen-top">

                      <span></span>
                      <span></span>
                      <span></span>

                    </div>


                    <div className="screen-content">

                      <div className="lesson-title"></div>

                      <div className="screen-line long"></div>

                      <div className="screen-line medium"></div>

                      <div className="screen-line short"></div>


                      <div className="screen-video">

                        <span className="play-icon"></span>

                      </div>

                    </div>

                  </div>


                  <div className="laptop-base">

                    <div className="trackpad"></div>

                  </div>

                </div>


                {/* =================================================
                    BOOKS ON DESK
                ================================================= */}

                <div className="desk-book book-blue"></div>

                <div className="desk-book book-purple"></div>


                {/* =================================================
                    DESK
                ================================================= */}

                <div className="study-desk">

                  <div className="desk-leg desk-leg-left"></div>

                  <div className="desk-leg desk-leg-right"></div>

                </div>

              </div>


              {/* Small Caption */}

              <div className="visual-caption">

                <div className="caption-icon">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <strong>
                    Learn. Practice. Grow.
                  </strong>

                  <span>
                    Everything for your learning journey.
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="stats-section">

          <div className="container stats-grid">

            <div className="stat-item">
              <strong>10K+</strong>
              <span>Learners</span>
            </div>

            <div className="stat-item">
              <strong>500+</strong>
              <span>Live Classes</span>
            </div>

            <div className="stat-item">
              <strong>1K+</strong>
              <span>PDF Resources</span>
            </div>

            <div className="stat-item">
              <strong>100%</strong>
              <span>Secure Platform</span>
            </div>

          </div>

        </section>


        {/* =====================================================
            LIVE CLASSES
        ===================================================== */}

        <section className="section">

          <div className="container">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  LEARN LIVE
                </span>

                <h2>
                  Popular Live Classes
                </h2>

                <p>
                  Learn directly from teachers through structured live
                  classes.
                </p>
              </div>

              <Link
                href="/dashboard/student"
                className="section-link"
              >
                View Classes
                <ArrowRight size={16} />
              </Link>

            </div>


            <div className="course-grid">

              {courses.map((course) => (

                <div
                  className="course-card"
                  key={course.title}
                >

                  <div className="course-thumb">

                    <div className="course-thumb-icon">
                      <Video size={22} />
                    </div>

                  </div>


                  <div className="course-content">

                    <span className="course-tag">
                      LIVE CLASS
                    </span>

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.teacher}
                    </p>

                    <div className="course-meta">

                      <span>
                        {course.schedule}
                      </span>

                      <strong>
                        {course.fee}
                      </strong>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            PDF BOOKS
        ===================================================== */}

        <section className="section section-soft">

          <div className="container">

            <div className="section-heading">

              <div>

                <span className="section-kicker">
                  DIGITAL RESOURCES
                </span>

                <h2>
                  Featured PDF Books
                </h2>

                <p>
                  Get useful study resources from SkillClass sellers.
                </p>

              </div>

              <Link
                href="/dashboard/student"
                className="section-link"
              >
                Explore PDFs
                <ArrowRight size={16} />
              </Link>

            </div>


            <div className="pdf-grid">

              {pdfs.map((pdf) => (

                <div
                  className="pdf-card"
                  key={pdf.title}
                >

                  <div className="pdf-cover">

                    <BookOpen size={30} />

                    <span>
                      PDF
                    </span>

                  </div>


                  <div className="pdf-content">

                    <h3>
                      {pdf.title}
                    </h3>

                    <p>
                      {pdf.seller}
                    </p>

                    <div className="pdf-bottom">

                      <strong>
                        {pdf.price}
                      </strong>

                      <ArrowRight size={17} />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="section">

          <div className="container">

            <div className="section-heading centered">

              <span className="section-kicker">
                SIMPLE PROCESS
              </span>

              <h2>
                How SkillClass Works
              </h2>

              <p>
                Everything is designed to make learning simple.
              </p>

            </div>


            <div className="steps">

              <div className="step-card">

                <div className="step-number">
                  01
                </div>

                <div className="step-icon">
                  <Users size={23} />
                </div>

                <h3>
                  Create Account
                </h3>

                <p>
                  Register as a student, teacher or seller.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  02
                </div>

                <div className="step-icon">
                  <BookOpen size={23} />
                </div>

                <h3>
                  Choose Learning
                </h3>

                <p>
                  Explore live classes and digital PDF resources.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  03
                </div>

                <div className="step-icon">
                  <WalletCards size={23} />
                </div>

                <h3>
                  Pay Securely
                </h3>

                <p>
                  Complete your payment through the platform.
                </p>

              </div>


              <div className="step-card">

                <div className="step-number">
                  04
                </div>

                <div className="step-icon">
                  <GraduationCap size={23} />
                </div>

                <h3>
                  Start Learning
                </h3>

                <p>
                  Join your class and continue your learning journey.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            TEACHER + SELLER
        ===================================================== */}

        <section className="section section-soft">

          <div className="container split">

            <div className="feature-panel teacher-panel">

              <div className="feature-icon">
                <Video size={25} />
              </div>

              <span className="section-kicker">
                FOR TEACHERS
              </span>

              <h2>
                Teach What You Know
              </h2>

              <p>
                Create live classes, choose your schedule and monthly fee,
                and connect with students through SkillClass.
              </p>

              <div className="feature-list">

                <div>
                  <CheckCircle2 size={18} />
                  Create live classes
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Set your class timing
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Set monthly fees
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Track your earnings
                </div>

              </div>

              <Link
                href="/register"
                className="btn btn-primary"
              >
                Become a Teacher
                <ArrowRight size={17} />
              </Link>

            </div>


            <div className="feature-panel seller-panel">

              <div className="feature-icon">
                <BookOpen size={25} />
              </div>

              <span className="section-kicker">
                FOR SELLERS
              </span>

              <h2>
                Sell Your Digital Knowledge
              </h2>

              <p>
                Upload useful PDF books and study resources and sell them
                digitally to students.
              </p>

              <div className="feature-list">

                <div>
                  <CheckCircle2 size={18} />
                  Upload PDF resources
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Set your price
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Reach students
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  Track your earnings
                </div>

              </div>

              <Link
                href="/register"
                className="btn btn-primary"
              >
                Become a Seller
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            PLATFORM MODEL
        ===================================================== */}

        <section className="section">

          <div className="container">

            <div className="section-heading centered">

              <span className="section-kicker">
                PLATFORM MODEL
              </span>

              <h2>
                Built For Everyone
              </h2>

              <p>
                One platform connecting students, teachers and digital
                resource sellers.
              </p>

            </div>


            <div className="model-grid">

              <div className="model-card">

                <div className="model-icon">
                  <Users size={24} />
                </div>

                <h3>
                  Students
                </h3>

                <p>
                  Discover classes and study resources from different
                  teachers and sellers.
                </p>

              </div>


              <div className="model-card">

                <div className="model-icon">
                  <Video size={24} />
                </div>

                <h3>
                  Teachers
                </h3>

                <p>
                  Teach live classes and manage your students and earnings.
                </p>

              </div>


              <div className="model-card">

                <div className="model-icon">
                  <BookOpen size={24} />
                </div>

                <h3>
                  Sellers
                </h3>

                <p>
                  Sell useful PDF books and digital learning resources.
                </p>

              </div>


              <div className="model-card">

                <div className="model-icon">
                  <ShieldCheck size={24} />
                </div>

                <h3>
                  Admin
                </h3>

                <p>
                  Manage users, payments, platform activity and settlements.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            TRUST
        ===================================================== */}

        <section className="section trust-section">

          <div className="container trust-box">

            <div className="trust-icon">
              <ShieldCheck size={30} />
            </div>

            <div>

              <span className="section-kicker">
                TRUST & SECURITY
              </span>

              <h2>
                Learning With Confidence
              </h2>

              <p>
                SkillClass is designed with controlled payments, role-based
                access and admin-managed platform operations.
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="final-cta">

          <div className="container">

            <div className="cta-box">

              <div>

                <span className="section-kicker">
                  START TODAY
                </span>

                <h2>
                  Your Learning Journey Starts Here.
                </h2>

                <p>
                  Join SkillClass and discover a smarter way to learn,
                  teach and share knowledge.
                </p>

              </div>

              <Link
                href="/register"
                className="btn btn-light"
              >
                Create Free Account
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}