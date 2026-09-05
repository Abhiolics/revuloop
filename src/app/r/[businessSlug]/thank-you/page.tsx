"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle, GoogleLogo, ArrowRight, ShieldCheck } from "@phosphor-icons/react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const businessSlug = params?.businessSlug as string
  const rating = parseInt(searchParams?.get("rating") || "5")
  
  const [businessName, setBusinessName] = React.useState("Loading...")

  React.useEffect(() => {
    import("@/app/actions/feedback").then(mod => {
      mod.getPublicBusinessBySlugAction(businessSlug).then(res => {
        if (res.success && res.data) {
          setBusinessName(res.data.displayName)
        } else {
          setBusinessName(businessSlug)
        }
      })
    })
  }, [businessSlug])

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] flex flex-col p-6">
      <main className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-20 h-20 bg-[var(--mint)]/20 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={40} weight="fill" className="text-[var(--mint)]" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-semibold mb-3 tracking-tight">Thank you!</h1>
          <p className="text-[16px] text-[var(--muted-text)] mb-8">
            Your {rating}-star feedback has been shared directly with the management team at {businessName}.
          </p>

          <div className="bg-[var(--surface)] border border-[var(--border-color)] rounded-[20px] p-6 mb-8 w-full shadow-sm text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <GoogleLogo size={120} weight="fill" />
            </div>
            
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2 relative z-10">
              <GoogleLogo weight="bold" className="text-[#4285F4]" /> Support us on Google
            </h2>
            <p className="text-[14px] text-[var(--muted-text)] mb-6 relative z-10">
              Your reviews help local businesses like ours thrive. Would you mind copying your feedback to Google Maps?
            </p>
            
            <Button className="w-full gap-2 relative z-10" onClick={() => window.open('https://google.com/maps', '_blank')}>
              Post to Google Maps <ArrowRight weight="bold" />
            </Button>
          </div>

          <Button variant="ghost" className="w-full text-[var(--muted-text)] hover:text-[var(--foreground)]" onClick={() => window.location.href = '/'}>
            Done
          </Button>
        </motion.div>
      </main>

      <footer className="py-6 text-center text-xs text-[var(--muted-text)] max-w-xs mx-auto flex flex-col items-center gap-2">
        <ShieldCheck size={16} />
        <p>Your feedback was securely processed by RevuLoop. You can opt out of communications at any time.</p>
      </footer>
    </div>
  )
}
