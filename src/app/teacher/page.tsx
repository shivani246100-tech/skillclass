import { Navbar } from "@/components/Navbar";
import Link from "next/link";
export default function Teacher() {
  return <><Navbar/><main className="section"><div className="container"><div className="feature-panel"><h3>Become a SkillClass Teacher</h3><p>Set your class schedule, monthly fee and teach students through live sessions. Your earnings are tracked through the platform wallet ledger after payment approval.</p><Link href="/register" className="btn" style={{background:"white",color:"#1d4ed8"}}>Create Teacher Account</Link></div></div></main></>;
}
