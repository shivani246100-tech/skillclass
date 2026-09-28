import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";

export default async function SellerDashboard(){
 const user=await getCurrentUser(); if(!user) redirect("/login"); if(user.role!=="SELLER") redirect("/");
 return <DashboardShell role="SELLER" name={user.name}><div className="stats"><div className="stat"><div className="stat-label">PDF Books</div><div className="stat-value">0</div></div><div className="stat"><div className="stat-label">Sales</div><div className="stat-value">0</div></div><div className="stat"><div className="stat-label">Wallet</div><div className="stat-value">₹0</div></div><div className="stat"><div className="stat-label">Pending Approval</div><div className="stat-value">0</div></div></div><div className="card"><h3>Seller workspace</h3><p className="muted">You will upload educational PDFs, set prices, submit listings for admin approval and receive approved earnings in your wallet.</p></div></DashboardShell>;
}
