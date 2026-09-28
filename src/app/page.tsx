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
  Star,
  Zap,
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
            HERO
        ===================================================== */}

        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
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

              <p>
                Join live classes from expert teachers, discover useful PDF
                books, and build your skills with a simple and trusted
                learning platform.
              </p>

              <div className="hero-actions">
                <Link href="/register" className="btn btn-primary">
                  Start Learning
                  <ArrowRight size={18} />
                </Link>

                <Link href="/classes" className="btn btn-outline">
                  Explore Classes
                  <PlayCircle size={18} />
                </Link>
              </div>

              <div className="hero-features">
                <div className="hero-feature">
                  <CheckCircle2 size={17} />
                  Live Classes
                </div>

                <div className="hero-feature">
                  <CheckCircle2 size={17} />
                  PDF Books
                </div>

                <div className="hero-feature">
                  <CheckCircle2 size={17} />
                  Secure Payments
                </div>
              </div>

              <div className="hero-mini-proof">
                <div className="proof-avatars">
                  <span>SC</span>
                  <span>10K</span>
                  <span>+</span>
                </div>

                <div>
                  <div className="proof-stars">
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                  </div>

                  <small>Learners are discovering SkillClass</small>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="hero-visual">
              <div className="learning-glow"></div>

              <div className="study-scene">
                <div className="float-book float-book-1">
                  <div className="float-book-page"></div>
                  <div className="float-book-cover"></div>
                </div>

                <div className="float-book float-book-2">
                  <div className="float-book-page"></div>
                  <div className="float-book-cover"></div>
                </div>

                <div className="float-cap">
                  <div className="cap-diamond"></div>
                  <div className="cap-board"></div>
                  <div className="cap-tassel"></div>
                </div>

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

                <div className="desk-book book-blue"></div>
                <div className="desk-book book-purple"></div>

                <div className="study-desk">
                  <div className="desk-leg desk-leg-left"></div>
                  <div className="desk-leg desk-leg-right"></div>
                </div>
              </div>

              <div className="visual-caption">
                <div className="caption-icon">
                  <GraduationCap size={20} />
                </div>

                <div>
                  <strong>Learn. Practice. Grow.</strong>
                  <span>Everything for your learning journey.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="stats">
          <div className="container stats-grid">
            <div className="stat">
              <strong>10K+</strong>
              <span>Learners</span>
            </div>

            <div className="stat">
              <strong>500+</strong>
              <span>Live Classes</span>
            </div>

            <div className="stat">
              <strong>1K+</strong>
              <span>PDF Resources</span>
            </div>

            <div className="stat">
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
            <div className="section-header">
              <span className="section-kicker">LEARN LIVE</span>

              <h2>Popular Live Classes</h2>

              <p>
                Learn directly from teachers through structured live classes
                designed for focused learning.
              </p>
            </div>

            <div className="course-grid">
              {courses.map((course, index) => (
                <article className="course-card" key={course.title}>
                  <div className={`course-visual course-visual-${index + 1}`}>
                    <div className="course-icon">
                      <Video size={25} />
                    </div>

                    <span className="live-pill">
                      <span></span>
                      LIVE
                    </span>

                    <div className="course-number">
                      0{index + 1}
                    </div>
                  </div>

                  <div className="course-content">
                    <div className="course-tag">LIVE CLASS</div>

                    <h3>{course.title}</h3>

                    <p className="course-teacher">
                      <Users size={15} />
                      {course.teacher}
                    </p>

                    <div className="course-meta">
                      <span>{course.schedule}</span>
                      <strong>{course.fee}</strong>
                    </div>

                    <Link href="/classes" className="course-link">
                      View Class
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="center-action">
              <Link href="/classes" className="btn btn-outline">
                View All Classes
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            PDF BOOKS
        ===================================================== */}

        <section className="section section-soft">
          <div className="container">
            <div className="section-header">
              <span className="section-kicker">DIGITAL RESOURCES</span>

              <h2>Featured PDF Books</h2>

              <p>
                Useful digital study resources from SkillClass sellers,
                available for learning on your device.
              </p>
            </div>

            <div className="pdf-grid">
              {pdfs.map((pdf, index) => (
                <article className="pdf-card" key={pdf.title}>
                  <div className={`pdf-cover pdf-cover-${index + 1}`}>
                    <BookOpen size={31} />

                    <span>PDF</span>

                    <div className="pdf-lines">
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>
                  </div>

                  <div className="pdf-content">
                    <span className="pdf-label">DIGITAL BOOK</span>

                    <h3>{pdf.title}</h3>

                    <p>{pdf.seller}</p>

                    <div className="pdf-bottom">
                      <strong>{pdf.price}</strong>

                      <Link href="/pdf-books" aria-label={`View ${pdf.title}`}>
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="center-action">
              <Link href="/pdf-books" className="btn btn-primary">
                Explore PDF Books
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}

        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-kicker">SIMPLE PROCESS</span>

              <h2>How SkillClass Works</h2>

              <p>
                A simple learning experience from account creation to your
                first class.
              </p>
            </div>

            <div className="steps">
              <div className="step-card">
                <div className="step-number">01</div>

                <div className="step-icon">
                  <Users size={23} />
                </div>

                <h3>Create Account</h3>

                <p>
                  Register as a student, teacher or seller and create your
                  SkillClass profile.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">02</div>

                <div className="step-icon">
                  <BookOpen size={23} />
                </div>

                <h3>Choose Learning</h3>

                <p>
                  Explore live classes and useful digital PDF learning
                  resources.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">03</div>

                <div className="step-icon">
                  <WalletCards size={23} />
                </div>

                <h3>Pay Securely</h3>

                <p>
                  Complete your purchase through the SkillClass platform
                  payment flow.
                </p>
              </div>

              <div className="step-card">
                <div className="step-number">04</div>

                <div className="step-icon">
                  <GraduationCap size={23} />
                </div>

                <h3>Start Learning</h3>

                <p>
                  Join your class and continue your learning journey with
                  SkillClass.
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
              <div className="feature-top">
                <div className="feature-icon">
                  <Video size={25} />
                </div>

                <span className="feature-badge">TEACHERS</span>
              </div>

              <span className="section-kicker">FOR TEACHERS</span>

              <h2>Teach What You Know</h2>

              <p>
                Create live classes, choose your schedule and monthly fee, and
                connect with students through SkillClass.
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

              <Link href="/teacher" className="btn btn-primary">
                Become a Teacher
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="feature-panel seller-panel">
              <div className="feature-top">
                <div className="feature-icon">
                  <BookOpen size={25} />
                </div>

                <span className="feature-badge">SELLERS</span>
              </div>

              <span className="section-kicker">FOR SELLERS</span>

              <h2>Sell Your Digital Knowledge</h2>

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

              <Link href="/seller" className="btn btn-primary">
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
            <div className="section-header">
              <span className="section-kicker">PLATFORM MODEL</span>

              <h2>Built For Everyone</h2>

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

                <h3>Students</h3>

                <p>
                  Discover live classes and digital study resources from
                  teachers and sellers.
                </p>
              </div>

              <div className="model-card">
                <div className="model-icon">
                  <Video size={24} />
                </div>

                <h3>Teachers</h3>

                <p>
                  Create live classes, manage your learning sessions and track
                  your earnings.
                </p>
              </div>

              <div className="model-card">
                <div className="model-icon">
                  <BookOpen size={24} />
                </div>

                <h3>Sellers</h3>

                <p>
                  Sell useful PDF books and digital learning resources to
                  students.
                </p>
              </div>

              <div className="model-card">
                <div className="model-icon">
                  <ShieldCheck size={24} />
                </div>

                <h3>Admin</h3>

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
          <div className="container">
            <div className="trust-box">
              <div className="trust-icon">
                <ShieldCheck size={30} />
              </div>

              <div className="trust-content">
                <span className="section-kicker">TRUST & SECURITY</span>

                <h2>Learning With Confidence</h2>

                <p>
                  SkillClass is designed with controlled payments, role-based
                  access and admin-managed platform operations.
                </p>

                <div className="trust-points">
                  <span>
                    <CheckCircle2 size={16} />
                    Role-based access
                  </span>

                  <span>
                    <CheckCircle2 size={16} />
                    Controlled payments
                  </span>

                  <span>
                    <CheckCircle2 size={16} />
                    Admin management
                  </span>
                </div>
              </div>

              <div className="trust-shield">
                <ShieldCheck size={75} strokeWidth={1.4} />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="final-cta">
          <div className="container">
            <div className="cta-box">
              <div className="cta-content">
                <div className="cta-icon">
                  <Zap size={20} />
                </div>

                <span className="section-kicker">START TODAY</span>

                <h2>Your Learning Journey Starts Here.</h2>

                <p>
                  Join SkillClass and discover a smarter way to learn, teach
                  and share knowledge.
                </p>
              </div>

              <Link href="/register" className="btn btn-light">
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