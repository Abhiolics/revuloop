"use client"
import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Button } from "@/components/ui/button"

export function MarketingNavbar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = React.useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20)
  })

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border-color)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-editorial text-2xl tracking-tight font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--persimmon)]" />
            RevuLoop
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[var(--muted-text)]">
            <Link href="/product" className="hover:text-[var(--foreground)] transition-colors">Product</Link>
            <Link href="/use-cases" className="hover:text-[var(--foreground)] transition-colors">How It Works</Link>
            <Link href="/use-cases" className="hover:text-[var(--foreground)] transition-colors">Use Cases</Link>
            <Link href="/pricing" className="hover:text-[var(--foreground)] transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-[15px] font-medium text-[var(--foreground)] hover:text-[var(--persimmon)] transition-colors">
            Sign In
          </Link>
          <Button asChild>
            <Link href="/sign-up">Start Free</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
