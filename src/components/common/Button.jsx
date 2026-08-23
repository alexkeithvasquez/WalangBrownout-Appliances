const VARIANTS = {
  primary: 'bg-power text-bg border-transparent hover:bg-power/90',
  secondary: 'bg-transparent text-ink border-border hover:border-power/50 hover:text-power',
  ghost: 'bg-transparent text-muted border-transparent hover:text-ink',
}

export default function Button({
  variant = 'primary',
  as: Tag = 'button',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 font-body text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-power disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
