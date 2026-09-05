"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, CaretRight, CheckCircle, WarningCircle } from "@phosphor-icons/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const RATING_LABELS: Record<number, string> = {
  1: "Very disappointing",
  2: "Could be better",
  3: "It was okay",
  4: "Really good",
  5: "Excellent"
}

const TAGS = {
  positive: ["Food Quality", "Service", "Ambience", "Cleanliness", "Value for Money", "Speed"],
  negative: ["Wait Time", "Food Quality", "Service", "Cleanliness", "Price", "Noise Level"]
}

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  tags: z.array(z.string()),
  comment: z.string().optional(),
  customerName: z.string().optional(),
  contact: z.string().optional(),
  consent: z.boolean().default(false)
})

type FeedbackData = z.infer<typeof feedbackSchema>

export default function CustomerFeedbackPage() {
  const router = useRouter()
  const params = useParams()
  const businessSlug = params?.businessSlug as string
  
  const [businessName, setBusinessName] = React.useState("Loading...")
  const [hoverRating, setHoverRating] = React.useState<number | null>(null)
  const [step, setStep] = React.useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [copiedReview, setCopiedReview] = React.useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FeedbackData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      tags: [],
      comment: "",
      customerName: "",
      contact: "",
      consent: false
    }
  })

  const currentRating = watch("rating")
  const selectedTags = watch("tags")

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

  const handleRatingClick = (rating: number) => {
    setValue("rating", rating)
    setTimeout(() => {
      setStep(rating >= 4 ? 3 : 2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 400)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setValue("tags", selectedTags.filter(t => t !== tag))
    } else {
      setValue("tags", [...selectedTags, tag])
    }
  }

  const onSubmit = async (data: FeedbackData) => {
    setIsSubmitting(true)
    try {
      const { submitFeedbackAction } = await import("@/app/actions/feedback")
      
      const payload = {
        qrToken: businessSlug,
        rating: data.rating,
        comment: data.comment,
        contact: {
          name: data.customerName,
          phone: data.contact, // In a real app we'd parse phone vs email
        },
        consents: {
          marketing: data.consent
        }
      }
      
      const res = await submitFeedbackAction(payload)
      if (res?.error) {
        alert(res.error)
      } else if (res?.redirectUrl) {
        router.push(res.redirectUrl)
      } else {
        router.push(`/r/${businessSlug}/thank-you?rating=${data.rating}`)
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div className="min-h-[100dvh] bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 text-center border-b border-[var(--border-color)] bg-[var(--surface)]">
        <div className="w-12 h-12 rounded-xl bg-[var(--surface-secondary)] mx-auto flex items-center justify-center text-xl font-bold border border-[var(--border-color)] mb-3">
          {businessName.charAt(0)}
        </div>
        <h1 className="text-xl font-semibold text-[var(--foreground)] tracking-tight">{businessName}</h1>
        <p className="text-xs text-[var(--muted-text)] mt-1">Hazratganj Branch</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 pb-safe max-w-md w-full mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col justify-center py-10"
            >
              <h2 className="text-3xl font-semibold text-center mb-12 tracking-tight">How was your experience today?</h2>
              
              <div className="flex justify-between max-w-xs mx-auto w-full mb-8 relative">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="w-14 h-14 flex items-center justify-center relative touch-manipulation"
                    aria-label={`Rate ${star} out of 5 stars`}
                  >
                    <Star 
                      size={48} 
                      weight={star <= (hoverRating || currentRating) ? "fill" : "regular"}
                      className={`transition-colors duration-200 ${
                        star <= (hoverRating || currentRating) 
                          ? (hoverRating || currentRating) <= 3 
                            ? "text-[var(--soft-amber)]" 
                            : "text-[var(--persimmon)]" 
                          : "text-[var(--border-color)] hover:text-[var(--muted-text)]"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              <div className="text-center h-8">
                <AnimatePresence mode="wait">
                  {(hoverRating || currentRating) ? (
                    <motion.p
                      key={hoverRating || currentRating}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-[var(--foreground)] text-lg"
                    >
                      {RATING_LABELS[hoverRating || currentRating]}
                    </motion.p>
                  ) : (
                    <motion.p 
                      key="prompt"
                      className="text-[var(--muted-text)]"
                    >
                      Tap a star to rate
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={20} 
                      weight={star <= currentRating ? "fill" : "regular"}
                      className={star <= currentRating ? (currentRating <= 3 ? "text-[var(--soft-amber)]" : "text-[var(--persimmon)]") : "text-[var(--border-color)]"}
                      onClick={() => setStep(1)}
                    />
                  ))}
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-[var(--muted-text)] underline">Edit</button>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <Label className="text-lg font-semibold mb-4">What stood out to you?</Label>
                  <div className="flex flex-wrap gap-2">
                    {(currentRating <= 3 ? TAGS.negative : TAGS.positive).map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedTags.includes(tag) 
                            ? 'bg-[var(--foreground)] text-[var(--background)]' 
                            : 'bg-[var(--surface-raised)] border border-[var(--border-color)] text-[var(--muted-text)]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="comment" className="font-semibold">Tell us more (Optional)</Label>
                  <textarea
                    id="comment"
                    {...register("comment")}
                    placeholder="Any specific details you'd like to share?"
                    className="w-full rounded-[12px] border border-[var(--border-color)] bg-[var(--surface)] p-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--persimmon)] resize-none h-28"
                  />
                </div>

                <div className="space-y-4 pt-6 border-t border-[var(--border-color)]">
                  <h3 className="font-semibold">Your Details (Optional)</h3>
                  <Input placeholder="Full Name" {...register("customerName")} />
                  <Input type="tel" placeholder="Phone Number or Email" {...register("contact")} />
                  
                  <label className="flex items-start gap-3 mt-4">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-5 h-5 rounded border-[var(--border-color)] text-[var(--persimmon)] focus:ring-[var(--persimmon)] shrink-0"
                      {...register("consent")}
                    />
                    <span className="text-sm text-[var(--muted-text)] leading-snug">
                      I agree to receive occasional updates, special offers, and invitations from {businessName}.
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-10 mb-4">
                <Button type="submit" className="w-full h-[52px] text-lg rounded-[12px]" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Submit Feedback"}
                </Button>
                <p className="text-center text-xs text-[var(--muted-text)] mt-4">
                  Powered by <strong>RevuLoop</strong>
                </p>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-6"
            >
              <div className="w-16 h-16 bg-[var(--soft-amber)]/20 text-[var(--soft-amber)] rounded-full flex items-center justify-center mb-6 border border-[var(--soft-amber)]/30">
                <Star size={32} weight="fill" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 tracking-tight">We're so glad you loved it!</h2>
              <p className="text-[var(--muted-text)] mb-8 text-[15px] leading-relaxed">
                Could you take 30 seconds to share your experience on Google? It helps our small business tremendously.
              </p>

              <div className="bg-[var(--surface-raised)] border border-[var(--border-color)] rounded-[16px] p-6 w-full text-left relative shadow-sm mb-8">
                <p className="text-[15px] text-[var(--foreground)] italic leading-relaxed">
                  "I had a wonderful experience! The service was excellent and the quality was top-notch. Highly recommend!"
                </p>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 h-9 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-secondary)]"
                    onClick={() => {
                      navigator.clipboard.writeText("I had a wonderful experience! The service was excellent and the quality was top-notch. Highly recommend!");
                      setCopiedReview(true);
                      setTimeout(() => setCopiedReview(false), 2000);
                    }}
                  >
                    {copiedReview ? (
                      <><CheckCircle size={16} className="text-green-500" /> Copied!</>
                    ) : (
                      <>Copy Text</>
                    )}
                  </Button>
                </div>
              </div>

              <div className="w-full space-y-4">
                <Button 
                  className="w-full h-[56px] text-[16px] font-semibold rounded-[14px] bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-md transition-all flex items-center justify-center gap-3"
                  onClick={async () => {
                    window.open("https://g.page/r/CYNIYi-RYeAHEAE/review", "_blank");
                    
                    try {
                      const { submitFeedbackAction } = await import("@/app/actions/feedback");
                      await submitFeedbackAction({
                        qrToken: businessSlug,
                        rating: currentRating,
                        comment: "Redirected to Google Review.",
                        contact: {},
                        consents: { marketing: false }
                      });
                    } catch (e) {
                      console.error(e);
                    }
                    
                    router.push(`/r/${businessSlug}/thank-you?rating=${currentRating}`);
                  }}
                >
                  Paste to Google Review <CaretRight size={20} weight="bold" />
                </Button>
                <button 
                  type="button" 
                  onClick={() => router.push(`/r/${businessSlug}/thank-you?rating=${currentRating}`)}
                  className="text-sm font-medium text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors underline-offset-4 hover:underline"
                >
                  No thanks, skip this
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
