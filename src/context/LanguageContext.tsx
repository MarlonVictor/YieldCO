'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import pt from '@/locales/pt.json'
import en from '@/locales/en.json'

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────

type Lang = 'pt' | 'en'

type Translations = typeof pt // estrutura tipada a partir do pt.json

interface LanguageContextValue {
  lang: Lang
  toggleLang: () => void
  t: (key: string) => string
}

// ──────────────────────────────────────────────
// Contexto
// ──────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'yield.co:lang'
const dictionaries: Record<Lang, Translations> = { pt, en }

// ──────────────────────────────────────────────
// Provider
// ──────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')

  // Recuperar preferência salva no localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (saved === 'pt' || saved === 'en') setLang(saved)
    } catch {
      // localStorage pode não estar disponível em SSR
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next: Lang = prev === 'pt' ? 'en' : 'pt'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {}
      return next
    })
  }, [])

  // Navega no objeto de traduções usando dot notation
  // Ex: t('sidebar.nav.stocks') → 'Ações' ou 'Stocks'
  const t = useCallback(
    (key: string): string => {
      const dict = dictionaries[lang]
      const value = key.split('.').reduce<unknown>((obj, segment) => {
        if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[segment]
        return undefined
      }, dict)

      if (typeof value === 'string') return value

      // Fallback: retorna a própria chave para facilitar debug
      console.warn(`[i18n] Chave não encontrada: "${key}" (lang: ${lang})`)
      return key
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ──────────────────────────────────────────────
// Hook
// ──────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage deve ser usado dentro de <LanguageProvider>')
  return ctx
}
