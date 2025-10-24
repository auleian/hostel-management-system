// No React import required with Vite + modern JSX transform
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center">
              {!isLast && item.to ? (
                <Link to={item.to} className="text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-foreground' : 'text-muted-foreground'}>{item.label}</span>
              )}
              {!isLast && (
                <svg className="w-3 h-3 mx-2 text-muted-foreground" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
