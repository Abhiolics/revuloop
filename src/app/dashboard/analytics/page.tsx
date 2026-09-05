"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { 
  DownloadSimple, 
  ChartLineUp,
  Star,
  QrCode,
  Users,
  ChatTeardropText
} from "@phosphor-icons/react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Button } from "@/components/ui/button"

const ratingData = [
  { name: '1 Star', count: 12 },
  { name: '2 Stars', count: 8 },
  { name: '3 Stars', count: 15 },
  { name: '4 Stars', count: 45 },
  { name: '5 Stars', count: 89 },
]

const sentimentData = [
  { name: 'Positive', value: 75, color: 'var(--mint)' },
  { name: 'Neutral', value: 15, color: 'var(--soft-amber)' },
  { name: 'Negative', value: 10, color: 'var(--destructive)' },
]

export default function AnalyticsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            Analytics
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Deep dive into customer sentiment and engagement metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="h-10 px-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-[8px] text-sm font-medium outline-none">
            <option>Last 30 days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <Button variant="outline" className="h-10 gap-2">
            <DownloadSimple size={18} /> Export PDF
          </Button>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid lg:grid-cols-2 gap-6">
        
        {/* Rating Distribution */}
        <motion.div variants={item} className="bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm">
          <h3 className="font-semibold text-lg text-[var(--foreground)] mb-6">Rating Distribution</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-text)' }} width={60} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--surface-secondary)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index <= 2 ? 'var(--soft-amber)' : 'var(--persimmon)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sentiment Analysis */}
        <motion.div variants={item} className="bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm flex flex-col">
          <h3 className="font-semibold text-lg text-[var(--foreground)] mb-6">Sentiment Analysis</h3>
          <div className="flex-1 flex items-center justify-center relative min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-semibold">75%</span>
              <span className="text-sm text-[var(--muted-text)]">Positive</span>
            </div>
          </div>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div variants={item} className="bg-[var(--surface)] p-6 rounded-[24px] border border-[var(--border-color)] shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-lg text-[var(--foreground)] mb-6">Scan to Feedback Conversion</h3>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 bg-[var(--surface-secondary)] p-6 rounded-[16px] border border-[var(--border-color)] w-full text-center">
              <QrCode size={32} className="mx-auto mb-3 text-[var(--muted-text)]" />
              <p className="text-sm text-[var(--muted-text)] font-medium mb-1">Total QR Scans</p>
              <h4 className="text-3xl font-semibold">1,245</h4>
            </div>
            
            <div className="w-12 h-1 bg-[var(--border-color)] hidden md:block" />
            
            <div className="flex-1 bg-[var(--surface-secondary)] p-6 rounded-[16px] border border-[var(--border-color)] w-full text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--persimmon)]/10 rounded-bl-full" />
              <ChatTeardropText size={32} className="mx-auto mb-3 text-[var(--persimmon)]" />
              <p className="text-sm text-[var(--muted-text)] font-medium mb-1">Feedback Submitted</p>
              <h4 className="text-3xl font-semibold">312</h4>
              <p className="text-xs font-medium text-[var(--persimmon)] mt-2">25% Conversion Rate</p>
            </div>
            
            <div className="w-12 h-1 bg-[var(--border-color)] hidden md:block" />
            
            <div className="flex-1 bg-[var(--surface-secondary)] p-6 rounded-[16px] border border-[var(--border-color)] w-full text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--mint)]/20 rounded-bl-full" />
              <Users size={32} className="mx-auto mb-3 text-[var(--deep-forest)]" />
              <p className="text-sm text-[var(--muted-text)] font-medium mb-1">Contacts Captured</p>
              <h4 className="text-3xl font-semibold">142</h4>
              <p className="text-xs font-medium text-[var(--mint)] mt-2">45% Opt-in Rate</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
}
