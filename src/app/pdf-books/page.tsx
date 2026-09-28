import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const pdfs = [
  ["SSC Maths Complete Notes","Demo Seller","₹99"],
  ["General Knowledge Capsule","SkillClass Store","₹149"],
  ["English Practice Workbook","Study Resources","₹199"],
  ["Reasoning Shortcut Notes","Demo Seller","₹129"],
  ["UPSC Current Affairs","Study Resources","₹179"],
  ["Computer Basics PDF","SkillClass Store","₹79"]
];

export default function PdfBooks() {
  return <><Navbar/><main className="section"><div className="container">
    <div className="section-head"><div><h2>Digital PDF Books</h2><p>Educational resources with online access. No physical delivery.</p></div></div>
    <div className="grid-3">{pdfs.map(([title,seller,price])=><div className="card" key={title}>
      <div className="pdf-cover">PDF</div><h3>{title}</h3><div className="muted">{seller}</div>
      <div className="meta"><span>Digital</span><span className="price">{price}</span></div>
      <Link className="btn btn-primary" style={{width:"100%"}} href="/login">Buy PDF</Link>
    </div>)}</div>
  </div></main></>;
}
