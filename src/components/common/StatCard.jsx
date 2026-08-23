import Card from './Card'

const TONES = {
  neutral: 'text-ink',
  danger: 'text-danger',
  warning: 'text-power',
  success: 'text-online',
}

export default function StatCard({ label, value, hint, tone = 'neutral' }) {
  return (
    <Card className="p-5">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-2 font-display text-2xl font-semibold ${TONES[tone]}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  )
}
