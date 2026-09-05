import * as React from "react"
import Link from "next/link"
import { CheckCircle } from "@phosphor-icons/react/dist/ssr"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[var(--background)]">
      {/* Left side - Visual/Value Prop */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[var(--surface-secondary)] border-r border-[var(--border-color)]">
        <div>
          <Link href="/" className="font-editorial text-2xl tracking-tight font-semibold flex items-center gap-2 mb-16">
            <div className="w-6 h-6 rounded bg-[var(--persimmon)]" />
            RevuLoop
          </Link>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight mb-6">
            Understand every visit. <br/>
            Grow your business.
          </h1>
          <p className="text-[17px] text-[var(--muted-text)] max-w-md">
            Give your customers an easier way to be heard before they post a public review.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle weight="fill" className="text-[var(--mint)] w-6 h-6" />
            <span className="text-[15px] font-medium text-[var(--foreground)]">Designed for local businesses</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle weight="fill" className="text-[var(--mint)] w-6 h-6" />
            <span className="text-[15px] font-medium text-[var(--foreground)]">Google-review policy conscious</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle weight="fill" className="text-[var(--mint)] w-6 h-6" />
            <span className="text-[15px] font-medium text-[var(--foreground)]">Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden font-editorial text-2xl tracking-tight font-semibold flex items-center justify-center gap-2 mb-12">
            <div className="w-6 h-6 rounded bg-[var(--persimmon)]" />
            RevuLoop
          </Link>
          
          {children}
        </div>
      </div>
    </div>
  )
}
