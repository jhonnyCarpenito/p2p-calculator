import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeOption = 'light' | 'dark' | 'system'

const labels: Record<ThemeOption, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const cycle = () => {
    if (resolvedTheme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      className={cn('shrink-0 relative', className)}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={`Tema: ${labels[theme]} (clic para cambiar)`}
    >
      <span className="relative inline-flex h-4 w-4">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute inset-0 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </span>
    </Button>
  )
}
