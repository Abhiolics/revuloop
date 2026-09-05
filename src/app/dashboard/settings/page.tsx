"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { 
  Storefront, 
  MapPin, 
  Users, 
  ChatTeardropText, 
  Bell, 
  PaintBrush, 
  ShieldCheck 
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDashboardBusinessAction } from "@/app/actions/dashboard"

const tabs = [
  { id: "profile", label: "Business Profile", icon: Storefront },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "team", label: "Team", icon: Users },
  { id: "form", label: "Feedback Form", icon: ChatTeardropText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: PaintBrush },
  { id: "security", label: "Security", icon: ShieldCheck },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("profile")
  const [business, setBusiness] = React.useState<any>(null)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    getDashboardBusinessAction().then(res => {
      if (res.success && res.data) {
        setBusiness(res.data)
      }
    }).catch(console.error)
  }, [])

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            Settings
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Manage your workspace preferences and account details.
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setHasChanges(false)}>Cancel</Button>
            <Button onClick={() => setHasChanges(false)}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-colors text-left ${
                  isActive 
                    ? 'bg-[var(--surface)] border border-[var(--border-color)] shadow-sm text-[var(--foreground)]' 
                    : 'text-[var(--muted-text)] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)] border border-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[var(--persimmon)]' : ''} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          <div className="bg-[var(--surface)] rounded-[24px] border border-[var(--border-color)] p-6 md:p-8 shadow-sm min-h-[500px]">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Business Profile</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-[var(--border-color)]">
                    <div className="w-20 h-20 bg-[var(--surface-secondary)] rounded-2xl flex items-center justify-center text-2xl font-bold border border-[var(--border-color)]">
                      {business?.name ? business.name.charAt(0) : "..."}
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mb-2">Change Logo</Button>
                      <p className="text-xs text-[var(--muted-text)]">Recommended size: 512x512px</p>
                    </div>
                  </div>

                  <div>
                    <Label>Legal Business Name</Label>
                    <Input defaultValue={business?.legalName || ""} onChange={() => setHasChanges(true)} />
                  </div>
                  <div>
                    <Label>Display Name</Label>
                    <Input defaultValue={business?.name || ""} onChange={() => setHasChanges(true)} />
                  </div>
                  <div>
                    <Label>Support Email</Label>
                    <Input type="email" defaultValue={business?.businessEmail || ""} onChange={() => setHasChanges(true)} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "form" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-6">Feedback Form</h2>
                <p className="text-sm text-[var(--muted-text)] mb-8">Customize what your customers see when they scan your QR code.</p>
                
                <div className="space-y-6">
                  <div>
                    <Label>Welcome Message</Label>
                    <Input defaultValue="How was your experience today?" onChange={() => setHasChanges(true)} />
                  </div>
                  
                  <div>
                    <Label>Customer Details Collection</Label>
                    <div className="space-y-3 mt-2">
                      <label className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-[12px] bg-[var(--surface-secondary)]">
                        <input type="checkbox" defaultChecked className="rounded text-[var(--persimmon)]" onChange={() => setHasChanges(true)} />
                        <span className="text-sm font-medium">Ask for Name (Optional)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-[12px] bg-[var(--surface-secondary)]">
                        <input type="checkbox" defaultChecked className="rounded text-[var(--persimmon)]" onChange={() => setHasChanges(true)} />
                        <span className="text-sm font-medium">Ask for Email/Phone (Optional)</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-[12px] bg-[var(--surface-secondary)]">
                        <input type="checkbox" defaultChecked className="rounded text-[var(--persimmon)]" onChange={() => setHasChanges(true)} />
                        <span className="text-sm font-medium flex-1">Marketing Consent Checkbox</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Google Review Redirection</Label>
                    <p className="text-xs text-[var(--muted-text)] mb-3">Ask customers to post their feedback to Google Maps after submitting.</p>
                    <label className="flex items-center gap-3 p-3 border border-[var(--border-color)] rounded-[12px]">
                      <input type="checkbox" defaultChecked className="rounded text-[var(--persimmon)]" onChange={() => setHasChanges(true)} />
                      <span className="text-sm font-medium">Enable Google Review CTA</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== "profile" && activeTab !== "form" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[300px] text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-4 text-[var(--muted-text)] border border-[var(--border-color)]">
                  <PaintBrush size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{tabs.find(t => t.id === activeTab)?.label} Settings</h3>
                <p className="text-[var(--muted-text)] max-w-sm">This section is available in the full release. (Mock UI)</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
