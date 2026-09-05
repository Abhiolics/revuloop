"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Storefront, User, MapPin, GoogleLogo, CheckCircle, ArrowLeft, ArrowRight, UploadSimple, ShieldStar } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { businessService } from "@/lib/services/businessService"

const steps = [
  { id: "business", title: "Business Identity", icon: Storefront },
  { id: "owner", title: "Authorized Person", icon: User },
  { id: "location", title: "Location", icon: MapPin },
  { id: "google", title: "Google Maps", icon: GoogleLogo },
  { id: "review", title: "Review", icon: CheckCircle },
]

const onboardingSchema = z.object({
  business: z.object({
    legalName: z.string().min(2, "Legal name is required"),
    displayName: z.string().min(2, "Display name is required"),
    category: z.string().min(2, "Category is required"),
  }),
  owner: z.object({
    fullName: z.string().min(2, "Name is required"),
    role: z.string().min(2, "Role is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(10, "Valid phone required"),
  }),
  location: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pinCode: z.string().min(6, "Valid PIN required"),
  }),
  google: z.object({
    placeId: z.string().optional(),
    placeName: z.string().optional(),
  })
})

type OnboardingData = z.infer<typeof onboardingSchema>

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [mockGoogleResults, setMockGoogleResults] = React.useState<any[]>([])

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      business: { legalName: "", displayName: "", category: "" },
      owner: { fullName: "", role: "", email: "", phone: "" },
      location: { address: "", city: "", state: "", pinCode: "" },
      google: { placeId: "", placeName: "" }
    }
  })

  // Load from local storage if exists
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("revuloop_onboarding")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          Object.keys(parsed).forEach(key => {
            setValue(key as any, parsed[key])
          })
        } catch (e) {}
      }
    }
  }, [setValue])

  // Save to local storage on change
  React.useEffect(() => {
    const subscription = watch((value) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("revuloop_onboarding", JSON.stringify(value))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  const nextStep = async () => {
    const fieldsToValidate = 
      currentStep === 0 ? ["business.legalName", "business.displayName", "business.category"] :
      currentStep === 1 ? ["owner.fullName", "owner.role", "owner.email", "owner.phone"] :
      currentStep === 2 ? ["location.address", "location.city", "location.state", "location.pinCode"] :
      []

    const isStepValid = await trigger(fieldsToValidate as any)
    if (isStepValid && currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }

  const onFinalSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true)
    try {
      const { completeOnboardingAction } = await import("@/app/actions/onboarding")
      const res = await completeOnboardingAction(data)
      
      if (res?.error) {
        console.error("Onboarding Error:", res.error)
        alert(res.error)
      } else {
        localStorage.removeItem("revuloop_onboarding")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.length > 2) {
      // Mock Google Places API
      setMockGoogleResults([
        { id: "place_1", name: `${val} - Main Branch`, address: "123 MG Road", rating: 4.5, reviews: 120 },
        { id: "place_2", name: `${val} Cafe`, address: "45 Market Street", rating: 4.8, reviews: 340 }
      ])
    } else {
      setMockGoogleResults([])
    }
  }

  const selectGooglePlace = (place: any) => {
    setValue("google.placeId", place.id)
    setValue("google.placeName", place.name)
    setMockGoogleResults([])
    setSearchQuery("")
  }

  const formData = watch()

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-[var(--background)]">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle animated gradient background to simulate a deep, premium feel */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[var(--persimmon)]/5 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--soft-amber)]/5 blur-[120px] mix-blend-multiply" />
        {/* Simulate Dashboard blurred in background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        
        {/* Mock dashboard skeleton to give the "popup over app" feel */}
        <div className="absolute inset-0 opacity-20 pointer-events-none hidden md:block">
          <div className="w-64 h-full border-r border-[var(--border-color)] absolute left-0 top-0 bg-[var(--surface)]" />
          <div className="absolute left-64 top-0 right-0 h-16 border-b border-[var(--border-color)] bg-[var(--surface)]" />
          <div className="absolute left-72 top-24 right-8 bottom-8 rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-secondary)]/50" />
        </div>
      </div>

      {/* Main Modal */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-[640px] bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-[24px] shadow-2xl relative z-10 flex flex-col overflow-hidden max-h-[90vh]"
      >
        {/* Top Header / Progress */}
        <div className="px-8 py-6 border-b border-[var(--border-color)] bg-[var(--surface-raised)]/50 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-editorial text-lg font-semibold tracking-tight text-[var(--foreground)]">
              <ShieldStar size={20} className="text-[var(--persimmon)]" weight="fill" />
              RevuLoop Setup
            </div>
            <div className="text-xs font-mono text-[var(--muted-text)] bg-[var(--surface-secondary)] px-2 py-1 rounded">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[var(--border-color)] -translate-y-1/2 -z-10" />
            <motion.div 
              className="absolute top-1/2 left-0 h-[2px] bg-[var(--foreground)] -translate-y-1/2 -z-10" 
              initial={false}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            
            <div className="flex justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx === currentStep
                const isCompleted = idx < currentStep
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-[2px] transition-all duration-300 ${
                      isActive ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)] shadow-md scale-110' :
                      isCompleted ? 'bg-[var(--foreground)] border-[var(--foreground)] text-[var(--background)]' :
                      'bg-[var(--surface)] border-[var(--border-color)] text-[var(--muted-text)]'
                    }`}>
                      <Icon size={14} weight={isActive || isCompleted ? "bold" : "regular"} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 relative">
          <form id="onboarding-form" onSubmit={handleSubmit(onFinalSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Business Identity</h2>
                      <p className="text-[var(--muted-text)] text-sm">Set up your brand profile for customers to see.</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="legalName" error={!!errors.business?.legalName}>Legal Business Name</Label>
                      <Input id="legalName" {...register("business.legalName")} placeholder="The Royal Cafe Pvt Ltd" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                      {errors.business?.legalName && <p className="mt-1 text-sm text-[var(--destructive)]">{errors.business.legalName.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="displayName" error={!!errors.business?.displayName}>Display Name</Label>
                      <Input id="displayName" {...register("business.displayName")} placeholder="The Royal Café" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                      {errors.business?.displayName && <p className="mt-1 text-sm text-[var(--destructive)]">{errors.business.displayName.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="category" error={!!errors.business?.category}>Category</Label>
                      <select 
                        id="category" 
                        {...register("business.category")} 
                        className="flex h-12 w-full rounded-[12px] border border-transparent bg-[var(--surface-secondary)] px-4 py-2 text-[15px] focus-visible:outline-none focus-visible:border-[var(--persimmon)] focus-visible:bg-[var(--surface)] transition-all"
                      >
                        <option value="">Select a category</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Cafe">Café</option>
                        <option value="Salon">Salon / Spa</option>
                        <option value="Clinic">Clinic</option>
                        <option value="Retail">Retail</option>
                      </select>
                      {errors.business?.category && <p className="mt-1 text-sm text-[var(--destructive)]">{errors.business.category.message}</p>}
                    </div>
                    
                    <div>
                      <Label>Business Logo (Optional)</Label>
                      <div className="w-full h-32 border-2 border-dashed border-[var(--border-color)] bg-[var(--surface-secondary)]/50 rounded-[16px] flex flex-col items-center justify-center text-[var(--muted-text)] hover:bg-[var(--surface-secondary)] hover:border-[var(--foreground)] transition-all cursor-pointer group">
                        <div className="w-10 h-10 bg-[var(--surface)] rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform text-[var(--foreground)]">
                          <UploadSimple size={20} />
                        </div>
                        <span className="text-sm font-medium">Click to upload logo</span>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Authorized Person</h2>
                      <p className="text-[var(--muted-text)] text-sm">Who will be the primary administrator?</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="fullName" error={!!errors.owner?.fullName}>Full Name</Label>
                      <Input id="fullName" {...register("owner.fullName")} placeholder="Arjun Mehta" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                    </div>
                    
                    <div>
                      <Label htmlFor="role" error={!!errors.owner?.role}>Role / Designation</Label>
                      <Input id="role" {...register("owner.role")} placeholder="Owner / Manager" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" error={!!errors.owner?.email}>Work Email</Label>
                      <Input id="email" type="email" {...register("owner.email")} placeholder="arjun@theroyalcafe.com" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" error={!!errors.owner?.phone}>Phone Number</Label>
                      <Input id="phone" type="tel" {...register("owner.phone")} placeholder="+91 98765 43210" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Location Details</h2>
                      <p className="text-[var(--muted-text)] text-sm">The physical location for your first workspace.</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="address" error={!!errors.location?.address}>Street Address</Label>
                      <Input id="address" {...register("location.address")} placeholder="123 MG Road, Hazratganj" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" error={!!errors.location?.city}>City</Label>
                        <Input id="city" {...register("location.city")} placeholder="Lucknow" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                      </div>
                      <div>
                        <Label htmlFor="state" error={!!errors.location?.state}>State</Label>
                        <Input id="state" {...register("location.state")} placeholder="Uttar Pradesh" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="pinCode" error={!!errors.location?.pinCode}>PIN Code</Label>
                      <Input id="pinCode" {...register("location.pinCode")} placeholder="226001" className="h-12 bg-[var(--surface-secondary)] border-transparent focus:border-[var(--persimmon)] focus:bg-[var(--surface)] transition-all" />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Connect Google Maps</h2>
                      <p className="text-[var(--muted-text)] text-sm">Boost your SEO by sending happy customers to Google.</p>
                    </div>
                    
                    {formData.google.placeId ? (
                      <div className="p-4 border border-[var(--mint)] bg-[var(--mint)]/10 rounded-[16px] flex items-start gap-4 transition-all">
                        <div className="w-12 h-12 rounded-full bg-[var(--mint)]/20 flex items-center justify-center shrink-0 shadow-sm border border-[var(--mint)]/30">
                          <CheckCircle size={24} weight="fill" className="text-[var(--mint)]" />
                        </div>
                        <div className="flex-1 mt-1">
                          <h4 className="font-semibold text-[var(--foreground)]">{formData.google.placeName}</h4>
                          <p className="text-sm text-[var(--muted-text)]">Connected successfully.</p>
                          <button 
                            type="button" 
                            onClick={() => {
                              setValue("google.placeId", "")
                              setValue("google.placeName", "")
                            }}
                            className="text-[var(--foreground)] underline text-sm font-medium mt-3"
                          >
                            Unlink Location
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="relative">
                            <GoogleLogo size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
                            <Input 
                              value={searchQuery}
                              onChange={handleGoogleSearch}
                              placeholder="Search business on Google Maps..."
                              className="pl-12 h-14 bg-[var(--surface-secondary)] border-transparent focus:bg-[var(--surface)] focus:border-[#4285F4] transition-all rounded-[16px] text-[16px]"
                            />
                          </div>
                        </div>
                        
                        {mockGoogleResults.length > 0 && (
                          <div className="border border-[var(--border-color)] rounded-[16px] overflow-hidden bg-[var(--surface)] shadow-sm divide-y divide-[var(--border-color)]">
                            {mockGoogleResults.map(place => (
                              <button
                                key={place.id}
                                type="button"
                                onClick={() => selectGooglePlace(place)}
                                className="w-full text-left p-4 hover:bg-[var(--surface-secondary)] flex justify-between items-center transition-colors group"
                              >
                                <div>
                                  <h4 className="font-medium text-[var(--foreground)] group-hover:text-[#4285F4] transition-colors">{place.name}</h4>
                                  <p className="text-sm text-[var(--muted-text)] mt-0.5">{place.address}</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <span className="text-sm font-semibold text-[var(--foreground)] flex items-center gap-1 bg-[var(--surface-raised)] px-2 py-0.5 rounded shadow-sm border border-[var(--border-color)]">
                                    ★ {place.rating}
                                  </span>
                                  <span className="text-[11px] text-[var(--muted-text)] mt-1">{place.reviews} reviews</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {searchQuery.length > 2 && mockGoogleResults.length === 0 && (
                          <div className="p-8 text-center border-2 border-dashed border-[var(--border-color)] rounded-[16px] bg-[var(--surface-secondary)]/50">
                            <p className="text-[var(--muted-text)] text-sm mb-3">No matching businesses found.</p>
                            <Button type="button" variant="outline" size="sm">Skip for now</Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">Almost done</h2>
                      <p className="text-[var(--muted-text)] text-sm">Review your workspace configuration.</p>
                    </div>
                    
                    <div className="space-y-2 text-[15px] bg-[var(--surface-secondary)]/50 p-6 rounded-[16px] border border-[var(--border-color)]">
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-color)]/50">
                        <span className="text-[var(--muted-text)] text-sm">Brand Name</span>
                        <span className="font-semibold text-[var(--foreground)]">{formData.business.displayName || "—"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-color)]/50">
                        <span className="text-[var(--muted-text)] text-sm">Administrator</span>
                        <span className="font-semibold text-[var(--foreground)]">{formData.owner.fullName || "—"} <span className="text-[var(--muted-text)] font-normal text-sm">({formData.owner.role})</span></span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-[var(--border-color)]/50">
                        <span className="text-[var(--muted-text)] text-sm">Primary Location</span>
                        <span className="font-semibold text-[var(--foreground)] sm:text-right max-w-[200px]">{formData.location.address ? `${formData.location.address}, ${formData.location.city}` : "—"}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between pt-2">
                        <span className="text-[var(--muted-text)] text-sm">Google Integration</span>
                        <span className="font-semibold text-[var(--foreground)] flex items-center gap-1">
                          {formData.google.placeId ? (
                            <><CheckCircle weight="fill" className="text-[var(--mint)]"/> Connected</>
                          ) : (
                            <span className="text-[var(--muted-text)] font-normal">Not connected</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-[var(--border-color)] bg-[var(--surface-raised)]/50 shrink-0 flex items-center justify-between">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className={`font-medium ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="mr-2" /> Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button 
              type="button" 
              onClick={nextStep}
              className="h-12 px-8 rounded-full shadow-lg shadow-[var(--foreground)]/10 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90"
            >
              Continue <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button 
              type="button"
              onClick={handleSubmit(onFinalSubmit)}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-full shadow-lg shadow-[var(--persimmon)]/20 bg-[var(--persimmon)] text-white hover:bg-[var(--dark-persimmon)]"
            >
              {isSubmitting ? "Building Workspace..." : "Create Workspace"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
