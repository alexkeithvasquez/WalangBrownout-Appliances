export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`rounded-xl border border-border bg-surface transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
