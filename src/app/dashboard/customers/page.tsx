"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { 
  Users,
  MagnifyingGlass,
  Funnel,
  DownloadSimple,
  Star,
  CheckCircle,
  WarningCircle,
  DotsThree
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MOCK_CUSTOMERS = [
  { id: "1", name: "Priya S.", contact: "priya@example.com", firstVisit: "Oct 12, 2023", lastVisit: "2 hours ago", totalFeedback: 3, avgRating: 4.6, consent: true, tags: ["VIP", "Dessert Lover"] },
  { id: "2", name: "Rahul Sharma", contact: "+91 9123456789", firstVisit: "Nov 05, 2023", lastVisit: "1 day ago", totalFeedback: 1, avgRating: 2.0, consent: false, tags: [] },
  { id: "3", name: "Neha", contact: "neha.k@example.com", firstVisit: "Jan 18, 2024", lastVisit: "4 days ago", totalFeedback: 5, avgRating: 5.0, consent: true, tags: ["Regular", "Takeaway"] },
]

export default function CustomersPage() {
  const [search, setSearch] = React.useState("")

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            Customers
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Customers who have voluntarily shared their details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 gap-2">
            <DownloadSimple size={18} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="bg-[var(--surface)] p-4 rounded-[16px] border border-[var(--border-color)] shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
            <Input 
              placeholder="Search by name, email or phone..." 
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10 gap-2 shrink-0">
            <Funnel size={16} /> Filters
          </Button>
        </div>
      </div>

      <div className="bg-[var(--surface)] rounded-[16px] border border-[var(--border-color)] shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--muted-text)] bg-[var(--surface-secondary)]">
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Visits (First - Last)</th>
                <th className="p-4 font-medium">Feedback</th>
                <th className="p-4 font-medium">Consent</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {MOCK_CUSTOMERS.map(customer => (
                <tr key={customer.id} className="hover:bg-[var(--surface-secondary)]/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--persimmon)]/10 text-[var(--persimmon)] font-semibold flex items-center justify-center shrink-0">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[var(--foreground)]">{customer.name}</p>
                        <div className="flex gap-1 mt-1">
                          {customer.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-[var(--surface-raised)] border border-[var(--border-color)] px-1.5 py-0.5 rounded-full text-[var(--muted-text)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-[13px] text-[var(--muted-text)]">{customer.contact}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-[13px] text-[var(--foreground)]">{customer.lastVisit}</p>
                    <p className="text-[11px] text-[var(--muted-text)]">Since {customer.firstVisit}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-medium">{customer.totalFeedback}</p>
                      <span className="text-[11px] text-[var(--muted-text)]">Avg:</span>
                      <span className="flex items-center text-[12px] font-medium text-[var(--soft-amber)] gap-0.5">
                        <Star size={12} weight="fill" /> {customer.avgRating}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {customer.consent ? (
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--mint)] bg-[var(--mint)]/10 px-2.5 py-1 rounded-full w-max">
                        <CheckCircle size={14} weight="bold" /> Opted In
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted-text)] bg-[var(--surface-secondary)] px-2.5 py-1 rounded-full w-max">
                        <WarningCircle size={14} weight="bold" /> Opted Out
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
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
