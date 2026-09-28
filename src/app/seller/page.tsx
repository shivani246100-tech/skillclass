import { Navbar } from "@/components/Navbar";
import Link from "next/link";
export default function Seller() {
  return <><Navbar/><main className="section"><div className="container"><div className="feature-panel purple"><h3>Become a SkillClass PDF Seller</h3><p>Sell digital educational PDFs online. Upload your resource, set a price and submit it for admin approval. There is no physical delivery.</p><Link href="/register" className="btn" style={{background:"white",color:"#6d28d9"}}>Create Seller Account</Link></div></div></main></>;
}
