import { Link } from 'react-router-dom'
import Card from './common/Card'
import Badge from './common/Badge'
import Button from './common/Button'

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-border">
        <div 
          className="absolute inset-0 h-full w-full opacity-40"
          style={{
            backgroundImage: 'url("/home-bg.avif")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/60 to-bg" />
        
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-power">
            Inventory Management System
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
            From weekly spreadsheets to real-time inventory control.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Every sale, pick, and count updates on-hand, reserved, and available stock instantly — 
            closing the gap that used to turn into panic overorders, phantom stock, and expired filters 
            no one caught in time.
          </p>
        </div>
      </section>
    </main>
  )
}