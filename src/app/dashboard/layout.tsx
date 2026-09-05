"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  SquaresFour, 
  ChatTeardropText, 
  QrCode, 
  Users, 
  ChartLineUp, 
  CreditCard, 
  GearSix,
  CaretUpDown,
  Question,
  SignOut,
  List,
  Plus
} from "@phosphor-icons/react"
import { businessService } from "@/lib/services/businessService"
import { authService } from "@/lib/services/authService"

const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: SquaresFour, primary: true },
  { name: "Feedback", href: "/dashboard/feedback", icon: ChatTeardropText, primary: true },
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode, primary: true },
  { name: "Customers", href: "/dashboard/customers", icon: Users, primary: true },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartLineUp, primary: false },
]

const SETTINGS_ITEMS = [
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: GearSix },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [businessName, setBusinessName] = React.useState("Loading...")
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  React.useEffect(() => {
    businessService.getBusiness().then(b => {
      if (b) setBusinessName(b.displayName)
    })
  }, [])

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col border-r border-[var(--border-color)] bg-[var(--surface)] transition-all duration-300 z-30 ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-[var(--border-color)] overflow-hidden shrink-0">
          <button className="flex items-center w-full gap-3 hover:bg-[var(--surface-secondary)] p-2 rounded-[10px] transition-colors overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--persimmon)] shrink-0 flex items-center justify-center text-white font-semibold">
              {businessName.charAt(0)}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 text-left truncate">
                  <p className="text-[14px] font-semibold text-[var(--foreground)] truncate">{businessName}</p>
                  <p className="text-[12px] text-[var(--muted-text)] truncate">Pro Plan</p>
                </div>
                <CaretUpDown size={16} className="text-[var(--muted-text)]" />
              </>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <div className="text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider mb-2 px-3">
            {!isCollapsed ? "Workspace" : "..."}
          </div>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/') && item.href !== '/dashboard'
            const Icon = item.icon
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors relative group ${isActive ? 'bg-[var(--persimmon)]/10 text-[var(--persimmon)]' : 'text-[var(--muted-text)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'}`}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && !isCollapsed && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--persimmon)] rounded-r-full" />
                )}
                <Icon size={20} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                {!isCollapsed && <span className="text-[14px] font-medium">{item.name}</span>}
              </Link>
            )
          })}

          <div className="mt-8 mb-2 px-3 text-[11px] font-semibold text-[var(--muted-text)] uppercase tracking-wider">
            {!isCollapsed ? "Administration" : "..."}
          </div>
          {SETTINGS_ITEMS.map(item => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-colors relative ${isActive ? 'bg-[var(--persimmon)]/10 text-[var(--persimmon)]' : 'text-[var(--muted-text)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'}`}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && !isCollapsed && (
                  <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--persimmon)] rounded-r-full" />
                )}
                <Icon size={20} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                {!isCollapsed && <span className="text-[14px] font-medium">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        <div className="p-3 border-t border-[var(--border-color)]">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 text-[var(--muted-text)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)] rounded-[10px] transition-colors"
          >
            <List size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-[14px] font-medium">Collapse Menu</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border-color)] z-30 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--persimmon)] flex items-center justify-center text-white font-semibold text-sm">
            {businessName.charAt(0)}
          </div>
          <span className="font-semibold text-[15px] truncate max-w-[150px]">{businessName}</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-[var(--foreground)] bg-[var(--surface-secondary)] rounded-full">
          <Plus size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto bg-[var(--surface-secondary)] relative">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-[var(--surface)] border-t border-[var(--border-color)] z-40 px-2 flex items-center justify-around pb-safe">
        {NAV_ITEMS.filter(i => i.primary).map(item => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-[var(--persimmon)]' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
            >
              <Icon size={24} weight={isActive ? "fill" : "regular"} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
        <button className="flex flex-col items-center justify-center w-16 h-full gap-1 text-[var(--muted-text)] hover:text-[var(--foreground)] transition-colors">
          <List size={24} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </div>
  )
}
