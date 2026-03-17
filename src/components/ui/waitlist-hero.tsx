"use client"

import { useState, useRef } from "react"
import { Check } from "lucide-react"

export const WaitlistHero = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    // Simulate API delay
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      fireConfetti()
    }, 1500)
  }

  // --- Confetti Logic ---
  const fireConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[] = []
    const colors = ["#0ea5e9", "#10b981", "#fbbf24", "#f472b6", "#fff"]

    // Resize canvas to cover the button area mostly
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const createParticle = () => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12, // Random spread X
        vy: (Math.random() - 2) * 10, // Upward velocity
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      }
    }

    // Create batch of particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.5 // Gravity
        p.life -= 2

        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / 100)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    animate()
  }

  // Color tokens aligned with Clari theme
  const colors = {
    textMain: "#ffffff",
    textSecondary: "#94a3b8", // slate-400
    bluePrimary: "hsl(var(--primary))", 
    success: "#10b981", // emerald-500
    inputBg: "hsl(var(--secondary) / 0.5)",
    baseBg: "hsl(var(--background))",
    inputShadow: "rgba(255, 255, 255, 0.1)",
  }

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center">
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

      {/* Main Container */}
      <div
        className="relative w-full h-screen overflow-hidden shadow-2xl"
        style={{
          backgroundColor: colors.baseBg,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Background Decorative Layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            perspective: "1200px",
            transform: "perspective(1200px) rotateX(15deg)",
            transformOrigin: "center bottom",
            opacity: 1,
          }}
        >
          {/* Image 3 (Back) - Document / Notes */}
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: "2000px",
                height: "2000px",
                transform: "translate(-50%, -50%) rotate(279.05deg)",
                zIndex: 0,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=1974&auto=format&fit=crop"
                alt="Document Notes"
                className="w-full h-full object-cover opacity-10 rounded-full blur-sm grayscale"
              />
            </div>
          </div>

          {/* Image 2 (Middle) - Video Call / Discussion */}
          <div className="absolute inset-0 animate-spin-slow-reverse">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: "1000px",
                height: "1000px",
                transform: "translate(-50%, -50%) rotate(304.42deg)",
                zIndex: 1,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop"
                alt="Video Meeting"
                className="w-full h-full object-cover opacity-20 rounded-full mix-blend-luminosity"
              />
            </div>
          </div>

          {/* Image 1 (Front) - AI Action / Automation */}
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute top-1/2 left-1/2"
              style={{
                width: "800px",
                height: "800px",
                transform: "translate(-50%, -50%) rotate(48.33deg)",
                zIndex: 2,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1065&auto=format&fit=crop"
                alt="AI Intelligence"
                className="w-full h-full object-cover opacity-30 rounded-full mix-blend-screen"
              />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${colors.baseBg} 10%, rgba(9, 9, 11, 0.8) 40%, transparent 100%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-end pb-24 gap-6">
          <div className="w-16 h-16 rounded-2xl shadow-xl overflow-hidden mb-2 ring-1 ring-white/10 glass-card flex items-center justify-center bg-primary/20 backdrop-blur-md">
             <img src="/favicon.ico" alt="Clari Logo" className="w-10 h-10 object-contain" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight" style={{ color: colors.textMain }}>
            Never miss a <span className="gradient-text">detail</span>.
          </h1>

          <p className="text-lg font-medium" style={{ color: colors.textSecondary }}>
            Let AI transcribe, summarize, and act on your meetings.
          </p>

          {/* Form / Success Container */}
          <div className="w-full max-w-md px-4 mt-4 h-[60px] relative" style={{ perspective: "1000px" }}>
            {/* Confetti Canvas - overlays everything but ignores clicks */}
            <canvas
              ref={canvasRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
            />

            {/* SUCCESS STATE */}
            <div
              className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                status === "success"
                  ? "opacity-100 scale-100 rotate-x-0 animate-success-pulse animate-success-glow"
                  : "opacity-0 scale-95 -rotate-x-90 pointer-events-none"
              }`}
              style={{ backgroundColor: colors.success }}
            >
              {/* Celebration rings */}
              {status === "success" && (
                <>
                  <div
                    className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-400 animate-ring"
                    style={{ animationDelay: "0s" }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-300 animate-ring"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-200 animate-ring"
                    style={{ animationDelay: "0.3s" }}
                  />
                </>
              )}
              <div
                className={`flex items-center gap-2 text-white font-semibold text-lg ${status === "success" ? "animate-bounce-in" : ""}`}
              >
                <div className="bg-white/20 p-1 rounded-full">
                  <Check className={`w-5 h-5 ${status === "success" ? "animate-checkmark" : ""}`} />
                </div>
                <span>You're on the list!</span>
              </div>
            </div>

            {/* FORM STATE */}
            <form
              onSubmit={handleSubmit}
              className={`relative w-full h-full group transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                status === "success"
                  ? "opacity-0 scale-95 rotate-x-90 pointer-events-none"
                  : "opacity-100 scale-100 rotate-x-0"
              }`}
            >
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={email}
                disabled={status === "loading"}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[60px] pl-6 pr-[150px] rounded-full outline-none transition-all duration-200 placeholder-muted-foreground disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-md"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.textMain,
                  boxShadow: `inset 0 0 0 1px ${colors.inputShadow}`,
                }}
              />

              <div className="absolute top-[6px] right-[6px] bottom-[6px]">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-full px-6 rounded-full font-medium text-white transition-all active:scale-95 hover:opacity-90 disabled:hover:opacity-100 disabled:active:scale-100 disabled:cursor-wait flex items-center justify-center min-w-[130px] shadow-lg shadow-primary/20"
                  style={{ backgroundColor: colors.bluePrimary }}
                >
                  {status === "loading" ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Get Early Access"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
