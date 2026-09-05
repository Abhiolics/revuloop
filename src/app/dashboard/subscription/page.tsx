"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { 
  CreditCard,
  CheckCircle,
  DownloadSimple,
  WarningCircle,
  ArrowRight
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export default function SubscriptionPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            Subscription
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Manage your billing, invoices, and plan details.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Card */}
          <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[24px] border border-[var(--persimmon)] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--persimmon)]/10 rounded-bl-full" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--mint)]/20 text-[var(--deep-forest)] text-xs font-semibold uppercase tracking-wider mb-3">
                  Active
                </span>
                <h2 className="text-2xl font-semibold text-[var(--foreground)]">Growth Plan</h2>
                <p className="text-[var(--muted-text)]">Billed annually. Next billing on Oct 14, 2024.</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-semibold text-[var(--foreground)]">₹24,990</span>
                <span className="text-[var(--muted-text)]">/yr</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted-text)]">QR Scans this month</span>
                <span className="font-medium">1,245 / Unlimited</span>
              </div>
              <div className="w-full h-2 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
                <div className="w-[15%] h-full bg-[var(--persimmon)] rounded-full" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button>Change Plan</Button>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <CreditCard className="text-[var(--muted-text)]" /> Payment Method
            </h3>
            
            <div className="flex items-center justify-between p-4 border border-[var(--border-color)] rounded-[12px] bg-[var(--surface-secondary)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white rounded border border-black/10 flex items-center justify-center font-bold text-[#1A1F71] italic shadow-sm">
                  VISA
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">•••• •••• •••• 4242</p>
                  <p className="text-xs text-[var(--muted-text)]">Expires 12/25</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Update</Button>
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm h-max">
          <h3 className="text-lg font-semibold mb-6">Invoice History</h3>
          
          <div className="space-y-4">
            {[
              { date: "Oct 14, 2023", amount: "₹24,990", status: "Paid", id: "INV-2023-001" },
            ].map(inv => (
              <div key={inv.id} className="pb-4 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-[14px] text-[var(--foreground)]">{inv.amount}</p>
                    <p className="text-[12px] text-[var(--muted-text)]">{inv.date}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-[4px] bg-[var(--mint)]/20 text-[var(--deep-forest)] text-[11px] font-medium uppercase tracking-wide">
                    {inv.status}
                  </span>
                </div>
                <button className="text-[12px] font-medium text-[var(--persimmon)] flex items-center gap-1 hover:underline">
                  <DownloadSimple size={14} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
