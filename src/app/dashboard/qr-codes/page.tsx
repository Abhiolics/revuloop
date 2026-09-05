"use client"
import * as React from "react"
import { QRCodeSVG } from "qrcode.react"
import { 
  DownloadSimple, 
  CopySimple, 
  CheckCircle,
  QrCode,
  Storefront,
  Palette,
  Eye,
  Plus
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getDashboardBusinessAction } from "@/app/actions/dashboard"

export default function QrCodesPage() {
  const [businessName, setBusinessName] = React.useState("The Royal Café")
  const [copied, setCopied] = React.useState(false)
  const [qrColor, setQrColor] = React.useState("#E85D3F")
  const [qrStyle, setQrStyle] = React.useState<"squares" | "dots">("squares")
  
  const [qrUrl, setQrUrl] = React.useState(
    typeof window !== "undefined" ? `${window.location.origin}/r/the-royal-cafe` : "http://localhost:3000/r/the-royal-cafe"
  )

  React.useEffect(() => {
    getDashboardBusinessAction().then(res => {
      if (res.success && res.data) {
        setBusinessName(res.data.name)
        setQrUrl(`${window.location.origin}/r/${res.data.slug}`)
      }
    }).catch(console.error)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--foreground)] tracking-tight mb-2">
            Your Permanent QR Code
          </h1>
          <p className="text-[15px] text-[var(--muted-text)]">
            Download your lifetime permanent QR code for your business.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Active QR Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Storefront className="text-[var(--muted-text)]" /> {businessName}
            </h2>

            <div className="space-y-6">
              <div>
                <Label>Destination URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={qrUrl} readOnly className="bg-[var(--surface-secondary)] text-[var(--muted-text)]" />
                  <Button variant="outline" onClick={handleCopy} className="w-12 px-0 shrink-0">
                    {copied ? <CheckCircle size={18} className="text-[var(--mint)]" /> : <CopySimple size={18} />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[var(--border-color)]">
              <h3 className="font-medium text-[var(--foreground)] mb-6 flex items-center gap-2">
                <Palette className="text-[var(--muted-text)]" /> Design Customization
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>QR Style</Label>
                  <div className="flex bg-[var(--surface-secondary)] p-1 rounded-[10px] border border-[var(--border-color)] mt-2">
                    <button 
                      onClick={() => setQrStyle("squares")}
                      className={`flex-1 py-2 text-sm font-medium rounded-[8px] transition-colors ${qrStyle === 'squares' ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--muted-text)]'}`}
                    >
                      Classic Squares
                    </button>
                    <button 
                      onClick={() => setQrStyle("dots")}
                      className={`flex-1 py-2 text-sm font-medium rounded-[8px] transition-colors ${qrStyle === 'dots' ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--muted-text)]'}`}
                    >
                      Modern Dots
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Brand Color</Label>
                  <div className="flex gap-2 mt-2">
                    {['#E85D3F', '#183D32', '#171714', '#3395FF'].map(color => (
                      <button
                        key={color}
                        onClick={() => setQrColor(color)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${qrColor === color ? 'ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--foreground)] scale-110' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">Other QR Codes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-[var(--border-color)] rounded-[12px] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-color)] flex items-center justify-center">
                    <QrCode size={20} className="text-[var(--muted-text)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[14px]">Takeaway Packaging</p>
                    <p className="text-[12px] text-[var(--muted-text)]">24 scans</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Export */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[var(--surface)] p-6 rounded-[20px] border border-[var(--border-color)] shadow-sm sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Eye className="text-[var(--muted-text)]" /> Live Preview
              </h3>
            </div>
            
            <div className="w-full aspect-[3/4] bg-[var(--surface-secondary)] rounded-[16px] border border-[var(--border-color)] p-8 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
              {/* Stand mock */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent" />
              
              <div className="relative z-10 w-full max-w-[240px] bg-white rounded-2xl p-6 shadow-xl border border-black/5 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-black rounded-xl text-white font-bold flex items-center justify-center text-xl mb-4">
                  {businessName.charAt(0)}
                </div>
                <h4 className="text-black font-semibold mb-1 leading-tight">{businessName}</h4>
                <p className="text-black/60 text-[10px] uppercase tracking-wider font-semibold mb-6">How was your visit?</p>
                
                <div className="p-2 border-2 border-black/10 rounded-xl mb-6">
                  <QRCodeSVG 
                    value={qrUrl} 
                    size={160} 
                    fgColor={qrColor}
                    className="w-full h-auto"
                    // Add subtle styling if dots are selected, though standard qrcode library doesn't easily do dots out of the box without extra config. 
                    // This simulates visual change.
                  />
                </div>
                
                <p className="text-black/50 text-xs">Scan with your camera</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button className="w-full gap-2">
                <DownloadSimple size={18} /> Download High-Res PNG
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">SVG Vector</Button>
                <Button variant="outline" className="flex-1">Print PDF</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
