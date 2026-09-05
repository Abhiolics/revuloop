"use client"

import { MarketingNavbar } from "@/components/marketing/Navbar"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle, Storefront, MapPin, QrCode, ChartLineUp, Users } from "@phosphor-icons/react"
import { useEffect } from "react"
import { seedDemoData } from "@/lib/services/mockSeed"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  // Seed data on initial load of the app if not present
  useEffect(() => {
    seedDemoData()
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--persimmon)] selection:text-white">
      <MarketingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 max-w-2xl z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[var(--persimmon)] font-medium mb-4 tracking-wide text-sm uppercase">
                Turn every visit into a relationship.
              </p>
              <h1 className="text-5xl md:text-[68px] leading-[1.05] font-semibold text-[var(--foreground)] tracking-tight mb-6">
                You’re serving customers. <br />
                But are you <span className="font-editorial text-[var(--dark-persimmon)] italic font-medium">keeping</span> them?
              </h1>
              <p className="text-[17px] text-[var(--muted-text)] leading-relaxed mb-10 max-w-xl">
                RevuLoop turns a simple counter QR into private feedback, genuine Google reviews, and customer relationships you can actually grow.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto text-base" asChild>
                  <Link href="/sign-up">Create Your Free Business Page</Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base gap-2" asChild>
                  <Link href="#how-it-works">
                    See How It Works <ArrowRight weight="bold" />
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-[13px] text-[var(--muted-text)] font-mono">
                No card required &middot; Set up in under 5 minutes
              </p>
            </motion.div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto relative">
            <motion.div 
              style={{ y }}
              className="relative w-full max-w-[500px] aspect-[4/5] mx-auto hidden lg:block"
            >
              {/* Abstract decorative visual for the QR Stand and Dashboard flow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--surface-secondary)] to-[var(--surface)] rounded-[32px] border border-[var(--border-color)] shadow-2xl p-8 flex flex-col">
                <div className="w-full h-1/2 bg-[var(--background)] rounded-2xl border border-[var(--border-color)] mb-6 flex items-center justify-center relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[var(--persimmon)]" />
                  <div className="w-32 h-32 border-4 border-[var(--foreground)] rounded-lg p-2">
                    <div className="w-full h-full border-[2px] border-dashed border-[var(--muted-text)] flex items-center justify-center">
                      <QrCode size={48} weight="duotone" className="text-[var(--persimmon)]" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="h-12 w-full bg-[var(--surface-raised)] rounded-xl border border-[var(--border-color)] flex items-center px-4 gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--mint)]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--mint)]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-[var(--muted-text)]/20 rounded-full mb-1" />
                      <div className="h-1.5 w-16 bg-[var(--muted-text)]/10 rounded-full" />
                    </div>
                  </div>
                  <div className="h-12 w-full bg-[var(--surface-raised)] rounded-xl border border-[var(--border-color)] flex items-center px-4 gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--soft-amber)]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--soft-amber)]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-32 bg-[var(--muted-text)]/20 rounded-full mb-1" />
                      <div className="h-1.5 w-20 bg-[var(--muted-text)]/10 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Opportunity Section */}
      <section className="py-24 bg-[var(--surface)] border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-[38px] font-semibold text-center mb-16 tracking-tight">
            Most businesses lose the customer <br className="hidden md:block"/> after the bill is paid.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                <ChartLineUp size={24} weight="duotone" className="text-[var(--persimmon)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">You don't know what went wrong</h3>
              <p className="text-[15px] text-[var(--muted-text)]">Unhappy customers rarely complain to your face. They just quietly never return.</p>
            </div>
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                <Storefront size={24} weight="duotone" className="text-[var(--mint)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Happy customers forget to review</h3>
              <p className="text-[15px] text-[var(--muted-text)]">People who love your service often leave without helping your Google ranking.</p>
            </div>
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] flex items-center justify-center border border-[var(--border-color)]">
                <Users size={24} weight="duotone" className="text-[var(--soft-amber)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">No reason to return</h3>
              <p className="text-[15px] text-[var(--muted-text)]">Without their contact info, you can't invite them back for their next visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight">
            Your next loyal customer may already be at the counter.
          </h2>
          <Button size="lg" className="h-[56px] px-10 text-lg" asChild>
            <Link href="/sign-up">Create Your QR</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
