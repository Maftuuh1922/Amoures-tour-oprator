import { clsx } from 'clsx'

export function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, ...props }) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-dark shadow-md hover:shadow-lg',
    secondary: 'bg-white hover:bg-primary-light text-dark border-2 border-primary shadow-md hover:shadow-lg',
    outline: 'bg-transparent hover:bg-white/10 text-white border-2 border-white',
    dark: 'bg-dark hover:bg-gray-800 text-white shadow-md hover:shadow-lg',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
