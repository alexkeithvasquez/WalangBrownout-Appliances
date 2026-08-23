const STYLES = {
  standby: 'text-power border-power/30 bg-power/10',
  online: 'text-online border-online/30 bg-online/10',
  offline: 'text-muted border-border bg-surface-2',
  danger: 'text-danger border-danger/30 bg-danger/10',
}

const DOTS = {
  standby: 'bg-power',
  online: 'bg-online',
  offline: 'bg-muted',
  danger: 'bg-danger',
}

export default function Badge({ status = 'offline', pulse = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${STYLES[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${DOTS[status]} ${pulse ? 'animate-pulse-led' : ''}`}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
