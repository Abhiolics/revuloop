import * as React from "react"
import Link from "next/link"
import { SquaresFour, Buildings, ShieldStar } from "@phosphor-icons/react/dist/ssr"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <header className="h-16 border-b border-[var(--border-color)] bg-[var(--surface)] flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-editorial text-xl tracking-tight font-semibold flex items-center gap-2">
            <ShieldStar size={24} weight="fill" className="text-[var(--persimmon)]" />
            RevuLoop Admin
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/admin" className="text-[14px] font-medium text-[var(--foreground)] flex items-center gap-2">
              <SquaresFour size={18} /> Overview
            </Link>
            <Link href="/admin" className="text-[14px] font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] flex items-center gap-2">
              <Buildings size={18} /> Businesses
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono bg-[var(--surface-secondary)] px-2 py-1 rounded text-[var(--muted-text)]">
            SUPER_ADMIN
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
