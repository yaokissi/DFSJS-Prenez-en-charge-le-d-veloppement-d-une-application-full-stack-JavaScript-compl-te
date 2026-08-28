import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('🛠️ Tests Unitaires - Utilitaires UI (lib/utils.ts)', () => {
  it('doit combiner correctement les classes CSS Tailwind avec cn()', () => {
    const result = cn('px-2 py-1', 'bg-red-500', { 'text-white': true, 'hidden': false })
    expect(result).toBe('px-2 py-1 bg-red-500 text-white')
  })
})
