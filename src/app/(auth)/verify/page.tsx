"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, EnvelopeSimple, WarningCircle } from "@phosphor-icons/react"
import { resendVerificationAction } from "@/app/actions/auth"

import { Suspense } from "react"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlEmail = searchParams.get("email")
  
  const [error, setError] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState(urlEmail || "youremail@example.com")
  const [countdown, setCountdown] = React.useState(30)
  
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (urlEmail) {
        setEmail(urlEmail)
      } else {
        const savedEmail = localStorage.getItem("revuloop_pending_signup")
        if (savedEmail) {
          setEmail(savedEmail)
        }
      }
    }
  }, [urlEmail])

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleResend = async () => {
    if (countdown > 0) return
    setCountdown(30)
    setError(null)
    
    try {
      const res = await resendVerificationAction(email)
      if (res?.error) {
        setError(res.error)
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend email")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full flex flex-col items-center justify-center text-center py-12"
    >
      <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-[var(--border-color)] flex items-center justify-center mb-6">
        <EnvelopeSimple size={32} weight="duotone" className="text-[var(--foreground)]" />
      </div>

      <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] mb-3">
        Check your email
      </h2>
      
      <p className="text-[15px] text-[var(--muted-text)] mb-8 max-w-[320px]">
        We sent a verification link to <span className="font-medium text-[var(--foreground)]">{email}</span>. Please click the link to verify your account and continue.
      </p>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-6 text-[14px] text-[var(--destructive)] flex items-center justify-center gap-1"
        >
          <WarningCircle size={16} /> {error}
        </motion.p>
      )}

      <div className="text-center bg-[var(--surface)] px-6 py-4 rounded-xl border border-[var(--border-color)] w-full max-w-[320px]">
        <p className="text-[14px] text-[var(--muted-text)] mb-2">
          Didn't receive the email?
        </p>
        <button 
          onClick={handleResend}
          disabled={countdown > 0}
          className={`font-medium w-full py-2 rounded-lg transition-colors ${countdown > 0 ? 'bg-[var(--surface-hover)] text-[var(--muted-text)] opacity-70' : 'bg-[var(--ink)] text-[var(--warm-ivory)] hover:opacity-90'}`}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend link'}
        </button>
      </div>

      <button 
        onClick={() => router.push('/login')}
        className="mt-8 flex items-center gap-2 text-[14px] text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft size={16} /> Back to login
      </button>
    </motion.div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex w-full items-center justify-center p-12">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
