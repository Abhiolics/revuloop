"use client"
import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { WarningCircle, ArrowClockwise } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[var(--surface)] rounded-[24px] border border-[var(--border-color)] p-8 shadow-sm text-center"
      >
        <div className="w-20 h-20 bg-[var(--destructive)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <WarningCircle size={40} weight="fill" className="text-[var(--destructive)]" />
        </div>
        
        <h1 className="text-3xl font-semibold mb-2 text-[var(--foreground)] tracking-tight">Payment Failed</h1>
        <p className="text-[var(--muted-text)] mb-8">
          We couldn't process your payment. Your card has not been charged.
        </p>

        <div className="space-y-3">
          <Button className="w-full h-12 text-[16px] gap-2" asChild>
            <Link href="/checkout"><ArrowClockwise weight="bold" /> Try Again</Link>
          </Button>
          <Button variant="ghost" className="w-full h-12 text-[16px]" asChild>
            <Link href="/dashboard">Go to Dashboard (Free Plan)</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
