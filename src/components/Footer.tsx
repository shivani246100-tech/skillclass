import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="logo"><span className="logo-mark">S</span> SkillClass</div>
          <p style={{lineHeight:1.7,color:"#94a3b8",maxWidth:340}}>
            Learn from experts, join live classes and access useful digital study resources in one professional platform.
          </p>
        </div>
        <div><h4>Platform</h4><Link href="/classes">Classes</Link><Link href="/pdf-books">PDF Books</Link><Link href="/register">Register</Link></div>
        <div><h4>For You</h4><Link href="/teacher">Teachers</Link><Link href="/seller">Sellers</Link><Link href="/login">Login</Link></div>
        <div><h4>Legal</h4><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund">Refund Policy</Link></div>
      </div>
    </footer>
  );
}
