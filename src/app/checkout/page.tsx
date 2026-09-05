"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { CheckCircle, ShieldCheck, Spinner, CreditCard } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { businessService } from "@/lib/services/businessService"

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "For a single location beginning its feedback journey.",
    price: { monthly: 999, annual: 9990 },
    features: ["1 Location", "1 QR Code", "Basic Analytics", "Standard Support"]
  },
  {
    id: "growth",
    name: "Growth",
    description: "For businesses that want customer insights and retention tools.",
    price: { monthly: 2499, annual: 24990 },
    features: ["Up to 3 Locations", "Unlimited QR Codes", "Customer CRM", "Priority Support", "Custom Branding"],
    recommended: true
  },
  {
    id: "multi",
    name: "Multi-location",
    description: "For growing brands managing multiple branches.",
    price: { monthly: 4999, annual: 49990 },
    features: ["Unlimited Locations", "Role-based Access", "API Access", "Dedicated Success Manager"]
  }
]

export default function CheckoutPage() {
  const router = useRouter()
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("annual")
  const [selectedPlan, setSelectedPlan] = React.useState("growth")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [couponCode, setCouponCode] = React.useState("")
  const [couponApplied, setCouponApplied] = React.useState(false)

  const plan = plans.find(p => p.id === selectedPlan)!
  const basePrice = plan.price[billingCycle]
  const discount = couponApplied ? Math.floor(basePrice * 0.2) : 0
  const subtotal = basePrice - discount
  const taxes = Math.floor(subtotal * 0.18) // 18% GST mock
  const total = subtotal + taxes

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate Razorpay window opening and processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      // 90% success rate mock
      if (Math.random() > 0.1) {
        await businessService.updateBusiness({ plan: selectedPlan as any, planStatus: 'active' })
        router.push("/payment/success")
      } else {
        router.push("/payment/failed")
      }
    } catch (err) {
      router.push("/payment/failed")
    }
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "demo20") {
      setCouponApplied(true)
    } else {
      alert("Invalid coupon for demo. Try DEMO20")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4">Choose your plan</h1>
          <p className="text-[var(--muted-text)]">Simple, transparent pricing. Cancel anytime.</p>
          
          <div className="inline-flex items-center p-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-[12px] mt-8">
            <button 
              className={`px-6 py-2 rounded-[8px] text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'bg-[var(--surface-raised)] shadow-sm' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-[8px] text-sm font-medium transition-colors ${billingCycle === 'annual' ? 'bg-[var(--surface-raised)] shadow-sm' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annually <span className="ml-1 text-[10px] uppercase bg-[var(--mint)]/20 text-[var(--deep-forest)] px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map(p => (
            <div 
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`relative p-6 rounded-[20px] border-2 transition-all cursor-pointer bg-[var(--surface)]
                ${selectedPlan === p.id 
                  ? 'border-[var(--persimmon)] shadow-md ring-4 ring-[var(--persimmon)]/10' 
                  : 'border-[var(--border-color)] hover:border-[var(--muted-text)]'}`}
            >
              {p.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--persimmon)] text-white px-3 py-1 text-xs font-medium rounded-full">
                  Recommended
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-sm text-[var(--muted-text)] h-10 mb-6">{p.description}</p>
              
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">₹{p.price[billingCycle].toLocaleString()}</span>
                <span className="text-[var(--muted-text)]">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="text-[var(--mint)] shrink-0 mt-0.5" size={16} weight="bold" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              
              <div className={`w-full h-2 rounded-full mt-auto ${selectedPlan === p.id ? 'bg-[var(--persimmon)]' : 'bg-transparent'}`} />
            </div>
          ))}
        </div>

        {/* Order Summary & Payment */}
        <div className="max-w-md mx-auto bg-[var(--surface-raised)] rounded-[20px] border border-[var(--border-color)] p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <CreditCard /> Order Summary
          </h3>
          
          <div className="space-y-3 text-sm mb-6 pb-6 border-b border-[var(--border-color)]">
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">{plan.name} Plan ({billingCycle})</span>
              <span>₹{basePrice.toLocaleString()}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-[var(--mint)]">
                <span>Discount (DEMO20)</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[var(--muted-text)]">GST (18%)</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex justify-between font-semibold text-lg mb-6">
            <span>Total to pay</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          {!couponApplied && (
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="Coupon code (Try DEMO20)" 
                value={couponCode} 
                onChange={e => setCouponCode(e.target.value)}
                className="h-10"
              />
              <Button variant="outline" className="h-10" onClick={applyCoupon}>Apply</Button>
            </div>
          )}

          <Button 
            className="w-full h-[52px] text-lg bg-[#3395FF] hover:bg-[#2072DB]"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <><Spinner className="animate-spin mr-2" /> Processing...</>
            ) : (
              `Pay ₹${total.toLocaleString()} securely`
            )}
          </Button>
          
          <p className="text-center text-xs text-[var(--muted-text)] mt-4 flex items-center justify-center gap-1">
            <ShieldCheck size={14} /> Secured by Razorpay (Mock)
          </p>
        </div>
      </div>
    </div>
  )
}
