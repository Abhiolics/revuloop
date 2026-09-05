"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { sendAdminOtpAction, verifyAdminOtpAction } from "@/app/actions/adminAuth"
import { ShieldStar, LockKey, EnvelopeSimple, ArrowRight, SpinnerGap } from "@phosphor-icons/react/dist/ssr"

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<"email" | "otp">("email")
  const [otp, setOtp] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const ADMIN_EMAIL = "abhaysinghrajput1685@gmail.com"

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const res = await sendAdminOtpAction(ADMIN_EMAIL)

    if (res.error) {
      setError(res.error)
      setIsLoading(false)
    } else {
      setStep("otp")
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.")
      return
    }

    setIsLoading(true)
    setError("")

    const res = await verifyAdminOtpAction(ADMIN_EMAIL, otp)

    if (res.error) {
      setError(res.error)
      setIsLoading(false)
    } else {
      // Successful verification
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden">

        {/* Header Section */}
        <div className="p-8 pb-6 border-b border-[var(--border-color)] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--persimmon)]/10 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="w-16 h-16 bg-[var(--persimmon)]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--persimmon)]/20">
              <ShieldStar size={32} weight="duotone" className="text-[var(--persimmon)]" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Super Admin Portal
            </h1>
            <p className="text-[14px] text-[var(--muted-text)] mt-2">
              Highly restricted access area.
            </p>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
              <div className="text-red-500 mt-0.5">
                <LockKey size={18} weight="bold" />
              </div>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-[13px] font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Authorized Admin
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]">
                    <EnvelopeSimple size={18} />
                  </div>
                  <input
                    type="email"
                    value={ADMIN_EMAIL}
                    disabled
                    className="w-full h-11 pl-10 pr-4 bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-[15px] font-medium text-[var(--foreground)] opacity-70 cursor-not-allowed focus:outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LockKey size={16} weight="fill" className="text-[var(--persimmon)] opacity-80" />
                  </div>
                </div>
                <p className="text-[12px] text-[var(--muted-text)] mt-2 flex items-center gap-1.5">
                  <LockKey size={12} /> This portal is restricted to this email address only.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <SpinnerGap size={20} className="animate-spin" />
                ) : (
                  <>Send One-Time Password <ArrowRight size={16} weight="bold" /></>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-[14px] text-[var(--muted-text)]">
                  We sent a 6-digit verification code to
                  <br />
                  <span className="font-semibold text-[var(--foreground)]">{ADMIN_EMAIL}</span>
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[var(--foreground)] mb-2 uppercase tracking-wide">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full h-12 text-center tracking-[0.5em] bg-[var(--background)] border border-[var(--border-color)] rounded-lg text-2xl font-bold text-[var(--foreground)] focus:border-[var(--persimmon)] focus:ring-1 focus:ring-[var(--persimmon)] focus:outline-none transition-all placeholder:text-[var(--muted-text)]/30 placeholder:tracking-normal placeholder:text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full h-11 bg-[var(--foreground)] hover:bg-[var(--foreground)]/90 text-[var(--background)] font-medium rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <SpinnerGap size={20} className="animate-spin" />
                ) : (
                  <>Verify & Enter Admin Portal <ShieldStar size={16} weight="fill" /></>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email")
                    setOtp("")
                    setError("")
                  }}
                  className="text-[13px] font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
                >
                  Didn't receive it? Go back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
