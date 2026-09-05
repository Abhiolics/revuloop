"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  QrCode, 
  ChatTeardropText, 
  Star, 
  Users, 
  WarningCircle, 
  DownloadSimple 
} from "@phosphor-icons/react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from "recharts"
import { Button } from "@/components/ui/button"
import { getDashboardBusinessAction, getDashboardStatsAction } from "@/app/actions/dashboard"

const chartData = [
  { name: 'Mon', feedback: 4, scans: 24 },
  { name: 'Tue', feedback: 7, scans: 35 },
  { name: 'Wed', feedback: 5, scans: 28 },
  { name: 'Thu', feedback: 11, scans: 45 },
  { name: 'Fri', feedback: 18, scans: 80 },
  { name: 'Sat', feedback: 24, scans: 110 },
  { name: 'Sun', feedback: 15, scans: 75 },
]

export default function DashboardOverview() {
  const [greeting, setGreeting] = React.useState("Good Morning")
  const [businessName, setBusinessName] = React.useState("...")
  const [stats, setStats] = React.useState({
    totalFeedback: 0,
    averageRating: "0.0",
    totalCustomers: 0
  })

  React.useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 12 && hour < 17) setGreeting("Good Afternoon")
    else if (hour >= 17) setGreeting("Good Evening")

    getDashboardBusinessAction().then(res => {
      if (res.success && res.data) setBusinessName(res.data.name)
    })
    getDashboardStatsAction().then(res => {
      if (res.success && res.data) setStats(res.data)
    })
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            {greeting}, Arjun
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Here's what's happening at {businessName} today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 px-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-[8px] text-sm font-medium outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This month</option>
          </select>
          <Button variant="outline" className="h-10 gap-2">
            <DownloadSimple size={18} /> Get Report
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Alerts */}
        <motion.div variants={item} className="bg-[var(--destructive)]/10 border border-[var(--destructive)]/20 p-4 rounded-[16px] flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--destructive)]/20 flex items-center justify-center shrink-0">
            <WarningCircle size={24} className="text-[var(--destructive)]" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--destructive)] mb-1">2 Unresolved Critical Reviews</h3>
            <p className="text-sm text-[var(--destructive)]/80 mb-3">
              You have new 1-star and 2-star feedback that hasn't been addressed. Resolving these quickly prevents churn.
            </p>
            <Button size="sm" variant="outline" className="border-[var(--destructive)]/30 text-[var(--destructive)] hover:bg-[var(--destructive)] hover:text-white">
              View Feedback
            </Button>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <motion.div variants={item} className="bg-[var(--surface)] p-5 rounded-[20px] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--persimmon)]/10 flex items-center justify-center">
                <QrCode size={20} className="text-[var(--persimmon)]" weight="duotone" />
              </div>
              <span className="flex items-center text-xs font-medium text-[var(--mint)] bg-[var(--mint)]/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} className="mr-1" /> 12%
              </span>
            </div>
            <p className="text-sm text-[var(--muted-text)] font-medium mb-1">QR Scans</p>
            <h3 className="text-3xl font-mono font-semibold tracking-tight text-[var(--foreground)]">397</h3>
          </motion.div>

          <motion.div variants={item} className="bg-[var(--surface)] p-5 rounded-[20px] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#3395FF]/10 flex items-center justify-center">
                <ChatTeardropText size={20} className="text-[#3395FF]" weight="duotone" />
              </div>
              <span className="flex items-center text-xs font-medium text-[var(--mint)] bg-[var(--mint)]/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} className="mr-1" /> 8%
              </span>
            </div>
            <p className="text-sm text-[var(--muted-text)] font-medium mb-1">Feedback Received</p>
            <h3 className="text-3xl font-mono font-semibold tracking-tight text-[var(--foreground)]">{stats.totalFeedback}</h3>
          </motion.div>

          <motion.div variants={item} className="bg-[var(--surface)] p-5 rounded-[20px] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--soft-amber)]/20 flex items-center justify-center">
                <Star size={20} className="text-[var(--soft-amber)]" weight="fill" />
              </div>
              <span className="flex items-center text-xs font-medium text-[var(--destructive)] bg-[var(--destructive)]/10 px-2 py-1 rounded-full">
                <ArrowDownRight size={12} className="mr-1" /> 0.2
              </span>
            </div>
            <p className="text-sm text-[var(--muted-text)] font-medium mb-1">Average Rating</p>
            <h3 className="text-3xl font-mono font-semibold tracking-tight text-[var(--foreground)]">{stats.averageRating}</h3>
          </motion.div>

          <motion.div variants={item} className="bg-[var(--surface)] p-5 rounded-[20px] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--mint)]/20 flex items-center justify-center">
                <Users size={20} className="text-[var(--deep-forest)]" weight="duotone" />
              </div>
              <span className="flex items-center text-xs font-medium text-[var(--mint)] bg-[var(--mint)]/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} className="mr-1" /> 24%
              </span>
            </div>
            <p className="text-sm text-[var(--muted-text)] font-medium mb-1">Contacts Captured</p>
            <h3 className="text-3xl font-mono font-semibold tracking-tight text-[var(--foreground)]">{stats.totalCustomers}</h3>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div variants={item} className="md:col-span-2 bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-semibold text-lg text-[var(--foreground)]">Feedback Trend</h3>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--persimmon)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--persimmon)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-text)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-text)' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="feedback" stroke="var(--persimmon)" strokeWidth={3} fillOpacity={1} fill="url(#colorFeedback)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Feed */}
          <motion.div variants={item} className="bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg text-[var(--foreground)]">Recent Feedback</h3>
              <button className="text-sm font-medium text-[var(--persimmon)] hover:underline">View All</button>
            </div>
            
            <div className="flex-1 space-y-4">
              {[
                { name: "Priya S.", rating: 5, time: "2h ago", text: "Amazing food and quick service! Will definitely come back." },
                { name: "Anonymous", rating: 4, time: "5h ago", text: "Great ambience. The new dessert menu is fantastic." },
                { name: "Rahul", rating: 2, time: "1d ago", text: "The soup was cold and it took too long to get the bill." },
              ].map((fb, i) => (
                <div key={i} className="pb-4 border-b border-[var(--border-color)] last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-[var(--foreground)]">{fb.name}</span>
                    <span className="text-xs text-[var(--muted-text)]">{fb.time}</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={12} weight="fill" className={star <= fb.rating ? (fb.rating <= 3 ? "text-[var(--soft-amber)]" : "text-[var(--persimmon)]") : "text-[var(--border-color)]"} />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--muted-text)] line-clamp-2">{fb.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
