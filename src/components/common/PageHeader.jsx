export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-power">{eyebrow}</p>
      )}
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{subtitle}</p>}
    </div>
  )
}
