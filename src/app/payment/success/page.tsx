"use client"
import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, DownloadSimple } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { businessService } from "@/lib/services/businessService"
import { QrCode as QrIcon } from "@phosphor-icons/react"

export default function PaymentSuccessPage() {
  const [businessName, setBusinessName] = React.useState("Your Business")

  React.useEffect(() => {
    businessService.getBusiness().then(b => {
      if (b) setBusinessName(b.displayName)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[var(--surface)] rounded-[24px] border border-[var(--border-color)] p-8 shadow-sm text-center"
      >
        <div className="w-20 h-20 bg-[var(--mint)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} weight="fill" className="text-[var(--mint)]" />
        </div>
        
        <h1 className="text-3xl font-semibold mb-2 text-[var(--foreground)] tracking-tight">Payment Successful</h1>
        <p className="text-[var(--muted-text)] mb-8">
          Your RevuLoop workspace for <strong>{businessName}</strong> is ready. Receipt sent to email.
        </p>

        <div className="bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-[var(--persimmon)]/10 rounded-lg flex items-center justify-center text-[var(--persimmon)]">
              <QrIcon size={24} weight="duotone" />
            </div>
            <div>
              <p className="font-medium text-[var(--foreground)]">Your First QR Code</p>
              <p className="text-xs text-[var(--muted-text)]">Counter Display</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <DownloadSimple /> Get PDF
          </Button>
        </div>

        <div className="space-y-3">
          <Button className="w-full h-12 text-[16px]" asChild>
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
