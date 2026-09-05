"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  CurrencyInr, 
  Storefront, 
  ChartLineUp,
  MagnifyingGlass,
  DotsThree,
  CheckCircle,
  WarningCircle,
  Prohibit
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllBusinessesAdminAction } from "@/app/actions/adminAuth"

export default function AdminPage() {
  const [search, setSearch] = React.useState("")
  const [businesses, setBusinesses] = React.useState<any[]>([])
  const [stats, setStats] = React.useState({ totalMrr: 0, activeBusinesses: 0, totalFeedback: 0, failedPayments: 0 })

  React.useEffect(() => {
    getAllBusinessesAdminAction().then(res => {
      if (res.success && res.data) {
        setBusinesses(res.data.businesses)
        setStats(res.data.stats)
      }
    })
  }, [])

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">Platform Overview</h1>
        <p className="text-[15px] text-[var(--muted-text)]">Global metrics and business management.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[var(--muted-text)]">
            <CurrencyInr size={20} />
            <span className="text-sm font-medium">Monthly MRR</span>
          </div>
          <h3 className="text-3xl font-mono font-semibold tracking-tight">₹{stats.totalMrr}</h3>
        </div>
        <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[var(--muted-text)]">
            <Storefront size={20} />
            <span className="text-sm font-medium">Active Businesses</span>
          </div>
          <h3 className="text-3xl font-mono font-semibold tracking-tight">{stats.activeBusinesses}</h3>
        </div>
        <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[var(--muted-text)]">
            <ChartLineUp size={20} />
            <span className="text-sm font-medium">Total Feedback Processed</span>
          </div>
          <h3 className="text-3xl font-mono font-semibold tracking-tight">{stats.totalFeedback}</h3>
        </div>
        <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[var(--muted-text)]">
            <WarningCircle size={20} className="text-[var(--destructive)]" />
            <span className="text-sm font-medium">Failed Payments</span>
          </div>
          <h3 className="text-3xl font-mono font-semibold tracking-tight text-[var(--destructive)]">{stats.failedPayments}</h3>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-[var(--surface)] rounded-[20px] border border-[var(--border-color)] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
            <Input 
              placeholder="Search businesses, owners, or emails..." 
              className="pl-10 h-10 bg-[var(--surface-secondary)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="h-10 px-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-[8px] text-sm font-medium outline-none">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Past Due</option>
            <option>Suspended</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--muted-text)] bg-[var(--surface-secondary)]">
                <th className="p-4 font-medium">Business</th>
                <th className="p-4 font-medium">Plan & MRR</th>
                <th className="p-4 font-medium">Usage (QRs / FB)</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {businesses.map(biz => (
                <tr key={biz.id} className="hover:bg-[var(--surface-secondary)]/50 transition-colors">
                  <td className="p-4">
                    <p className="text-[14px] font-medium text-[var(--foreground)]">{biz.name}</p>
                    <p className="text-[12px] text-[var(--muted-text)]">{biz.owner}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-[14px] font-medium text-[var(--foreground)]">{biz.plan}</p>
                    <p className="text-[12px] text-[var(--muted-text)]">₹{biz.mrr}/mo</p>
                  </td>
                  <td className="p-4">
                    <p className="text-[13px] text-[var(--muted-text)]">
                      <strong className="text-[var(--foreground)]">{biz.qrs}</strong> active QRs
                    </p>
                    <p className="text-[13px] text-[var(--muted-text)]">
                      <strong className="text-[var(--foreground)]">{biz.feedback}</strong> total feedbacks
                    </p>
                  </td>
                  <td className="p-4">
                    {biz.status === 'active' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--mint)]/20 text-[var(--deep-forest)]"><CheckCircle size={14}/> Active</span>}
                    {biz.status === 'past_due' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--soft-amber)]/20 text-[var(--dark-persimmon)]"><WarningCircle size={14}/> Past Due</span>}
                    {biz.status === 'trial' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--surface-secondary)] text-[var(--foreground)]"><ChartLineUp size={14}/> Trial</span>}
                    {biz.status === 'suspended' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--destructive)]/10 text-[var(--destructive)]"><Prohibit size={14}/> Suspended</span>}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" className="mr-2">View</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <DotsThree size={20} weight="bold" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
