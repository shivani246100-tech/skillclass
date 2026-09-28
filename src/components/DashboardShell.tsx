import Link from "next/link";
import { Role } from "@prisma/client";

const links: Record<Role, {label:string;href:string}[]> = {
  STUDENT:[{label:"Overview",href:"/dashboard/student"},{label:"My Classes",href:"#"},{label:"Live Sessions",href:"#"},{label:"My PDF Books",href:"#"},{label:"Payments",href:"#"},{label:"Profile",href:"#"}],
  TEACHER:[{label:"Overview",href:"/dashboard/teacher"},{label:"My Classes",href:"#"},{label:"Create Class",href:"#"},{label:"Live Sessions",href:"#"},{label:"Students",href:"#"},{label:"Wallet",href:"#"},{label:"Profile",href:"#"}],
  SELLER:[{label:"Overview",href:"/dashboard/seller"},{label:"My PDF Books",href:"#"},{label:"Add PDF",href:"#"},{label:"Sales",href:"#"},{label:"Wallet",href:"#"},{label:"Profile",href:"#"}],
  ADMIN:[{label:"Dashboard",href:"/admin/dashboard"}]
};

export function DashboardShell({role,name,children}:{role:Role;name:string;children:React.ReactNode}){
  async function logout(){"use server"; const {clearSession}=await import("@/lib/auth"); await clearSession();}
  return <main className="dashboard"><aside className="sidebar"><Link href="/" className="logo"><span className="logo-mark">S</span> SkillClass</Link>
    <div style={{padding:"0 12px 14px",fontSize:12,color:"#64748b"}}>{role}</div>
    {links[role].map(x=><Link className="side-link" href={x.href} key={x.label}>{x.label}</Link>)}
    <form action={logout} style={{marginTop:18}}><button className="side-link" style={{background:"transparent",border:0,color:"#cbd5e1",width:"100%",textAlign:"left",cursor:"pointer"}}>Logout</button></form>
  </aside><section className="main"><div className="dash-head"><div><h1>Welcome, {name}</h1><p className="muted">Your {role.toLowerCase()} dashboard.</p></div><Link href="/" className="btn btn-outline">View site</Link></div>{children}</section></main>
}
