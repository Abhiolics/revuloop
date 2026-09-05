"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeSlash, GoogleLogo, WarningCircle } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpAction, signInWithGoogleAction } from "@/app/actions/auth"

const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid work email"),
  phone: z.string().min(10, "Please enter a valid mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true)
    setServerError(null)
    
    try {
      const formData = new FormData()
      formData.append("fullName", data.fullName)
      formData.append("email", data.email)
      formData.append("password", data.password)
      
      const res = await signUpAction(formData)
      if (res?.error) {
        setServerError(res.error)
      }
      // If success, signUpAction will redirect internally
    } catch (err: any) {
      setServerError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength logic (mock)
  const pwdValue = register("password")
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] mb-2">Create an account</h2>
        <p className="text-[15px] text-[var(--muted-text)]">
          Join RevuLoop and start understanding your customers.
        </p>
      </div>

      <form action={signInWithGoogleAction}>
        <Button variant="outline" className="w-full mb-6 relative group" type="submit">
          <div className="absolute left-4">
            <GoogleLogo size={20} weight="bold" />
          </div>
          Sign up with Google
        </Button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--border-color)]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[var(--background)] px-2 text-[var(--muted-text)]">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="fullName" error={!!errors.fullName}>Full Name</Label>
          <Input 
            id="fullName" 
            placeholder="Arjun Mehta" 
            {...register("fullName")} 
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-sm text-[var(--destructive)] flex items-center gap-1">
              <WarningCircle size={16} /> {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" error={!!errors.email}>Work Email</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="arjun@theroyalcafe.com" 
            {...register("email")} 
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-[var(--destructive)] flex items-center gap-1">
              <WarningCircle size={16} /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" error={!!errors.phone}>Mobile Number</Label>
          <Input 
            id="phone" 
            type="tel"
            placeholder="+91 98765 43210" 
            {...register("phone")} 
          />
          {errors.phone && (
            <p className="mt-1.5 text-sm text-[var(--destructive)] flex items-center gap-1">
              <WarningCircle size={16} /> {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password" error={!!errors.password}>Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Create a password" 
              {...register("password")} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-sm text-[var(--destructive)] flex items-center gap-1">
              <WarningCircle size={16} /> {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 pt-2">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--persimmon)] focus:ring-[var(--persimmon)]"
              {...register("terms")}
            />
          </div>
          <div className="text-sm">
            <label htmlFor="terms" className="text-[var(--muted-text)] font-medium">
              I agree to the <Link href="#" className="text-[var(--foreground)] underline decoration-[var(--border-color)] underline-offset-4 hover:decoration-[var(--foreground)]">Terms of Service</Link> and <Link href="#" className="text-[var(--foreground)] underline decoration-[var(--border-color)] underline-offset-4 hover:decoration-[var(--foreground)]">Privacy Policy</Link>.
            </label>
            {errors.terms && (
              <p className="mt-1 text-[var(--destructive)]">{errors.terms.message}</p>
            )}
          </div>
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-lg bg-[var(--destructive)]/10 text-[var(--destructive)] text-sm flex items-start gap-2"
            >
              <WarningCircle size={20} className="shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--muted-text)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--foreground)] font-medium hover:text-[var(--persimmon)] transition-colors">
          Sign in
        </Link>
      </div>
    </motion.div>
  )
}
