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
import { loginAction, signInWithGoogleAction } from "@/app/actions/auth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setServerError(null)
    
    try {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      
      const res = await loginAction(formData)
      if (res?.error) {
        setServerError(res.error)
      }
    } catch (err: any) {
      setServerError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] mb-2">Welcome back</h2>
        <p className="text-[15px] text-[var(--muted-text)]">
          Sign in to your RevuLoop workspace.
        </p>
      </div>

      <form action={signInWithGoogleAction}>
        <Button variant="outline" className="w-full mb-6 relative group" type="submit">
          <div className="absolute left-4">
            <GoogleLogo size={20} weight="bold" />
          </div>
          Sign in with Google
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
          <Label htmlFor="email" error={!!errors.email}>Work Email</Label>
          <Input 
            id="email" 
            type="email"
            placeholder="you@company.com" 
            {...register("email")} 
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-[var(--destructive)] flex items-center gap-1">
              <WarningCircle size={16} /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="password" error={!!errors.password} className="mb-0">Password</Label>
            <Link href="/forgot-password" className="text-sm font-medium text-[var(--persimmon)] hover:text-[var(--dark-persimmon)]">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password" 
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

        <div className="flex items-center gap-2 py-1">
          <input
            id="remember"
            type="checkbox"
            className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--persimmon)] focus:ring-[var(--persimmon)]"
          />
          <label htmlFor="remember" className="text-sm text-[var(--muted-text)] font-medium select-none">
            Remember me for 30 days
          </label>
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
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--muted-text)]">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-[var(--foreground)] font-medium hover:text-[var(--persimmon)] transition-colors">
          Create an account
        </Link>
      </div>
    </motion.div>
  )
}
