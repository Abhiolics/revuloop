"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MagnifyingGlass, 
  Funnel, 
  DownloadSimple, 
  List, 
  SquaresFour,
  CaretDown,
  Star,
  CheckCircle,
  Clock,
  Archive,
  DotsThree
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const MOCK_FEEDBACK = [
  { id: "1", rating: 5, customer: "Priya S.", comment: "Amazing food and quick service! Will definitely come back.", tags: ["Food Quality", "Service"], date: "2 hours ago", source: "Billing Counter", status: "resolved" },
  { id: "2", rating: 2, customer: "Rahul", comment: "The soup was cold and it took too long to get the bill.", tags: ["Service", "Wait Time"], date: "1 day ago", source: "Table 14", status: "new" },
  { id: "3", rating: 4, customer: "Anonymous", comment: "Great ambience. The new dessert menu is fantastic.", tags: ["Ambience", "Menu"], date: "2 days ago", source: "Billing Counter", status: "in_progress" },
  { id: "4", rating: 1, customer: "Amit K.", comment: "Found a hair in my food. Terrible experience.", tags: ["Food Quality", "Hygiene"], date: "3 days ago", source: "Table 05", status: "archived" },
  { id: "5", rating: 5, customer: "Neha", comment: "Best coffee in Hazratganj!", tags: ["Food Quality"], date: "4 days ago", source: "Takeaway", status: "resolved" },
]

export default function FeedbackPage() {
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list")
  const [search, setSearch] = React.useState("")
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  const toggleSelectAll = () => {
    if (selectedIds.size === MOCK_FEEDBACK.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(MOCK_FEEDBACK.map(f => f.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "new": return "bg-[var(--destructive)]/10 text-[var(--destructive)]"
      case "in_progress": return "bg-[var(--soft-amber)]/20 text-[var(--dark-persimmon)]"
      case "resolved": return "bg-[var(--mint)]/20 text-[var(--deep-forest)]"
      case "archived": return "bg-[var(--surface-secondary)] text-[var(--muted-text)]"
      default: return "bg-[var(--surface-secondary)] text-[var(--muted-text)]"
    }
  }
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new": return "New"
      case "in_progress": return "In Progress"
      case "resolved": return "Resolved"
      case "archived": return "Archived"
      default: return "Unknown"
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            Feedback Inbox
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Manage, filter, and respond to private customer feedback.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 gap-2">
            <DownloadSimple size={18} /> Export
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--surface)] p-4 rounded-[16px] border border-[var(--border-color)] shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-text)]" />
            <Input 
              placeholder="Search feedback..." 
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-10 gap-2 shrink-0">
            <Funnel size={16} /> Filters
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--surface-secondary)] rounded-[8px] p-1 border border-[var(--border-color)]">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-[6px] transition-colors ${viewMode === 'list' ? 'bg-[var(--surface)] shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-[var(--surface)] shadow-sm text-[var(--foreground)]' : 'text-[var(--muted-text)] hover:text-[var(--foreground)]'}`}
            >
              <SquaresFour size={18} />
            </button>
          </div>
          <select className="h-10 px-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-[8px] text-sm font-medium outline-none">
            <option>Newest first</option>
            <option>Lowest rating</option>
            <option>Highest rating</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions (Visible when selected) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--surface-raised)] border border-[var(--persimmon)]/20 p-3 rounded-[12px] mb-6 flex items-center justify-between"
          >
            <span className="text-sm font-medium px-2">{selectedIds.size} selected</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8">Mark Resolved</Button>
              <Button size="sm" variant="outline" className="h-8">Archive</Button>
              <Button size="sm" variant="ghost" className="h-8 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]">Delete</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-[var(--surface)] rounded-[16px] border border-[var(--border-color)] shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-wider text-[var(--muted-text)] bg-[var(--surface-secondary)]">
                  <th className="p-4 w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-[var(--border-color)] text-[var(--persimmon)] focus:ring-[var(--persimmon)]"
                      checked={selectedIds.size === MOCK_FEEDBACK.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium w-[40%]">Feedback</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {MOCK_FEEDBACK.map(item => (
                  <tr key={item.id} className={`hover:bg-[var(--surface-secondary)]/50 transition-colors ${selectedIds.has(item.id) ? 'bg-[var(--persimmon)]/5' : ''}`}>
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-[var(--border-color)] text-[var(--persimmon)] focus:ring-[var(--persimmon)]"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} size={14} weight="fill" className={star <= item.rating ? (item.rating <= 3 ? "text-[var(--soft-amber)]" : "text-[var(--persimmon)]") : "text-[var(--border-color)]"} />
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-[14px] font-medium text-[var(--foreground)]">{item.customer}</p>
                      <p className="text-[12px] text-[var(--muted-text)]">{item.date}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-[14px] text-[var(--foreground)] line-clamp-1 mb-1">{item.comment}</p>
                      <div className="flex gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-[var(--surface-raised)] border border-[var(--border-color)] px-2 py-0.5 rounded-full text-[var(--muted-text)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[13px] text-[var(--muted-text)]">{item.source}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${getStatusStyle(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <DotsThree size={20} weight="bold" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between text-sm text-[var(--muted-text)] mt-auto bg-[var(--surface)]">
            <span>Showing 1 to 5 of 5 entries</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 px-3" disabled>Prev</Button>
              <Button variant="outline" size="sm" className="h-8 px-3" disabled>Next</Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid View (Empty/Placeholder for completeness) */}
      {viewMode === "grid" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_FEEDBACK.map(item => (
            <div key={item.id} className="bg-[var(--surface)] p-5 rounded-[16px] border border-[var(--border-color)] shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={16} weight="fill" className={star <= item.rating ? (item.rating <= 3 ? "text-[var(--soft-amber)]" : "text-[var(--persimmon)]") : "text-[var(--border-color)]"} />
                  ))}
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${getStatusStyle(item.status)}`}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              <p className="text-[15px] text-[var(--foreground)] mb-4">{item.comment}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(tag => (
                  <span key={tag} className="text-[11px] bg-[var(--surface-secondary)] px-2 py-1 rounded-[6px] text-[var(--muted-text)]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-[var(--foreground)]">{item.customer}</p>
                  <p className="text-xs text-[var(--muted-text)]">{item.date} • {item.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
